import { getDocument, GlobalWorkerOptions } from 'pdfjs-dist';
import type { PDFDocumentProxy } from 'pdfjs-dist';

export type PlanExtractionErrorCode = 'unreadable' | 'missing-area' | 'missing-floors';

export class PlanExtractionError extends Error {
  constructor(readonly code: PlanExtractionErrorCode) {
    super(code);
    this.name = 'PlanExtractionError';
  }
}

export interface PlanSummary {
  totalAreaSqFt: number;
  floors: number;
}

const AREA_UNIT = '(?:SQ\\.?\\s*(?:M(?:2)?|MET(?:RE|ER)S?|FT(?:2)?|FEET)|SQUARE\\s*(?:MET(?:RE|ER)S?|FEET))';
const AREA_VALUE = `(\\d[\\d,]*(?:\\.\\d+)?)\\s*(${AREA_UNIT})\\b`;
const FLOOR_NAME = 'GROUND|FIRST|SECOND|THIRD|FOURTH|FIFTH|SIXTH|SEVENTH|EIGHTH|NINTH|TENTH';
const SQ_METRES_TO_SQ_FEET = 10.7639104167;

function areaInSquareFeet(value: string, unit: string): number {
  const area = Number(value.replaceAll(',', ''));
  return /(?:SQ\.?\s*M|SQUARE\s*M|MET)/i.test(unit) ? area * SQ_METRES_TO_SQ_FEET : area;
}

export function parsePlanText(text: string): PlanSummary {
  const normalized = text.replace(/\s+/g, ' ').trim().toUpperCase();
  if (!normalized) {
    throw new PlanExtractionError('unreadable');
  }

  const floorNames = new Set(
    [...normalized.matchAll(new RegExp(`\\b(?:PROPOSED\\s+)?(${FLOOR_NAME})\\s+FLOOR\\b`, 'g'))]
      .map(match => match[1])
  );
  const floorAreas = new Map<string, number>();
  const floorAreaPattern = new RegExp(
    `\\b(?:PROPOSED\\s+)?(${FLOOR_NAME})\\s+FLOOR\\s+BUILT[\\s-]*UP\\s+AREA\\s*[-:–]*\\s*${AREA_VALUE}`,
    'g'
  );
  for (const match of normalized.matchAll(floorAreaPattern)) {
    floorAreas.set(match[1], areaInSquareFeet(match[2], match[3]));
  }

  const totalAreaMatch = normalized.match(
    new RegExp(`TOTAL\\s+BUILT[\\s-]*UP\\s+AREA\\s*[-:–]*\\s*${AREA_VALUE}`)
  );
  const floors = floorNames.size || floorAreas.size;
  if (!floors) {
    throw new PlanExtractionError('missing-floors');
  }

  const totalAreaSqFt = totalAreaMatch
    ? areaInSquareFeet(totalAreaMatch[1], totalAreaMatch[2])
    : [...floorAreas.values()].reduce((total, area) => total + area, 0);
  if (!Number.isFinite(totalAreaSqFt) || totalAreaSqFt <= 0) {
    throw new PlanExtractionError('missing-area');
  }

  return { totalAreaSqFt, floors };
}

export async function extractPlanSummary(file: File): Promise<PlanSummary> {
  GlobalWorkerOptions.workerSrc = new URL('assets/pdf.worker.min.mjs', document.baseURI).toString();

  let documentProxy: PDFDocumentProxy;
  try {
    const data = new Uint8Array(await file.arrayBuffer());
    documentProxy = await getDocument({ data }).promise;
  } catch {
    throw new PlanExtractionError('unreadable');
  }

  try {
    const pageText = await Promise.all(
      Array.from({ length: documentProxy.numPages }, async (_, index) => {
        const page = await documentProxy.getPage(index + 1);
        const content = await page.getTextContent();
        return content.items.map(item => 'str' in item ? item.str : '').join(' ');
      })
    );
    return parsePlanText(pageText.join(' '));
  } catch (error) {
    if (error instanceof PlanExtractionError) {
      throw error;
    }
    throw new PlanExtractionError('unreadable');
  } finally {
    await documentProxy.destroy();
  }
}
