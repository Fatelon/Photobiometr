import { Dirent } from "fs";
import {readExif} from '../utils/exifReader';


import {Calculate} from '../utils/calculate';



const express = require('express');
const router = express.Router();

const fs = require('fs');

const path = require('path');
const sharp = require('sharp');

let dirFotoName = path.join(__dirname, '../../fotos');
let dirPublicThumbName = path.join(__dirname, '../../public/thumbnails')
let dirPublicFotosName = path.join(__dirname, '../../public/fotos')

const thumbWidth = 150;
const imageWidth = 600;

async function  ResizeFile (name) {
    console.log(name);
    let fileIn = path.join(dirFotoName, name);
    let fileThumbOut = path.join(dirPublicThumbName, name);
    let fileFotoOut = path.join(dirPublicFotosName, name);
    let image = await sharp(fileIn);
    let buffer = await image.toBuffer();
    let aspect = 1;

    await image
        .metadata()
        .then(metadata =>{
            //console.log(metadata);
            aspect = metadata.width / metadata.height;
            console.log(aspect);
        });

        console.log(aspect);
    await sharp(buffer)  
        .resize({
            width: thumbWidth, 
        })
        .toFile(fileThumbOut)

    await sharp(buffer)
        .resize({
            width: imageWidth, 
        })
        .toFile(fileFotoOut)
    
}




router.get('/', async (req, res) => {
    const dir: Dirent[] = await fs.promises.opendir(dirFotoName);
    const dirPublic: Dirent[] = await fs.promises.opendir(dirPublicThumbName);
    let list: any[] = [];
    for await (let file of dir) {
       let metadata = await readExif(path.join(dirFotoName, file.name));

        let item = {
            name: file.name,
            metadata: {
                distance: metadata["FocusDistance"],
                efl: metadata["FocalLength35efl"],
                fl: metadata["FocalLength"],
                dof: metadata["DOF"],
                // accuracy 5% by lens +  0.5 * DOF / FocusDistance
                accuracy: {value: (5 + 100 * 0.5 * metadata["DOF"].value / metadata["FocusDistance"].value).toFixed(2), unit: '%'},
                width: metadata["width"],
                height: metadata["height"],
                imageWidth: imageWidth,
        }
         }

       list.push(item);
       global['exifs'][file.name] = item;
       await fs.promises.access(path.join(dirPublicThumbName ,file.name), fs.constants.R_OK)
        .then(() => {})
        .catch(err =>{
            ResizeFile(file.name);
        });
    }
    res.json(list);
}); 

router.post('/calc', async (req, res) =>{
    let exif = global['exifs'][req.body.name];
    let calc = new Calculate(exif.metadata, req.body);
    let result = req.body;
    result['calc'] = {}; 
    //result['calc']['lines'] = req.body.lines.map(length => calc.getLength(length));
    result['calc']['diagonal'] = {
        value: calc.diagonal,
        unit: 'm'
    }
    result['calc']['width'] = {
        value: calc.horizontal,
        unit: 'm'
    }

    result['calc']['height'] = {
        value: calc.vertical,
        unit: 'm'
    }

    result['calc']['ratio'] = {
        value: calc.ratio,
        unit: ''
    }

    res.json(result);
});

module.exports = router;