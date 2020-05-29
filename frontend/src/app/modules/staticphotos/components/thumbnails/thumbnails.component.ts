import { Component, OnInit, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { ThumbnailsService } from '../../../../services/thumbnails.service';
import { SVG } from '@svgdotjs/svg.js';
import '@svgdotjs/svg.draggable.js'
import { Point, IPicture, FigureType } from '../entity';
import { MatSelectChange } from '@angular/material/select';
import ColorConvert from 'color-convert';
import { environment } from '../../../../../environments/environment';

@Component({
  selector: 'app-thumbnails',
  templateUrl: './thumbnails.component.html',
  styleUrls: ['./thumbnails.component.scss']
})
export class ThumbnailsComponent implements OnInit, AfterViewInit {
  items: IPicture[] = [];
  currentPicture: IPicture;

  // draw objects
  linePoints: Point[] = [];
  polylinePoints: Point[] = [];
  polygonPoints: Point[] = [];
  lineCircles: any[] =  [];
  polylineCircles: any[] =  [];
  polygonCircles: any[] =  [];

  lines: any[] = [];
  lineLabels: any[] = [];
  polylineLabel: any;
  polygonLabel: any;
  polyline: any;
  polygon: any;

  showCalcSections = false;

  points: Point[] = [];
  circles: any[] =  [];

  zoom: number = 1;

  colors = {
    red: '#ff0066',
    blue: '#0066ff',
    green: '#00ff66',
    black: '#000000',
    white: '#ffffff',
  };
  color = '';
  colorLabel = '';

  _fillColor:string = '';
  get fillColor():string {
    return  this.userColor + "55";
  }

  drawingArea;
  img;
  drawImage;
  widthPx = 600;
  heightPx = 450;
  diagonalPx = Math.sqrt(600 * 600 + 450 * 450);

  ratio: number;  // retio meter to pixel

  public userColor;
  public userTextColor;
  public figureType: FigureType = 'Segment';

  @ViewChild('imgArea') imgArea: ElementRef;
  @ViewChild('drawingArea') dArea: ElementRef;

  constructor(private readonly thubmnailsService: ThumbnailsService) {

  }

  ngOnInit(): void {
    this.userColor = this.colors.green;
    this.userTextColor = this.colors.white;
    this.thubmnailsService.getThumbs().subscribe((res: string[]) => {
      this.items = res.map((item: any) => {
        return {
          name: item.name,
          thumb: `${environment.serverPath}public/thumbnails/${item.name}`,
          photo: `${environment.serverPath}public/fotos/${item.name}`,
          metadata: item.metadata
        };
      });
      console.log(this.items);
      this.setPicture(this.items[0]);
    });

  }

  ngAfterViewInit(): void {
    this.drawImage = SVG().addTo(this.imgArea.nativeElement).size(this.widthPx, this.heightPx);
    this.drawingArea = SVG().addTo(this.dArea.nativeElement).size(this.widthPx, this.heightPx);
    this.drawingArea.on('click', this.svgClick.bind(this));
  }

  setPicture(picture: IPicture) {
    this.clearDrawingArea();
    this.ratio = 0;
    const item: IPicture = this.items.find(it => it.name === picture.name);
    this.currentPicture = item;
    this.calculate();
    if (!this.img) {
      this.img = this.drawImage.image(item.photo);

      //this.img.scale(2,2);
    } else {
      this.img.load(item.photo);
    }

  }

  svgClick(e) {

      const point: Point = new Point(e.offsetX, e.offsetY);

      switch (this.figureType) {
        case 'Segment':
          this.points.push(point);
          const circle = this.drawingArea.ellipse(4, 4).fill(this.userColor).move(point.X - 2, point.Y - 2);
          this.lineCircles.push(circle);
          this.drawLines();
          break;
        case 'Polyline':
          this.polylinePoints.push(point);
          const polyCircle = this.drawingArea.ellipse(4, 4).fill(this.userColor).move(point.X - 2, point.Y - 2);
          this.polylineCircles.push(polyCircle);
          this.drawPolylines();
          break;
        case 'Polygon':
          this.polygonPoints.push(point);
          const polygonCircle = this.drawingArea.ellipse(4, 4).fill(this.userColor).move(point.X - 2, point.Y - 2);
          this.polygonCircles.push(polygonCircle);
          this.drawPolygon();
          break;
      }

  }

  drawPolygon () {
    let points: number[][] = this.polygonPoints.map(p =>{
       return [p.X, p.Y];
    });
    if (this.polygon == null) {
        this.polygon = this.drawingArea.polygon();
    } else {
      this.polygon.plot(points);
    }

    this.polygon.fill(this.fillColor);
    this.polygon.stroke(this.userColor);
    this.showPolygonLabel();
  }


  drawPolylines () {
    let points: number[][] = this.polylinePoints.map(p =>{
       return [p.X, p.Y];
    });
    if (this.polyline == null) {
        this.polyline = this.drawingArea.polyline();
    } else {
      this.polyline.plot(points);
    }
    this.polyline.fill('none');
    this.polyline.stroke(this.userColor);
    this.showPolylineLabel();
  }

  drawLines() {
    const points = this.points;
    if (points.length % 2 === 0) {
      const line = this.drawingArea.line(
        points[points.length - 2].X,
        points[points.length - 2].Y,
        points[points.length - 1].X,
        points[points.length - 1].Y
      ).stroke({ width: 1, color: this.userColor });
      this.lines.push(line);
      this.showLineLabels();
    }
  }

  // tools
  clearLines() {
      this.linePoints = [];
      this.lines = [];
      this.lineCircles = [];
      this.lineLabels = [];
  }


  clearPolyline() {
    this.polylinePoints = [];
    this.polyline = null;
    this.polylineCircles = [];
  }

  clearPolygon() {
    this.polygonPoints = [];
    this.polygon = null;
    this.polygonCircles = [];
  }


  getSquarePx (plot: number[][]): number {
    if (plot.length < 3) return 0;
    let square = 0;
    let summ = 0;
    let minus = 0;

    for (let i = 0; i < plot.length; i++)
    {


        if (i + 1 < plot.length) {
            summ += plot[i][0] * plot[i + 1][0];
            minus += plot[i][0] * plot[i + 1][0];
        } else
        {
            summ += plot[i][0] * plot[0][0];
            minus += plot[i][0] * plot[0][0];
        }
    }

    square = 0.5 * Math.abs(summ - minus);
    return square;
  }

  getSquare(squarePx: number): number {
    const width = this.currentPicture.calc.width.value;
    const height = this.currentPicture.calc.height.value;
    const widthPx = this.currentPicture.metadata.width;
    const heightPx = this.currentPicture.metadata.height;

    const squareFrame = width * height;
    const squareFramePx = widthPx * heightPx;

    const square =  squarePx * squareFrame / squareFramePx
    return square;
  }

  getLengthPx(plot: number[][]): number {
    let sum = 0;
    for (let i = 0; i < plot.length - 1; i++) {
      const x1 = plot[i][0];
      const y1 = plot[i][1];
      const x2 = plot[i + 1][0];
      const y2 = plot[i + 1][1];
      sum += Math.sqrt((x1 - x2) * (x1 - x2) + (y1 - y2) * (y1 - y2));
    }
    return sum;
  }

  getLength(lengthPx: number): number {
    return this.currentPicture.calc.diagonal.value * lengthPx / this.diagonalPx;
  }

  showLineLabels() {
    this.lineLabels.forEach(l => l.remove());
    this.lineLabels = [];
    this.lines.forEach((line, idx) => {
      const lengthPx = this.getLengthPx(line.plot());
      const length = this.getLength(lengthPx);
      const text = this.drawingArea.text(`${length.toFixed(4)} m`).font({fill: this.userTextColor});
      this.lineLabels.push(text);
      const arr = line.plot();

      const X1 = arr[0][0];
      const X2 = arr[1][0];
      const Y1 = arr[0][1];
      const Y2 = arr[1][1];

      const x = X1 + (X2 - X1) / 2;
      const y = Y1 + (Y2 - Y1) / 2;

      const ang =  Math.atan( (Y2 - Y1) / (X2 - X1));
      const deg = ang * 180 / Math.PI;
      console.log('ang', ang, deg);

      text.move(x, y);
    });
  }

  showPolylineLabel() {
    this.polylineLabel && this.polylineLabel.remove();
     let sumLength = 0;
     let points = this.polyline.plot();
     for (let i = 0; i < points.length-1; i++) {
       let plot = [points[i], points[i+1]];
       let lengthPx = this.getLengthPx(plot);
       let length = this.getLength(lengthPx);
       sumLength += length;
     }
     this.polylineLabel = this.drawingArea.text(`${sumLength.toFixed(4)} m`).fill(this.userTextColor);
     let minX = this.widthPx;
     let maxX = 0;
     let minY = this.heightPx;
     let maxY = 0;

     this.polylinePoints.forEach((point => {
       if (point.X > maxX) maxX = point.X;
       if (point.Y > maxY) maxY = point.Y;
       if (point.X < minX) minX = point.X;
       if (point.Y < minY) minY = point.Y;
     }))

     let midX = (maxX + minX) / 2;
     let midY = (maxY + minY) / 2;

     this.polylineLabel.move(midX, midY);

  }

  showPolygonLabel () {
    this.polygonLabel && this.polygonLabel.remove();

     let points = this.polygon.plot();

    const squarePx = this.getSquarePx(points);
    const square = this.getSquare(squarePx);

    this.polygonLabel = this.drawingArea.text(`${square.toFixed(8)} m`).fill(this.userTextColor);
     let minX = this.widthPx;
     let maxX = 0;
     let minY = this.heightPx;
     let maxY = 0;

     this.polygonPoints.forEach((point => {
       if (point.X > maxX) maxX = point.X;
       if (point.Y > maxY) maxY = point.Y;
       if (point.X < minX) minX = point.X;
       if (point.Y < minY) minY = point.Y;
     }))

     let midX = (maxX + minX) / 2;
     let midY = (maxY + minY) / 2;

     this.polygonLabel.move(midX, midY);

  }

  getLengthLines() {
    let sum = 0;
    if (this.currentPicture.calc && this.currentPicture.calc.lines) {
      this.currentPicture.calc.lines.forEach(l => sum += l);
    }
    return sum;
  }

  calculate() {
    if (this.currentPicture == null) { return; }
    const data = {
      name: this.currentPicture.name,
      widthPx: this.widthPx,
      heightPx: this.heightPx,
      lines: this.lines.map(line => {
        return this.getLengthPx(line.plot());
      }),
    };
    this.thubmnailsService.getCalculations(data)
      .subscribe(res => {
        console.log(res);
        this.currentPicture.calc = res['calc'];
        this.showCalcSections = true;
        this.showLineLabels();
      });
  }

  private clearDrawingArea() {
    this.points = [];
    this.clearLines();
    this.clearPolyline();
    this.clearPolygon();
    this.drawingArea.clear();
    // this.clearLines(); ?
  }

  // Actions from edit panel
  public onClearClick(event) {
    this.clearDrawingArea();
  }

  public onColorChanged(newColor: string) {
    this.userColor = newColor;

    this.lines.forEach((line) => {
      // console.log(line);
      line.stroke(this.userColor);
    });

    this.lineCircles.forEach((circle) => circle.fill(this.userColor));

    this.polyline.stroke(this.userColor);
    this.polylineCircles.forEach((circle) => circle.fill(this.userColor))

    this.polygon.stroke(this.userColor);
    this.polygon.fill(this.fillColor);
    this.polygonCircles.forEach(polygonCircle => polygonCircle.fill(this.userColor));

    // Redraw..
  }
  public onColorTextChanged(newColor: string) {
    this.userTextColor = newColor;
    this.lineLabels.forEach((text) => text.fill(this.userTextColor));
    this.polylineLabel.fill(this.userTextColor);
    this.polygonCircles.fill(this.userTextColor);

    // Redraw..
  }

  public onFigureChanged(newFigure: MatSelectChange) {
    this.figureType = newFigure.value;
  }

  rescale (isUpScale: boolean) {
    const scale = isUpScale ? 2 : 0.5
    if (this.lines && this.lines.length) {
      this.lines.forEach((line) => {line.plot(line.plot().map(coord => [coord[0] * scale, coord[1] * scale]))})
      this.lineCircles.forEach((circle) => circle.move(circle.x() * scale, circle.y() * scale))
      this.lineLabels.forEach(l => l.move(l.x() * scale, l.y() * scale))
    }

    if (this.polyline) {
      this.polyline.plot(this.polyline.plot().map(coord => [coord[0] * scale, coord[1] * scale]));
      this.polylineCircles.forEach(circle => circle.move(circle.x() * scale, circle.y() * scale));
      this.polylineLabel.move(this.polylineLabel.x() * scale, this.polylineLabel.y() * scale);
    }

    if (this.polygon) {
      this.polygon.plot(this.polygon.plot().map(coord => [coord[0] * scale, coord[1] * scale]));
      this.polygonCircles.forEach(circle => circle.move(circle.x() * scale, circle.y() * scale));
      this.polygonLabel.move(this.polygonLabel.x() * scale, this.polygonLabel.y() * scale);
    }

  }

  onMouseWheelUp (event) {
    console.log(event);
    if (this.zoom < 32) {
      this.zoom *= 2;
      //this.img.scale(2,2, event.clientX, event.clientY);
      this.img.scale(2,2, this.widthPx/ 2, this.heightPx/ 2);
      this.rescale(true);
    }

  }
  onMouseWheelDown (event) {
    console.log(event);
    if (this.zoom > 1) {
      this.zoom /= 2;
      this.img.scale(0.5,0.5)
      this.rescale(false);
    }
  }



  public onZoomInClick (event) {
    console.log(event);
  }
  public onZoomOutClick (event) {
    console.log(event);
  }
}
