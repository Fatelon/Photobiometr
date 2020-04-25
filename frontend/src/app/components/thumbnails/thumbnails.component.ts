import { Component, OnInit, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import {ThubmnailsService} from '../../services/thubmnails.service';
import { SVG } from '@svgdotjs/svg.js';

interface Picture {
  name: string;
  thumb: string;
  foto: string;
  metadata: any;
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
  selector: 'app-thumbnails',
  templateUrl: './thumbnails.component.html',
  styleUrls: ['./thumbnails.component.scss']
})
export class ThumbnailsComponent implements OnInit, AfterViewInit {
  items: Picture[] = [];
  currentPicture: Picture;

  points: Point[] = [];
  circles: any[] =  [];

  drowingArea;
  img;
  drawImage;

  @ViewChild('imgArea') imgArea: ElementRef;
  @ViewChild('drowingArea') dArea: ElementRef;

  constructor(private readonly thubmnailsService: ThubmnailsService) {

  }

  ngOnInit(): void {
    this.thubmnailsService.getThumbs().subscribe((res: string[]) => {
      this.items = res.map((item: any) => {
        return {
          name: item.name,
          thumb: `http://localhost:3001/public/thumbnails/${item.name}`,
          foto: `http://localhost:3001/public/fotos/${item.name}`,
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
    // this.draw.click(this.svgClick);
  }

  setPicture(picture: Picture) {
    const item: Picture = this.items.find(it => it.name === picture.name);
    this.currentPicture = item;
    if (!this.img) {
      this.img = this.drawImage.image(item.foto);
    } else {
      this.img.load(item.foto);
    }
  }

  svgClick(e) {

      console.log(e.offsetX, e.offsetY);

      const point: Point = new Point(e.offsetX, e.offsetY);
      this.points.push(point);

      const circle = this.drowingArea.ellipse(4, 4).fill('#f06').move(point.X - 2, point.Y - 2);
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
        points[points.length - 1].Y)
        .stroke({width: 1, color: '#f06'});
        // this.lines.push(line);
    }
  }

  clearDrawingArea(event) {
    this.points = [];
    this.drowingArea.clear();
  }

}
