const exiftool = require('node-exiftool');
const exiftoolBin = require('dist-exiftool');
const ep = new exiftool.ExiftoolProcess(exiftoolBin);


const options = {
    detached: true,
    env: Object.assign({}, process.env, {
      ENVIRONMENT_VARIABLE: 1,
    }),
}

let keys = [
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

function parseExif(exifData) {
    if (exifData.error) {
        console.error(exifData.error);
        return;
    }
    let outputMetadata = {}

    let data = exifData.data[0];

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
        value: fl
    };
    console.log('FocalLength35efl', data['FocalLength35efl'], efl);

    return outputMetadata;
}

export async function readExif(filePath) {
    let metadata;
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


