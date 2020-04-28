export interface IPicture {
  name: string;
  thumb: string;
  photo: string;
  metadata: IMetadata;
  calc?: any;
}

export interface IMeasure {
  unit: string;
  value: number;
}

export interface IMetadata {
  distance: IMeasure;
  dof: IMeasure;
  efl: IMeasure;
  fl: IMeasure;
  height: number;
  width: number;
  imageWidth: number;
}

export class Point {
  public X: number;
  public Y: number;
  constructor(X: number, Y: number) {
    this.X = X;
    this.Y = Y;
  }
}

export interface IExifInfoObj {
  label: string;
  field: string;
}

export type FigureType = 'Segment' | 'Polyline' | 'Polygon';
