import { Component, OnInit, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import {ThumbnailsService} from '../../../../services/thumbnails.service';
import { SVG } from '@svgdotjs/svg.js';


interface Picture {
  name: string;
  thumb: string;
  foto: string;
  metadata: any;
  calc?: any;
}

class Point {
  public X: number;
  public Y: number;
  constructor(X: number, Y: number) {
    this.X = X;
    this.Y = Y;
  }
}



@Component({
  selector: 'app-thubmnails',
  templateUrl: './thubmnails.component.html',
  styleUrls: ['./thubmnails.component.scss']
})
export class ThubmnailsComponent implements OnInit, AfterViewInit {
  items:Picture[] = [];
  currentPicture:Picture;

  //draw objects
  linePoints: Point[] = [];
  polyLinePoints: Point[] = [];
  polygonPoints: Point[] = [];
  lineCircles: any[]=  [];
  polyLineCircles: any[]=  [];
  polygonCircles: any[]=  [];

  lines: any[]= [];
  lineLabels: any[]= [];
  polyline: Point[]= [];

  showCalcSections: boolean = false;

  colors = {
    red: '#ff0066',
    blue: '#0066ff',
    green: '#00ff66',
    black:'black',
    white:'white',
  };
  color: string = '';
  colorLabel: string = '';

  //svg objects
  draw;
  img;
  drawImage;
  widthPx = 600;
  heightPx = 450;

  @ViewChild('container') container: ElementRef;
  @ViewChild('svg') svg: ElementRef;

  constructor(private ThubmnailsService: ThumbnailsService) {
    this.color = this.colors.green;
    this.colorLabel = this.colors.white;
  }

  ngOnInit(): void {
    this.ThubmnailsService.getThumbs().subscribe((res:string[]) => {
      this.items = res.map((item:any) => {
        return {
          name: item.name,
          thumb: `http://localhost:3001/public/thumbnails/${item.name}`,
          foto: `http://localhost:3001/public/fotos/${item.name}`,
          metadata: item.metadata
        }

      });
      console.log(this.items);
    });


  }

  ngAfterViewInit (): void {
    this.drawImage = SVG().addTo(this.container.nativeElement).size(this.widthPx, this.heightPx);
    this.draw = SVG().addTo(this.svg.nativeElement).size(this.widthPx, this.heightPx);
    this.draw.on('click', this.svgClick.bind(this));
  }

  setPicture(picture: Picture) {
    this.showCalcSections = false;
    let item:Picture = this.items.find(item => item.name === picture.name);
    let aspect = item.metadata.heigth / item.metadata.width;
    this.currentPicture = item;
    console.log(this.img);
    if (!this.img) {
      this.img = this.drawImage.image(item.foto);
      this.img.size(this.widthPx,  this.widthPx * aspect);
    } else {
      this.img.load(item.foto);
    }
  }

  svgClick(e) {
      console.log(e.offsetX, e.offsetY);
      let point:Point = new Point(e.offsetX, e.offsetY);
      this.linePoints.push(point);
      let circle = this.draw.ellipse(4,4).fill(this.color).move(point.X - 2, point.Y - 2);
      this.lineCircles.push(circle);
      this.drawLines();
  }


  drawLines () {
    let points = this.linePoints;
    if (points.length % 2 == 0) {
      let line = this.draw.line(
        points[points.length -2].X,
        points[points.length -2].Y,
        points[points.length -1].X,
        points[points.length -1].Y)
        .stroke({width: 1, color: this.color});
        this.lines.push(line);
    }
  }

  // tools
  clearLines (isLine: boolean = true) {
    if (isLine) {
      this.linePoints = [];
      this.lines.forEach(line => line.remove())
      this.lineCircles.forEach(circle => circle.remove());
    } else {
      this.polyLinePoints = [];
    }
  }


  getLengthPx (plot: number[][]):number {
    let sum = 0;
    for (let i = 0; i < plot.length - 1; i++) {
      let x1 = plot[i][0];
      let y1 = plot[i][1];
      let x2 = plot[i + 1][0];
      let y2 = plot[i + 1][1];
      sum += Math.sqrt((x1 - x2)*(x1 - x2) + (y1 - y2) * (y1 - y2));
    }
    return sum;
  }

  getLengthLines () {
    let sum = 0;
    if (this.currentPicture['calc'] && this.currentPicture['calc'].lines) {
      this.currentPicture['calc'].lines.forEach(l => sum += l)
    }
    return sum;
  }

  calculate() {
      let data = {
        name: this.currentPicture.name,
        widthPx: this.widthPx,
        heightPx: this.heightPx,
        lines: this.lines.map(line => {
          return this.getLengthPx(line.plot());
        }),
      }
      this.ThubmnailsService.getCalculations(data)
        .subscribe(res => {
          console.log(res);
          this.currentPicture['calc'] = res['calc'];
          this.showCalcSections = true;
          this.showLineLabels();
        });
  }

  showLineLabels() {
    this.lineLabels.forEach(l => l.remove())
    this.lineLabels = [];
    this.lines.forEach((line, idx) => {
      let text = this.draw.text(`${this.currentPicture.calc.lines[idx].toFixed(4)} m`).font({fill:this.colorLabel});
      this.lineLabels.push(text);
      let arr = line.plot();
      let x = arr[0][0] + (arr[1][0] - arr[0][0]) / 2
      let y = arr[0][1] + (arr[1][1] - arr[0][1]) / 2

      //let ang =  Math.atan(arr[1][1] - arr[0][1] / arr[1][0] - arr[0][0]) * 180 / Math.PI;


      text.move(x, y);
      //text.rotate(ang);

    });
  }

}
