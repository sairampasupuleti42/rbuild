import { computed } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { AppComponent } from './app.component';

describe('AppComponent', () => {
  beforeEach(() => {
    TestBed.resetTestingModule();
    localStorage.clear();
    vi.restoreAllMocks();
  });

  it('updates and persists a language selected in the rendered form', async () => {
    await TestBed.configureTestingModule({ imports: [AppComponent] }).compileComponents();
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();

    const languageSelect = fixture.nativeElement.querySelector('#language-select') as HTMLSelectElement;
    expect(languageSelect.value).toBe('en');

    languageSelect.value = 'te';
    languageSelect.dispatchEvent(new Event('change'));
    await fixture.whenStable();
    fixture.detectChanges();

    expect(fixture.componentInstance.language()).toBe('te');
    expect(localStorage.getItem('rbuild-language')).toBe('te');
    expect(fixture.nativeElement.querySelector('h1').textContent).toContain('మీ నిర్మాణానికి');
  });

  it('restores a supported language and persists later selections', () => {
    localStorage.setItem('rbuild-language', 'te');
    const app = new AppComponent();

    expect(app.language()).toBe('te');
    expect(app.t('language')).toBe('భాష');

    app.setLanguage('en');

    expect(app.language()).toBe('en');
    expect(localStorage.getItem('rbuild-language')).toBe('en');
    expect(app.t('missing-key')).toBe('missing-key');
  });

  it('uses English when there is no supported stored language', () => {
    localStorage.setItem('rbuild-language', 'fr');

    expect(new AppComponent().language()).toBe('en');
  });

  it('calculates material estimates and translates every material type', () => {
    const app = new AppComponent();
    app.plotAreaSft.set(1000);
    app.floors.set(2);

    expect(app.estimates().map(item => item.primaryQty)).toEqual([840, 6.89, 36, 27, 17000]);
    expect(app.translatedEstimates().map(item => item.name)).toEqual([
      'Cement Bags (50 kg)',
      'TMT Steel Rebars',
      'Sand (M-Sand / River Sand)',
      'Stone Aggregate (Blue Metal)',
      'Red Clay Bricks'
    ]);

    app.setLanguage('te');
    expect(app.translatedEstimates()[0].name).toBe('సిమెంట్ సంచులు (50 కిలోలు)');

    app.brickType.set('cement');
    expect(app.estimates()[4].primaryQty).toBe(2800);
    expect(app.translatedEstimates()[4].name).toBe('సిమెంట్ కాంక్రీట్ బ్లాకులు');

    app.plotAreaSft.set(0);
    expect(app.totalBuiltUpArea()).toBe(0);
    expect(app.estimates().every(item => item.primaryQty === 0)).toBe(true);
  });

  it('updates, validates, totals, and resets material rates', () => {
    const app = new AppComponent();
    expect(app.allMaterialRatesEntered()).toBe(false);

    app.updateMaterialRate('cement', -1);
    app.updateMaterialRate('steel', Number.NaN);
    app.updateMaterialRate('sand', 0);
    expect(app.materialRates()).toEqual({ cement: 0, steel: 0, sand: 0, stone: 0, bricks: 0 });

    app.plotAreaSft.set(100);
    app.floors.set(1);
    app.updateMaterialRate('cement', 10);
    app.updateMaterialRate('steel', 20);
    app.updateMaterialRate('sand', 30);
    app.updateMaterialRate('stone', 40);
    app.updateMaterialRate('bricks', 50);

    expect(app.allMaterialRatesEntered()).toBe(true);
    expect(app.materialCostLines().map(line => line.rateUnit)).toEqual([
      'per 50 kg bag',
      'per tonne',
      'per unit (100 cu. ft.)',
      'per unit (100 cu. ft.)',
      'per piece'
    ]);
    expect(app.materialCostTotal()).toBe(
      app.estimates().reduce((total, item, index) => total + item.primaryQty * [10, 20, 30, 40, 50][index], 0)
    );

    app.city.set('Pune');
    app.brickType.set('cement');
    app.planPdf.set(new File(['plan'], 'plan.pdf', { type: 'application/pdf' }));
    app.planPdfError.set('some error');
    app.resetForm();
    expect(app.plotAreaSft()).toBe(1200);
    expect(app.floors()).toBe(0);
    expect(app.brickType()).toBe('clay');
    expect(app.city()).toBe('');
    expect(app.planPdf()).toBeNull();
    expect(app.planPdfError()).toBe('');
    expect(app.materialRates()).toEqual({ cement: 0, steel: 0, sand: 0, stone: 0, bricks: 0 });
  });

  it('reports a missing estimate rather than returning an invalid cost line', () => {
    const app = new AppComponent();
    app.translatedEstimates = computed(() => []);

    expect(() => app.materialCostLines()).toThrow('Missing material estimate for cement');
  });

  it('accepts and validates plan PDF uploads', () => {
    const app = new AppComponent();
    const validPdf = new File(['plan'], 'floor-plan.pdf', { type: 'application/pdf' });
    const validInput = document.createElement('input');
    validInput.type = 'file';
    Object.defineProperty(validInput, 'files', {
      value: { item: () => validPdf }
    });

    app.onPlanPdfSelected({ target: validInput } as unknown as Event);

    expect(app.planPdf()).toBe(validPdf);
    expect(app.planPdfError()).toBe('');
    expect(app.formatPdfSize(validPdf.size)).toBe('1 KB');
    expect(app.formatPdfSize(2 * 1024 * 1024)).toBe('2.0 MB');

    const emptyInput = document.createElement('input');
    emptyInput.type = 'file';
    Object.defineProperty(emptyInput, 'files', {
      value: { item: () => null }
    });
    app.onPlanPdfSelected({ target: emptyInput } as unknown as Event);
    expect(app.planPdf()).toBe(validPdf);

    const invalidInput = document.createElement('input');
    invalidInput.type = 'file';
    const invalidFile = new File(['drawing'], 'drawing.png', { type: 'image/png' });
    Object.defineProperty(invalidInput, 'files', {
      value: { item: () => invalidFile }
    });

    app.onPlanPdfSelected({ target: invalidInput } as unknown as Event);

    expect(app.planPdf()).toBeNull();
    expect(app.planPdfError()).toBe('Please choose a PDF file.');

    const oversizedPdf = new File(['plan'], 'large-plan.pdf', { type: 'application/pdf' });
    Object.defineProperty(oversizedPdf, 'size', { value: 26 * 1024 * 1024 });
    const oversizedInput = document.createElement('input');
    oversizedInput.type = 'file';
    Object.defineProperty(oversizedInput, 'files', {
      value: { item: () => oversizedPdf }
    });

    app.onPlanPdfSelected({ target: oversizedInput } as unknown as Event);

    expect(app.planPdf()).toBeNull();
    expect(app.planPdfError()).toBe('The PDF must be 25 MB or smaller.');

    app.removePlanPdf();
    expect(app.planPdf()).toBeNull();
    expect(app.planPdfError()).toBe('');
  });

  it('translates checklist items and toggles only the requested item', () => {
    const app = new AppComponent();
    expect(app.totalChecklistItems()).toBe(17);
    expect(app.completedChecklistItems()).toBe(0);

    app.toggleChecklistItem('planning', 'approved-drawings');
    expect(app.completedChecklistItems()).toBe(1);
    expect(app.translatedChecklist()[0].items[0].text).toBe(
      'Keep current, approved architectural and structural drawings and local permissions available on site.'
    );

    app.setLanguage('te');
    expect(app.translatedChecklist()[0].items[0].text).toContain('ఆమోదిత');

    app.checklist.update(phases => [...phases, {
      id: 'custom-phase',
      title: 'Custom phase',
      items: [{ id: 'custom-item', text: 'Custom item', checked: false }]
    }]);
    expect(app.translatedChecklist().at(-1)?.title).toBe('custom-phase');
    expect(app.translatedChecklist().at(-1)?.items[0].text).toBe('custom-item');

    app.toggleChecklistItem('planning', 'not-an-item');
    app.toggleChecklistItem('not-a-phase', 'custom-item');
    expect(app.completedChecklistItems()).toBe(1);

    app.toggleChecklistItem('custom-phase', 'custom-item');
    expect(app.completedChecklistItems()).toBe(2);
  });

  it('handles install prompt lifecycle and printing', async () => {
    const app = new AppComponent();
    await expect(app.installApp()).resolves.toBeUndefined();
    expect(app.installPrompt()).toBeNull();

    const prompt = vi.fn().mockResolvedValue(undefined);
    const event = Object.assign(new Event('beforeinstallprompt'), {
      prompt,
      userChoice: Promise.resolve({ outcome: 'accepted' as const, platform: 'web' })
    });
    const preventDefault = vi.spyOn(event, 'preventDefault');

    app.onBeforeInstallPrompt(event);
    expect(preventDefault).toHaveBeenCalledOnce();
    expect(app.installPrompt()).toBe(event);

    await app.installApp();
    expect(prompt).toHaveBeenCalledOnce();
    expect(app.installPrompt()).toBeNull();

    app.onBeforeInstallPrompt(event);
    app.dismissInstallPrompt();
    expect(app.installPrompt()).toBeNull();

    app.onBeforeInstallPrompt(event);
    app.onAppInstalled();
    expect(app.installPrompt()).toBeNull();

    const print = vi.spyOn(window, 'print').mockImplementation(() => undefined);
    app.print();
    expect(print).toHaveBeenCalledOnce();
  });
});
