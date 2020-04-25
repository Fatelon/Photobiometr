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

let keys = [
<<<<<<< HEAD
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

function parseExif(exifData) {
    if (exifData.error) {
        console.error(exifData.error);
        return;
    }
    let outputMetadata = {}
=======
  'SourceFile',
  'Make',
  'Model',
  'Orientation',
  'XResolution',
  'YResolution',
  'ResolutionUnit',
  'ModifyDate',
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
>>>>>>> ed1b441ae1bdfe93dda7441062ef6a007cd919fc

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

<<<<<<< HEAD
    let width = data['ExifImageWidth'];
    outputMetadata['width'] = width;
    let height = data['ExifImageHeight'];
    outputMetadata['height'] = height;

    let focusDistance = parseFloat(data['FocusDistance'].split(' ')[0]);
    outputMetadata['FocusDistance']  = {
        unit: 'm',
        value: focusDistance
    };
    console.log('FocusDistance', data['FocusDistance'], focusDistance);

    let dof = parseFloat(data['DOF'].split(' ')[0]);
    outputMetadata['DOF']  = {
        unit: 'm',
        value: dof
    };
    console.log('DOF', data['DOF'], dof);


    let fl = parseFloat(data['FocalLength'].split(' ')[0]);
    console.log('FocalLength', data['FocalLength'], fl);
    outputMetadata['FocalLength']  = {
        unit: 'mm',
        value: fl
    };

    let eflArr =  data['FocalLength35efl'].split(' ');
    let efl = parseFloat(eflArr[eflArr.length - 2]);
    outputMetadata['FocalLength35efl']  = {
        unit: 'mm',
        value: efl
    };

=======
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
>>>>>>> ed1b441ae1bdfe93dda7441062ef6a007cd919fc

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


