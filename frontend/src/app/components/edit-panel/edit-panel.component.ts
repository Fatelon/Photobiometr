import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import ColorConvert from 'color-convert';
import { FigureType } from '../entity';
import { MatSelectChange } from '@angular/material/select';

@Component({
  selector: 'app-edit-panel',
  templateUrl: './edit-panel.component.html',
  styleUrls: ['./edit-panel.component.scss']
})
export class EditPanelComponent implements OnInit {

  private _paletteColor: string;
  @Input() set paletteColor(color) {
    this._paletteColor = color;
    this.complColor = this.checkColor(this.paletteColor);
  }
  get paletteColor() {
    return this._paletteColor;
  }

  private _paletteTextColor: string;
  @Input() set paletteTextColor(color) {
    this._paletteTextColor = color;
    this.complTextColor = this.checkColor(this.paletteTextColor);
  }
  get paletteTextColor() {
    return this._paletteTextColor;
  }
  @Input() figureType: FigureType;

  @Output() clearClick: EventEmitter<any> = new EventEmitter<any>();
  @Output() colorChanged: EventEmitter<string> = new EventEmitter<string>();
  @Output() colorTextChanged: EventEmitter<string> = new EventEmitter<string>();
  @Output() figureChanged: EventEmitter<MatSelectChange> = new EventEmitter<MatSelectChange>();

  complColor: string;
  complTextColor: string;

  public types: FigureType[] = ['Segment', 'Polyline', 'Polygon'];

  constructor() { }

  ngOnInit() { }

  onClearClick(event) {
    this.clearClick.emit(event);
  }

  checkColor(color: string): string {
    const hslColor = ColorConvert.hex.hsl(color);
    return hslColor[2] < 60 ? 'WhiteSmoke' : 'SlateGrey';
  }

  onColorChanged(event) {
    this.colorChanged.emit(event.target.value);
    this.complColor = this.checkColor(event.target.value);
  }

  onColorTextChanged(event) {
    this.colorTextChanged.emit(event.target.value);
    this.complTextColor = this.checkColor(event.target.value);
  }

  onFigureChanged(event) {
    console.log(event);
    this.figureChanged.emit(event);
  }
}
