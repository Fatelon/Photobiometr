import { Dirent } from "fs";
import {readExif} from '../utils/exifReader';

const express = require('express');
const router = express.Router();

const fs = require('fs');

const path = require('path');
const sharp = require('sharp');

let dirFotoName = path.join(__dirname, '../../fotos');
let dirPublicThumbName = path.join(__dirname, '../../public/thumbnails')
let dirPublicFotosName = path.join(__dirname, '../../public/fotos')

async function  ResizeFile (name) {
    console.log(name);
    let fileIn = path.join(dirFotoName, name);
    let fileThumbOut = path.join(dirPublicThumbName, name);
    let fileFotoOut = path.join(dirPublicFotosName, name);
    let buffer = await sharp(fileIn).toBuffer();
    await sharp(buffer)  
        .resize({width: 150})
        .toFile(fileThumbOut)

    await sharp(buffer)
        .resize({width: 600})
        .toFile(fileFotoOut)
        
}




router.get('/', async (req, res) => {
    const dir: Dirent[] = await fs.promises.opendir(dirFotoName);
    const dirPublic: Dirent[] = await fs.promises.opendir(dirPublicThumbName);
    let list: any[] = [];
    for await (let file of dir) {
       let metadata = await readExif(path.join(dirFotoName, file.name));

       list.push({
           name: file.name,
           metadata: {
            distance: metadata["FocusDistance"],
            efl: metadata["FocalLength35efl"],
            fl: metadata["FocalLength"],
            dof: metadata["DOF"],
        }
        });
       await fs.promises.access(path.join(dirPublicThumbName ,file.name), fs.constants.R_OK)
        .then(() => {})
        .catch(err =>{
            ResizeFile(file.name);
        });
    }
    
    res.json(list);
});

module.exports = router;