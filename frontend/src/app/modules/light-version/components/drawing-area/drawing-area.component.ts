import {
  Component, OnInit, AfterViewInit, ViewChild, ElementRef, ChangeDetectionStrategy, Input, OnDestroy, Output, EventEmitter
} from '@angular/core';
import { SVG, Point } from '@svgdotjs/svg.js';
import '@svgdotjs/svg.panzoom.js';
import { PictureObjectI } from '../../entities/picture-object';
import { Colors } from '../../entities/constants';
import { ThrowStmt } from '@angular/compiler';

@Component({
  selector: 'app-drawing-area',
  templateUrl: './drawing-area.component.html',
  styleUrls: ['./drawing-area.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DrawingAreaComponent implements OnInit, AfterViewInit, OnDestroy {

  @ViewChild('drawingArea') drArea: ElementRef;

  @Input() lineColor = Colors.Red;
  private _zoomScorer = 0;
  @Input() set zoomScorer(zoomScorer) {
    this.tryToZoom(zoomScorer);
    this._zoomScorer = zoomScorer;
  }
  @Input() set clearTrigger(clearTrigger: boolean) {
    if (clearTrigger !== undefined) {
      this.toDefault();
      this.setBackgroundImage(this.currentPicture);
    }
  }

  @Input() set background(newImage: PictureObjectI) {
    this.currentPicture = newImage;
    this.setBackgroundImage(newImage);
  }

  @Output() sqrtLengthChange = new EventEmitter<any>();

  private currentPicture: PictureObjectI;
  private drawingArea;
  private tmpText;
  private predClickPoint: Point = new Point();
  private linePoints: Point[] = [];
  private readonly widthPx = 1080; // 600, 1080, 1200.
  private readonly heightPx = 810; // 450, 810, 900.
  private readonly sqrtClickDelta = 25; // 5px ^ 2
  private readonly lineWidth = 1;
  private readonly zoomMin = 1;
  private readonly zoomMax = 10;
  private readonly zoomFactor = 0.5;

  constructor() { }

  ngOnInit() {
  }

  ngAfterViewInit(): void {
    this.initDrawingArea();
    this.setBackgroundImage(this.currentPicture);
  }

  private initDrawingArea(): void {
    this.drawingArea = SVG()
    .addTo(this.drArea.nativeElement)
    .size(this.widthPx, this.heightPx)
    .viewbox(0, 0, this.widthPx, this.heightPx)
    .panZoom({
      zoomMin: this.zoomMin,
      zoomMax: this.zoomMax,
      zoomFactor: this.zoomFactor,
      margins: { top: this.heightPx, left: this.widthPx, right: this.widthPx, bottom: this.heightPx }
    });

    this.drawingArea.on('panStart', (ev) => {
      this.predClickPoint = new Point(ev.detail.event.offsetX, ev.detail.event.offsetY);
    });

    this.drawingArea.on('panEnd', (ev) => {
      const clickPoint: Point = new Point(ev.detail.event.offsetX,  ev.detail.event.offsetY);
      if (this.findSqrtDistance(this.predClickPoint, clickPoint) <= this.sqrtClickDelta) {
        const relativeX = clickPoint.x / this.drawingArea.zoom() + this.drawingArea.viewbox().x;
        const relativeY = clickPoint.y / this.drawingArea.zoom() + this.drawingArea.viewbox().y;
        this.addPoint(new Point(relativeX, relativeY));
      }
    });
  }

  private addPoint(point: Point) {
    this.drawingArea.ellipse(4, 4).fill(this.lineColor).move(point.x - 2, point.y - 2);
    if (this.linePoints.length > 0) {
      this.drawSegment(this.linePoints[this.linePoints.length - 1], point);
    }
    this.linePoints.push(point);
    this.onLengthChange();
  }

  private onLengthChange(): void {
    const lineLengthPx = this.linePoints.reduce((length, point, index, points) =>
      length + (index > 0 ? this.findDistance(point, points[index - 1]) : 0), 0);
    const diagonalPx = Math.sqrt(Math.pow(this.widthPx, 2) + Math.pow(this.heightPx, 2));
    const realLength = lineLengthPx * this.currentPicture.ratio / diagonalPx;
    this.sqrtLengthChange.emit(realLength);
    this.drawTextTmp(realLength * 100);
  }

  private drawTextTmp(lineLength: number): void {
    if (this.tmpText) {
      this.tmpText.remove();
    }
    this.tmpText = this.drawingArea
      .text(`${lineLength.toFixed(2)} сm`)
      .font({fill: this.lineColor});
    const lastPoint = this.linePoints[this.linePoints.length - 1];
    this.tmpText.move(lastPoint.x, lastPoint.y);
  }

  private drawSegment(a, b): void {
    this.drawingArea
      .line(a.x, a.y, b.x, b.y)
      .stroke({ width: this.lineWidth, color: this.lineColor });
  }

  private toDefault(): void {
    this.linePoints = [];
    this.drawingArea.viewbox(0, 0, this.widthPx, this.heightPx).zoom(1);
    this.drawingArea.clear();
  }

  private setBackgroundImage(newImage: PictureObjectI) {
    if (!newImage || !this.drawingArea) {
      return;
    }
    this.toDefault();
    const scale = this.widthPx / newImage.width;
    this.drawingArea.image(newImage.imgPath).scale(scale);
  }

  private findSqrtDistance(a: Point, b: Point): number {
    return Math.pow(a.x - b.x, 2) + Math.pow(a.y - b.y, 2);
  }

  private findDistance(a: Point, b: Point): number {
    return Math.sqrt(Math.pow(a.x - b.x, 2) + Math.pow(a.y - b.y, 2));
  }

  private tryToZoom(zoomScorer): void {
    if (!this.drawingArea) {
      return;
    }
    const zoomSign = zoomScorer > this._zoomScorer ? 1 : -1;
    const currentZoom = this.drawingArea.zoom();
    let newZoom = currentZoom + zoomSign * this.zoomFactor;
    newZoom = Math.min(newZoom, this.zoomMax);
    newZoom = Math.max(newZoom, this.zoomMin);
    console.log('zoomScorer', zoomSign, currentZoom, newZoom);
    if (newZoom !== currentZoom) {
      this.drawingArea.animate().zoom(newZoom);
    }
  }

  ngOnDestroy() {
    this.drawingArea.off('panStart');
    this.drawingArea.off('panEnd');
    this.drawingArea.clear();
  }

}
