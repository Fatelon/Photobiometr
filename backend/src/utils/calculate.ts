export class Calculate {
    efl: number; //FocusLength 35mm
    fl: number; //FocusLength
    dof: number; //Deep of field
    distance: number; // FocusDistance
    diagonal: number; // FOV - diagonal (FOV - Field of view)
    diagoanlMatrix: number = 0.0432666; // Matrix linear size in meter
    horizontal: number; // FOV - horizontal
    vertical: number; // FOV - vertical
    angle: number; // FOV - angle in rad
    
    // analog from pixel
    eflPx: number; //FocusLength 35mm in PX
    distancePx: number; // FocusDistance in PX
    diagonalPx: number; // FOV - diagonal (FOV - Field of view) in PX
    horizontalPx: number; // FOV - horizontal in PX
    verticalPx: number; // FOV - vertical in PX

    ratio: number; // Ratio of meters to pixels 

    units = {
        "m": 1,
        "cm": 0.01,
        "mm": 0.001
    }

    constructor (metadata, pictureContainer) {
        console.log('metadata', metadata);
        this.horizontalPx = pictureContainer.width;
        this.verticalPx = pictureContainer.height;

        this.setMeterMeasures(metadata)
        this.prepare();
        this.horizontal = this.getLength(this.horizontalPx);
        this.vertical = this.getLength(this.verticalPx);
    }

    getLength(lengthPx: number):number {
        return lengthPx * this.ratio;
    }

    prepare (): void{
        /**
         * a = 2 * arctg ( d / 2f ) - Угол изображения или угловое поле объектива 
         * d - диагональ матрицы для кадра 36x24 = 43.2666мм = 0,0432666м  
         * f - Эквивалентное фокусное расстояние 35мм 
         * D = 2 * R * tg (a / 2)   
         * D - линейное поле по диагонали  
         * R - расстояние до объекта 
         */
        this.angle = 2 * Math.atan(0.5 * this.diagoanlMatrix /  this.efl);

        console.log('diagonal matrix', this.diagoanlMatrix);
        console.log('efl', this.efl)

        this.diagonal = 2 * this.distance * Math.tan(0.5 * this.angle);
        this.ratio = this.diagonal / this.diagonalPx;

        console.log('distance', this.distance);
        console.log('diagonal', this.diagonal);
        console.log('ratio', this.ratio);
    }

    setMeterMeasures(metadata):void {
        console.log(this.units)    ;
        console.log(metadata.efl)    ;
        console.log(metadata.efl.unit)    ;
        console.log(this.units[metadata.efl.unit])    ;

        this.efl = metadata.efl.value * this.units[metadata.efl.unit];
        this.distance = metadata.distance.value * this.units[metadata.distance.unit];
        this.dof = metadata.dof.value * this.units[metadata.dof.unit];
        this.fl = metadata.fl.value * this.units[metadata.fl.unit];
        this.horizontalPx = metadata.width;
        this.verticalPx = metadata.height;
        this.diagonalPx = Math.sqrt(this.horizontalPx * this.horizontalPx + this.verticalPx * this.verticalPx);
    }

}

