import { IMeasure, IParseObject } from "./entity";
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
  const data = exifData.data[0];
  parseObjects.forEach(parseObj => {
    if (parseObj.name == 'FocalLength35efl') {
      //FocalLength35efl 283.0 mm (35 mm equivalent: 566.9 mm)
      let field = data[parseObj.name];
      let parseEnt = field.split(' ');
      let value = parseFloat(parseEnt[parseEnt.length - 2]);
      outputMetadata[parseObj.name] = {
        unit: parseObj.unit,
        value
      } as IMeasure;
    } else {
      outputMetadata[parseObj.name] = {
        unit: parseObj.unit,
        value: parseFloat(data[parseObj.name].split(' ')[0])
      } as IMeasure;
    }
  });

  outputMetadata['width'] = data['ExifImageWidth'];
  outputMetadata['height'] = data['ExifImageHeight'];

  return outputMetadata;
}

export async function readExif(filePath) {
  let metadata = {};
  await ep
    .open(options)
    .then((pid) => console.log('Started exiftool process %s', pid))
    .then(() => ep.readMetadata(filePath, ['-File:all']))
    .then((data) => {
      //console.log('data', data);
      metadata = parseExif(data)
    }, console.error)
    .then(() => ep.close())
    .then(()=> {
      return metadata
    })
    .catch(console.error);
  return metadata;
}
