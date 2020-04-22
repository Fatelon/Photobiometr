import { Component, OnInit, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import {ThubmnailsService} from '../../services/thubmnails.service';
import { SVG } from '@svgdotjs/svg.js'

interface Picture {
  name: string;
  thumb: string;
  foto: string;
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
  currentPicture = "";

  points: Point[] = [];
  circles: any[]=  [];

  draw;
  img;
  drawImage;

  @ViewChild('container') container: ElementRef;
  @ViewChild('svg') svg: ElementRef;

  constructor(private ThubmnailsService: ThubmnailsService) { 
    
  }

  ngOnInit(): void {
    this.ThubmnailsService.getThumbs().subscribe((res:string[]) => {
      this.items = res.map(name => {
        return {
          name: name,
          thumb: `http://localhost:3001/public/thumbnails/${name}`,
          foto: `http://localhost:3001/public/fotos/${name}`,
        }
        
      });
      console.log(this.items);
    });

    
  }
  
  ngAfterViewInit (): void {
    this.drawImage = SVG().addTo(this.container.nativeElement).size(600, 400);
    this.draw = SVG().addTo(this.svg.nativeElement).size(600, 400);
    this.draw.on('click', this.svgClick.bind(this));
  }

  setPicture(picture: Picture) {
    let item:Picture = this.items.find(item => item.name === picture.name);
    this.currentPicture = item.foto || "";
    if (!this.img) {
      this.img = this.drawImage.image(item.foto);
    } else {
      this.img.load(item.foto);
    }
  }

  svgClick(e) {
    
      console.log(e.offsetX, e.offsetY);
      
      let point:Point = new Point(e.offsetX, e.offsetY);
      this.points.push(point);
      
      let circle = this.draw.ellipse(4,4).fill('#f06').move(point.X - 2, point.Y - 2);
      //this.circles.push(circle);
      this.drawLines();
  
  }

  drawLines () {
    let points = this.points;
    if (points.length % 2 == 0) {
      let line = this.draw.line(
        points[points.length -2].X, 
        points[points.length -2].Y, 
        points[points.length -1].X,
        points[points.length -1].Y)
        .stroke({width: 1, color:'#f06'});
        //this.lines.push(line);
    }
}

}
