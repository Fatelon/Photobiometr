import path from 'path';
import fs from 'fs';
import { readExif } from '../utils/exifReader';
import { ImageInfoI, ExifI, ExifValueI } from './entity';

const UNITS = {
  m: 1,
  cm: 0.01,
  mm: 0.001
};

const DIAGONAL_MATRIX = 0.0432666; // Matrix linear size in meter.

async function getImageInfo(photoDir: string, fileName: string): Promise<ImageInfoI> {
  const fileExif: ExifI = await readExif(path.join(photoDir, fileName)) as ExifI;

  const focalLength35efl: ExifValueI = fileExif.FocalLength35efl;
  const focusDistance: ExifValueI = fileExif.FocusDistance;

  const efl = focalLength35efl.value * UNITS[focalLength35efl.unit];
  const angle = 2 * Math.atan(0.5 * DIAGONAL_MATRIX /  efl);
  const distance = focusDistance.value * UNITS[focusDistance.unit];
  const diagonal = 2 * distance * Math.tan(0.5 * angle);

  return {
    name: fileName,
    ratio: diagonal,
    width: fileExif.width,
    height: fileExif.height,
    imgPath: `light/photo/${fileName}`,
    thumbnailsPath: `light/thumbnails/${fileName}`
  };
}

export async function calculate() {
  const photoDir = path.join(__dirname, '../../public/light/photo');
  const imagesInfoPromise = fs.readdirSync(photoDir).map(async (fileName) => {
    return getImageInfo(photoDir, fileName);
  });
  const imagesInfo = await Promise.all(imagesInfoPromise)
  // Need to save the result into DB in future.
  global['imagesInfo'] = imagesInfo;
  console.log('imagesInfo', imagesInfo);
}
