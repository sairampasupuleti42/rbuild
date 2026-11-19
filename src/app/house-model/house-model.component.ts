import { Component, input, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

export type HouseModelView = 'isometric' | 'front' | 'side';

@Component({
  selector: 'app-house-model',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './house-model.component.html'
})
export class HouseModelComponent {
  floors = input(1);
  plotAreaPerFloor = input(0);
  totalArea = input(0);
  translate = input.required<(key: string) => string>();
  modelView = signal<HouseModelView>('isometric');

  readonly modelFloorHeight = 46;

  floorIndexes = () =>
    Array.from({ length: Math.min(5, Math.max(1, this.floors() || 1)) }, (_, index) => index);

  frontTop = () => 220 - this.floorIndexes().length * this.modelFloorHeight;

  sideTop = () => this.frontTop() - 38;

  footprintText = () => {
    const area = this.plotAreaPerFloor();
    if (!area) {
      return '0 sq. ft.';
    }
    return `${Math.round(area).toLocaleString('en-IN')} sq. ft. / floor`;
  };

  setView(view: HouseModelView): void {
    this.modelView.set(view);
  }
}
