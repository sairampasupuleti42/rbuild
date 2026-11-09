import { Component, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

export interface MaterialItem {
  id: string;
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

  resetForm(): void {
    this.plotAreaSft.set(1200);
    this.floors.set(2);
    this.brickType.set('clay');
  }

  print(): void {
    window.print();
  }
}
