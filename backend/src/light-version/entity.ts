export interface ImageInfoI {
  name: string;
  ratio: number;
  width: number;
  height: number;
  imgPath: string;
  thumbnailsPath: string;
}

export interface ExifValueI {
  unit: string;
  value: number;
}

export interface ExifI {
  width: number;
  height: number;
  FocalLength35efl: ExifValueI;
  FocusDistance: ExifValueI;
}
