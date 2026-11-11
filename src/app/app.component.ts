import { Component, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

type MaterialRateId = 'cement' | 'steel' | 'sand' | 'stone' | 'bricks';

export interface MaterialItem {
  id: MaterialRateId;
  name: string;
  category: string;
  primaryQty: number;
  primaryUnit: string;
  secondaryQty: number;
  secondaryUnit: string;
  laymanVehicle: string;
  badge: string;
  icon: string;
  tip: string;
}

interface ChecklistItem {
  id: string;
  text: string;
  checked: boolean;
}

interface ChecklistPhase {
  id: string;
  title: string;
  standard?: string;
  items: ChecklistItem[];
}

interface MaterialCostLine {
  id: MaterialRateId;
  name: string;
  quantity: number;
  unit: string;
  rate: number;
  rateUnit: string;
  cost: number;
}

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './app.component.html'
})
export class AppComponent {
  // Layman Inputs
  plotAreaSft = signal<number>(1200);
  floors = signal<number>(2);
  brickType = signal<'clay' | 'cement'>('clay');
  city = signal('');
  materialRates = signal<Record<MaterialRateId, number>>({
    cement: 0,
    steel: 0,
    sand: 0,
    stone: 0,
    bricks: 0
  });
  rateFields: { id: MaterialRateId; name: string; unit: string }[] = [
    { id: 'cement', name: 'Cement', unit: 'per 50 kg bag' },
    { id: 'steel', name: 'TMT steel', unit: 'per tonne' },
    { id: 'sand', name: 'Sand', unit: 'per unit (100 cu. ft.)' },
    { id: 'stone', name: 'Stone aggregate', unit: 'per unit (100 cu. ft.)' },
    { id: 'bricks', name: 'Bricks / blocks', unit: 'per piece' }
  ];
  checklist = signal<ChecklistPhase[]>([
    {
      id: 'planning',
      title: 'Planning and setting out',
      items: [
        { id: 'approved-drawings', text: 'Keep current, approved architectural and structural drawings and local permissions available on site.', checked: false },
        { id: 'soil-design', text: 'Confirm the foundation design is based on the site soil investigation; refer unexpected soil, water, or nearby-structure conditions to the engineer before proceeding.', checked: false },
        { id: 'site-setting-out', text: 'Verify plot boundaries, building lines, grid lines, levels, and underground services against the approved drawings before excavation.', checked: false }
      ]
    },
    {
      id: 'foundation',
      title: 'Excavation and foundation',
      items: [
        { id: 'excavation-review', text: 'Check excavation dimensions and founding stratum against the drawings; obtain the engineer’s approval before covering the foundation bed.', checked: false },
        { id: 'foundation-rebar', text: 'Before the pour, check reinforcement size, spacing, laps, anchorage, cover, and formwork against structural drawings.', checked: false },
        { id: 'foundation-record', text: 'Record concrete delivery or batch details, inspection, testing, and curing for the foundation work.', checked: false }
      ]
    },
    {
      id: 'reinforced-concrete',
      title: 'Reinforced concrete frame',
      standard: 'IS 456, IS 10262, IS 383, IS 1786',
      items: [
        { id: 'material-documents', text: 'Check cement, reinforcement, and aggregate deliveries against project specifications; retain required certificates and test records.', checked: false },
        { id: 'rebar-inspection', text: 'Before each pour, verify reinforcement, cover blocks, formwork dimensions and stability, and all planned sleeves or embedded services against the drawings.', checked: false },
        { id: 'approved-mix', text: 'Use the approved concrete mix and batching method; do not add water at site without authorization.', checked: false },
        { id: 'concrete-placement', text: 'Place and compact concrete using the approved method; use only approved construction-joint locations and record required fresh-concrete and strength tests.', checked: false },
        { id: 'concrete-curing', text: 'Protect and cure concrete as specified; keep curing and test records, and remove formwork only when authorized.', checked: false }
      ]
    },
    {
      id: 'masonry-waterproofing',
      title: 'Masonry and waterproofing',
      standard: 'IS 1077 (burnt clay bricks), IS 2185 (Part 1) (concrete masonry units)',
      items: [
        { id: 'masonry-units', text: 'Check masonry units against the specified type, dimensions, condition, and required test or product documents.', checked: false },
        { id: 'masonry-work', text: 'Follow the specified mortar and unit preparation; check wall line, level, plumb, joints, openings, and lintels as work proceeds.', checked: false },
        { id: 'waterproofing', text: 'Inspect waterproofing substrate, junctions, upstands, outlets, and falls; complete the specified leak test before covering the work.', checked: false }
      ]
    },
    {
      id: 'services-handover',
      title: 'Services and handover',
      items: [
        { id: 'concealed-services', text: 'Complete and record required plumbing leak/pressure tests and electrical checks before concealing pipes, wiring, or conduits.', checked: false },
        { id: 'final-drainage', text: 'Check wet-area and roof drainage, slopes, and specified water tests before finishes and handover.', checked: false },
        { id: 'handover-records', text: 'Collect inspection and test records, approved changes, as-built drawings, product documents, and applicable completion or occupancy approvals.', checked: false }
      ]
    }
  ]);
  completedChecklistItems = computed(() =>
    this.checklist().reduce((total, phase) => total + phase.items.filter(item => item.checked).length, 0)
  );
  totalChecklistItems = computed(() =>
    this.checklist().reduce((total, phase) => total + phase.items.length, 0)
  );

  // Total Slab / Built-up Area
  totalBuiltUpArea = computed(() => (this.plotAreaSft() || 0) * (this.floors() || 1));

  // Calculations based on Indian Construction Standards (IS Thumb Rules)
  estimates = computed<MaterialItem[]>(() => {
    const area = this.totalBuiltUpArea();

    // 1. Cement: ~0.42 standard 50kg bags per sft
    const cement50kg = Math.round(area * 0.42);
    const cement25kg = Math.round(area * 0.84);

    // 2. Steel: ~3.8 kg per sft (0.0038 MT/sft)
    const steelKg = Math.round(area * 3.8);
    const steelTonnes = Number((steelKg / 1000).toFixed(2));

    // 3. Sand: 1.8 cft per sft (1 Unit / Brass = 100 cft ~ 4.2 Tons)
    const sandCft = Math.round(area * 1.8);
    const sandUnits = Number((sandCft / 100).toFixed(2));
    const sandTons = Number((sandUnits * 4.2).toFixed(1));

    // 4. Stone Aggregate (20mm & 10mm blue metal): 1.35 cft/sft (~4.5 Tons/unit)
    const stoneCft = Math.round(area * 1.35);
    const stoneUnits = Number((stoneCft / 100).toFixed(2));
    const stoneTons = Number((stoneUnits * 4.5).toFixed(1));

    // 5. Bricks: Clay (~8.5 nos/sft) vs Cement Concrete Blocks (~1.4 blocks/sft)
    const isClay = this.brickType() === 'clay';
    const brickCount = isClay ? Math.round(area * 8.5) : Math.round(area * 1.4);

    return [
      {
        id: 'cement',
        name: 'Cement Bags (50 kg)',
        category: 'Binding & Masonry',
        primaryQty: cement50kg,
        primaryUnit: 'Bags (50kg)',
        secondaryQty: cement25kg,
        secondaryUnit: '25kg Bag Equivalent',
        laymanVehicle: `~${Math.ceil(cement50kg / 175)} Mini-lorry / Tempo trips`,
        badge: 'Requested Metric',
        icon: '🧱',
        tip: 'Covers foundation footing, columns, beams, RCC slab casting, and wall plaster.'
      },
      {
        id: 'steel',
        name: 'TMT Steel Rebars',
        category: 'RCC Structure',
        primaryQty: steelTonnes,
        primaryUnit: 'Tonnes (MT)',
        secondaryQty: steelKg,
        secondaryUnit: 'Kg',
        laymanVehicle: `~${steelTonnes} MT ordered in bundled bundles`,
        badge: 'Fe550D Grade',
        icon: '🏗️',
        tip: 'Mix of 8mm (stirrups), 10mm/12mm (slabs), and 16mm/20mm (pillars & beams).'
      },
      {
        id: 'sand',
        name: 'Sand (M-Sand / River Sand)',
        category: 'Fine Aggregate',
        primaryQty: sandUnits,
        primaryUnit: 'Units (Brass / 100 cft)',
        secondaryQty: sandTons,
        secondaryUnit: 'Tonnes',
        laymanVehicle: `~${Math.ceil(sandUnits / 3)} Tipper Truck loads (3 Units/truck)`,
        badge: `${sandCft.toLocaleString('en-IN')} cu.ft`,
        icon: '⏳',
        tip: 'Calculated for concrete mix and 12mm/20mm internal & external wall plastering.'
      },
      {
        id: 'stone',
        name: 'Stone Aggregate (Blue Metal)',
        category: 'Coarse Aggregate (20mm / 10mm)',
        primaryQty: stoneUnits,
        primaryUnit: 'Units (Brass / 100 cft)',
        secondaryQty: stoneTons,
        secondaryUnit: 'Tonnes',
        laymanVehicle: `~${Math.ceil(stoneUnits / 3)} Tipper Truck loads`,
        badge: `${stoneCft.toLocaleString('en-IN')} cu.ft`,
        icon: '🪨',
        tip: 'Graded crushed granite stone used for high-strength RCC structural framing.'
      },
      {
        id: 'bricks',
        name: isClay ? 'Red Clay Bricks' : 'Cement Concrete Blocks',
        category: 'Wall Masonry',
        primaryQty: brickCount,
        primaryUnit: 'Pieces',
        secondaryQty: Math.ceil(brickCount / 1000),
        secondaryUnit: 'Thousand (Puri)',
        laymanVehicle: `~${Math.ceil(brickCount / (isClay ? 3000 : 800))} Full Lorry loads`,
        badge: isClay ? '9"x4"x3" Red Brick' : '16"x8"x6" Solid Block',
        icon: '🏛️',
        tip: isClay ? 'Standard kilned red bricks for 9" external & 4.5" partition walls.' : 'High-strength cement concrete masonry blocks with less mortar consumption.'
      }
    ];
  });

  materialCostLines = computed<MaterialCostLine[]>(() => {
    const rates = this.materialRates();
    return this.rateFields.map(field => {
      const item = this.estimates().find(estimate => estimate.id === field.id);
      if (!item) {
        throw new Error(`Missing material estimate for ${field.id}`);
      }
      const rate = rates[field.id];
      return {
        id: field.id,
        name: item.name,
        quantity: item.primaryQty,
        unit: item.primaryUnit,
        rate,
        rateUnit: field.unit,
        cost: item.primaryQty * rate
      };
    });
  });
  materialCostTotal = computed(() =>
    this.materialCostLines().reduce((total, line) => total + line.cost, 0)
  );
  allMaterialRatesEntered = computed(() =>
    Object.values(this.materialRates()).every(rate => rate > 0)
  );

  updateMaterialRate(id: MaterialRateId, value: number): void {
    const rate = Number.isFinite(value) && value >= 0 ? value : 0;
    this.materialRates.update(rates => ({ ...rates, [id]: rate }));
  }

  resetForm(): void {
    this.plotAreaSft.set(1200);
    this.floors.set(2);
    this.brickType.set('clay');
    this.city.set('');
    this.materialRates.set({ cement: 0, steel: 0, sand: 0, stone: 0, bricks: 0 });
  }

  toggleChecklistItem(phaseId: string, itemId: string): void {
    this.checklist.update(phases => phases.map(phase =>
      phase.id === phaseId
        ? { ...phase, items: phase.items.map(item => item.id === itemId ? { ...item, checked: !item.checked } : item) }
        : phase
    ));
  }

  print(): void {
    window.print();
  }
}
