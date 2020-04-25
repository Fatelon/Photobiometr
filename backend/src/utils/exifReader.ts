import { IMetaObject, IParseObject } from "./entity";
import exiftool from 'node-exiftool';
import exiftoolBin from 'dist-exiftool';

const ep = new exiftool.ExiftoolProcess(exiftoolBin);

const options = {
  detached: true,
  env: Object.assign({}, process.env, {
    ENVIRONMENT_VARIABLE: 1,
  }),
}

const keys = [
  'SourceFile',
  'Make',
  'Model',
  'Orientation',
  'XResolution',
  'YResolution',
  'ResolutionUnit',
  'ModifyDate',
  'ExifImageWidth',
  'ExifImageHeight',
  'ExposureTime',
  'FNumber',
  'ISO',
  'FocalLength',
  'FocalPlaneDiagonal',
  'LensType',
  'FocusDistance',
  'LensInfo',
  'LensModel',
  'Megapixels',
  'DOF',
  'FOV',
  'FocalLength35efl',
  'HyperfocalDistance',
];

const parseObjects: IParseObject[] = [
  {
    unit: 'm',
    name: 'FocusDistance'
  }, {
    unit: 'm',
    name: 'DOF'
  }, {
    unit: 'mm',
    name: 'FocalLength'
  }, {
    unit: 'mm',
    name: 'FocalLength35efl'
  }
];

function parseExif(exifData) {
  if (exifData.error) {
    console.error(exifData.error);
    return {};
  }
  const outputMetadata = {};

  parseObjects.forEach(parseObj => {
    outputMetadata[parseObj.name] = {
      unit: parseObj.unit,
      value: parseFloat(exifData.data[0][parseObj.name].split(' ')[0])
    } as IMetaObject;
  });

  return outputMetadata;
}

export async function readExif(filePath) {
  let metadata = {};
  await ep
    .open(options)
    .then((pid) => console.log('Started exiftool process %s', pid))
    .then(() => ep.readMetadata(filePath, ['-File:all']))
    .then((data) => {
      console.log('data', data);
      metadata = parseExif(data)
    }, console.error)
    .then(() => ep.close())
    .then(()=> {
      console.log(metadata)
      return metadata
    })
    .catch(console.error);
  return metadata;
}
