import {
  Component, OnInit, AfterViewInit, ViewChild, ElementRef, ChangeDetectionStrategy, Input, OnDestroy, Output, EventEmitter
} from '@angular/core';
import { SVG, Point, Text, Polyline, Image, ArrayXY, PointArrayAlias } from '@svgdotjs/svg.js';
import '@svgdotjs/svg.panzoom.js';
import { PictureObjectI } from '../../entities/picture-object';
import { Colors } from '../../entities/constants';
import { PointWithDrawingI } from '../../entities/point.entities';
import { environment } from '../../../../../environments/environment';
import { InfoViewModeType } from '../../entities/common';

@Component({
  selector: 'app-drawing-area',
  templateUrl: './drawing-area.component.html',
  styleUrls: ['./drawing-area.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DrawingAreaComponent implements OnInit, AfterViewInit, OnDestroy {

  @ViewChild('drawingArea') drArea: ElementRef;

  private lColor = Colors.Red;
  @Input() set lineColor(lineColor) {
    this.lColor = lineColor;
    this.redraw();
  }
  get lineColor() {
    return this.lColor;
  }

  private tColor = Colors.Blue;
  @Input() set textColor(textColor) {
    this.tColor = textColor;
    this.redraw();
  }
  get textColor() {
    return this.tColor;
  }

  private zScorer = 0;
  @Input() set zoomScorer(zoomScorer) {
    this.tryToZoom(zoomScorer);
    this.zScorer = zoomScorer;
  }
  get zoomScorer() {
    return this.zScorer;
  }

  private iViewMode = InfoViewModeType.length;
  @Input() set infoViewMode(infoViewMode) {
    this.iViewMode = infoViewMode;
    this.redraw();
  }
  get infoViewMode() {
    return this.iViewMode;
  }

  @Input() set clearTrigger(clearTrigger: boolean) {
    if (clearTrigger !== undefined) {
      this.toDefault();
      this.setBackgroundImage();
    }
  }

  @Input() set background(newImage: PictureObjectI) {
    this.currentImage = newImage;
    this.setBackgroundImage();
  }

  private drawingArea;
  private drawingBackground: Image;
  private drawingPolyine: Polyline;
  private drawingText: Text;
  private linePoints: PointWithDrawingI[] = [];
  private currentImage: PictureObjectI;
  private predClickPoint: Point = new Point();
  private polygonArea = 0.0;

  private readonly widthPx = 1080; // 600, 1080, 1200.
  private readonly heightPx = 810; // 450, 810, 900.
  private readonly diagonalPx = Math.sqrt(Math.pow(this.widthPx, 2) + Math.pow(this.heightPx, 2));
  private readonly clickDelta = 5; // px
  private readonly lineWidth = 1;
  private readonly zoomMin = 1;
  private readonly zoomMax = 10;
  private readonly zoomFactor = 0.5;

  constructor() { }

  ngOnInit() {
  }

  ngAfterViewInit(): void {
    this.initDrawingArea();
    this.setBackgroundImage();
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

    this.toDefault();

    this.drawingArea.on('contextmenu', this.onContextmenu);
    this.drawingArea.on('panStart', this.onPanStart);
    this.drawingArea.on('panEnd', this.onPanEnd);
  }

  private readonly onContextmenu = (event): void => {
    event.preventDefault();
    if (!this.linePoints || !this.linePoints.length) {
      return;
    }
    const lastPoint = this.linePoints.pop();
    lastPoint.circle.remove();
    this.redraw();
  }

  private readonly onPanStart = (event): void => {
    this.predClickPoint = new Point(event.detail.event.offsetX, event.detail.event.offsetY);
  }

  private readonly onPanEnd = (event): void => {
    const clickPoint: Point = new Point(event.detail.event.offsetX,  event.detail.event.offsetY);
    if (this.findDistance(this.predClickPoint, clickPoint) <= this.clickDelta) {
      const relativeX = clickPoint.x / this.drawingArea.zoom() + this.drawingArea.viewbox().x;
      const relativeY = clickPoint.y / this.drawingArea.zoom() + this.drawingArea.viewbox().y;
      this.addPoint(new Point(relativeX, relativeY));
    }
  }

  private addPoint(point: Point) {
    const linePoint: PointWithDrawingI = {
      point,
      circle: this.drawingArea.ellipse()
    };
    this.linePoints.push(linePoint);
    this.redraw();
  }

  private redraw() {
    if (!this.drawingArea) { return; }
    this.setCalculatedArea();
    this.drawPolyline();
    this.onLengthChange();
  }

  private onLengthChange(): void {
    const lineLengthPx = this.linePoints.reduce((length, point, index, points) =>
      length + (index > 0 ? this.findDistance(point.point, points[index - 1].point) : 0), 0);
    const realLength = lineLengthPx * this.currentImage.ratio / this.diagonalPx;

    this.drawLineLengthText(realLength * 100);
  }

  private drawPolyline(): void {
    this.linePoints.forEach(lPoint => {
      lPoint.circle.radius(2, 2).fill(this.lineColor).move(lPoint.point.x - 2, lPoint.point.y - 2);
    });

    const pointsPairs: PointArrayAlias = this.linePoints.map(p => [p.point.x, p.point.y] as ArrayXY);
    const fillColor = this.showLineAreaInfo() ? `${this.lineColor}50` : 'none';

    this.drawingPolyine
      .plot(pointsPairs)
      .fill(fillColor)
      .stroke(this.lineColor);
  }

  private drawLineLengthText(lineLength: number): void {
    if (!this.linePoints || !this.linePoints.length || !this.drawingText) { return; }

    const lastPoint = this.linePoints[this.linePoints.length - 1].point || new Point(0, 0);
    let text: any = '';
    if (lineLength && this.showLineLengthInfo()) {
      text = `L=${lineLength.toFixed(1)} сm`;
    }
    if (this.polygonArea && this.showLineAreaInfo()) {
      text = (add) => {
        add.tspan(`S=${this.polygonArea.toFixed(1)} cm`);
        add.tspan('2').dy(-5).font({ size: 10 });
      };
    }
    this.drawingText
      .text(text)
      .font({fill: this.textColor})
      .move(lastPoint.x, lastPoint.y);
  }

  private setBackgroundImage() {
    if (!this.currentImage || !this.drawingArea) { return; }

    this.toDefault();
    const scale = this.widthPx / this.currentImage.width;
    this.drawingBackground.load(this.currentImage.imgPath).scale(scale);
  }

  private findDistance(a: Point, b: Point): number {
    return Math.sqrt(Math.pow(a.x - b.x, 2) + Math.pow(a.y - b.y, 2));
  }

  private tryToZoom(zoomScorer): void {
    if (!this.drawingArea) {
      return;
    }
    const zoomSign = zoomScorer > this.zoomScorer ? 1 : -1;
    const currentZoom = this.drawingArea.zoom();
    let newZoom = currentZoom + zoomSign * this.zoomFactor;
    newZoom = Math.min(newZoom, this.zoomMax);
    newZoom = Math.max(newZoom, this.zoomMin);
    if (newZoom !== currentZoom) {
      this.drawingArea.animate().zoom(newZoom);
    }
  }

  private setCalculatedArea(): void {
    const points = this.linePoints;

    if (points.length <= 2) {
      this.polygonArea = 0;
      return;
    }

    let area = 0.0;
    let prevPoint = points[points.length - 1].point;
    points.forEach(pointObject => {
      const currentPoint = pointObject.point;
      area += (prevPoint.x + currentPoint.x) * (prevPoint.y - currentPoint.y);
      prevPoint = currentPoint;
    });
    const squareRatio = Math.pow(this.currentImage.ratio / this.diagonalPx * 100, 2);
    this.polygonArea = 0.5 * Math.abs( area) * squareRatio;
  }

  private showLineLengthInfo = (): boolean => this.infoViewMode === InfoViewModeType.length;
  private showLineAreaInfo = (): boolean => this.infoViewMode === InfoViewModeType.area;

  private toDefault(): void {
    this.linePoints = [];
    this.polygonArea = 0;
    this.drawingArea.viewbox(0, 0, this.widthPx, this.heightPx).zoom(1);
    this.drawingArea.clear();
    this.drawingArea.image(`${environment.serverPath}public/loader.png`);
    this.drawingBackground = this.drawingArea.image();
    this.drawingPolyine = this.drawingArea.polyline();
    this.drawingText = this.drawingArea.text('');
  }

  ngOnDestroy() {
    this.drawingArea.off('panStart');
    this.drawingArea.off('panEnd');
    this.drawingArea.clear();
  }
}
