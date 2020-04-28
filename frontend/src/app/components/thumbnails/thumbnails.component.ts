import { Component, OnInit, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { ThumbnailsService } from '../../services/thumbnails.service';
import { SVG } from '@svgdotjs/svg.js';
import { Point, IPicture, FigureType } from '../entity';
import { environment } from '../../../environments/environment';
import { MatSelectChange } from '@angular/material/select';
import ColorConvert from 'color-convert';

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

  colors = {
    red: '#ff0066',
    blue: '#0066ff',
    green: '#00ff66',
    black: '#000000',
    white: '#ffffff',
  };
  color = '';
  colorLabel = '';

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
    let fillColor =  this.userColor + "55";
    this.polygon.fill(fillColor);
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
     let sumLength = 0;
     let points = this.polygon.plot();
     for (let i = 0; i < points.length-1; i++) {
       let plot = [points[i], points[i+1]];
       let lengthPx = this.getLengthPx(plot);
       let length = this.getLength(lengthPx);
       sumLength += length;
     }
     this.polygonLabel = this.drawingArea.text(`${sumLength.toFixed(4)} m`).fill(this.userTextColor);
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

    // Redraw..
  }
  public onColorTextChanged(newColor: string) {
    this.userTextColor = newColor;
    this.lineLabels.forEach((text) => text.fill(this.userTextColor));
    // Redraw..
  }

  public onFigureChanged(newFigure: MatSelectChange) {
    this.figureType = newFigure.value;
  }
}
