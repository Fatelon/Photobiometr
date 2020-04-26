import { Component, OnInit, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { ThumbnailsService } from '../../services/thumbnails.service';
import { SVG } from '@svgdotjs/svg.js';
import { Point, IPicture } from '../entity';

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
  polyLinePoints: Point[] = [];
  polygonPoints: Point[] = [];
  lineCircles: any[] =  [];
  polyLineCircles: any[] =  [];
  polygonCircles: any[] =  [];

  lines: any[] = [];
  lineLabels: any[] = [];
  polyline: Point[] = [];

  showCalcSections = false;

  points: Point[] = [];
  circles: any[] =  [];

  colors = {
    red: '#ff0066',
    blue: '#0066ff',
    green: '#00ff66',
    black: 'black',
    white: 'white',
  };
  color = '';
  colorLabel = '';

  drowingArea;
  img;
  drawImage;
  widthPx = 600;
  heightPx = 400;

  public userColor = '#f06';

  @ViewChild('imgArea') imgArea: ElementRef;
  @ViewChild('drowingArea') dArea: ElementRef;

  constructor(private readonly thubmnailsService: ThumbnailsService) {

  }

  ngOnInit(): void {
    this.thubmnailsService.getThumbs().subscribe((res: string[]) => {
      this.items = res.map((item: any) => {
        return {
          name: item.name,
          thumb: `http://localhost:3001/public/thumbnails/${item.name}`,
          photo: `http://localhost:3001/public/fotos/${item.name}`,
          metadata: item.metadata
        };
      });
      console.log(this.items);
      this.setPicture(this.items[0]);
    });
  }

  ngAfterViewInit(): void {
    this.drawImage = SVG().addTo(this.imgArea.nativeElement).size(600, 400);
    this.drowingArea = SVG().addTo(this.dArea.nativeElement).size(600, 400);
    this.drowingArea.on('click', this.svgClick.bind(this));
  }

  setPicture(picture: IPicture) {
    // this.clearDrawingArea(); ?
    const item: IPicture = this.items.find(it => it.name === picture.name);
    this.currentPicture = item;
    if (!this.img) {
      this.img = this.drawImage.image(item.photo);
    } else {
      this.img.load(item.photo);
    }
  }

  svgClick(e) {

      console.log(e.offsetX, e.offsetY);

      const point: Point = new Point(e.offsetX, e.offsetY);
      this.points.push(point);

      const circle = this.drowingArea.ellipse(4, 4).fill(this.userColor).move(point.X - 2, point.Y - 2);
      // this.circles.push(circle);
      this.drawLines();

  }

  drawLines() {
    const points = this.points;
    if (points.length % 2 == 0) {
      const line = this.drowingArea.line(
        points[points.length - 2].X,
        points[points.length - 2].Y,
        points[points.length - 1].X,
        points[points.length - 1].Y
      ).stroke({ width: 1, color: this.userColor });
      this.lines.push(line);
    }
  }

  // tools
  clearLines(isLine: boolean = true) {
    if (isLine) {
      this.linePoints = [];
      this.lines.forEach(line => line.remove());
      this.lineCircles.forEach(circle => circle.remove());
    } else {
      this.polyLinePoints = [];
    }
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

  showLineLabels() {
    this.lineLabels.forEach(l => l.remove());
    this.lineLabels = [];
    this.lines.forEach((line, idx) => {
      const text = this.drowingArea.text(`${this.currentPicture.calc.lines[idx].toFixed(4)} m`).font({fill: this.colorLabel});
      this.lineLabels.push(text);
      const arr = line.plot();
      const x = arr[0][0] + (arr[1][0] - arr[0][0]) / 2;
      const y = arr[0][1] + (arr[1][1] - arr[0][1]) / 2;

      // let ang =  Math.atan(arr[1][1] - arr[0][1] / arr[1][0] - arr[0][0]) * 180 / Math.PI;


      text.move(x, y);
      // text.rotate(ang);

    });
  }

  getLengthLines() {
    let sum = 0;
    if (this.currentPicture.calc && this.currentPicture.calc.lines) {
      this.currentPicture.calc.lines.forEach(l => sum += l);
    }
    return sum;
  }

  calculate() {
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
    this.drowingArea.clear();
    // this.clearLines(); ?
  }

  // Actions from edit panel
  public onClearClick(event) {
    this.clearDrawingArea();
  }

  public onColorChanged(newColor: string) {
    this.userColor = newColor;
    // Redraw..
  }

}
