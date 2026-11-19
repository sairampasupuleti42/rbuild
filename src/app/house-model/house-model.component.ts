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
  readonly referenceImages = [
    {
      src: 'assets/house-references/palm-springs-modern.jpg',
      title: 'Mid-century modern house',
      credit: 'Wgreaves',
      license: 'CC BY-SA 4.0',
      source: 'https://commons.wikimedia.org/wiki/File:Mid-century_modern_house_in_Palm_Springs.jpg'
    },
    {
      src: 'assets/house-references/bell-lane-modern.jpg',
      title: 'Timber-frame modern house',
      credit: 'Richard Webb',
      license: 'CC BY-SA 2.0',
      source: 'https://commons.wikimedia.org/wiki/File:Modern_architecture,_Bell_Lane_-_geograph.org.uk_-_1169903.jpg'
    },
    {
      src: 'assets/house-references/marsden-house-modern.jpg',
      title: 'Contemporary residential façade',
      credit: 'Bob Harvey',
      license: 'CC BY-SA 2.0',
      source: 'https://commons.wikimedia.org/wiki/File:Modern_architecture_-_geograph.org.uk_-_5110717.jpg'
    }
  ];

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
