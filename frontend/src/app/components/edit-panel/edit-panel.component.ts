import { Component, OnInit, Output, EventEmitter, Input, SimpleChanges } from '@angular/core';
import ColorConvert from 'color-convert';

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

  @Output() clearClick: EventEmitter<any> = new EventEmitter<any>();
  @Output() colorChanged: EventEmitter<string> = new EventEmitter<string>();
  @Output() colorTextChanged: EventEmitter<string> = new EventEmitter<string>();

  complColor: string;
  complTextColor: string;

  public types: string[] = ['Segment', 'Polyline'];

  constructor() { }

  ngOnInit() { }

  onClearClick(event) {
    this.clearClick.emit(event);
  }

  checkColor(color: string): string {
    const hslColor = ColorConvert.hex.hsl(color);
    return hslColor[2] < 70 ? 'WhiteSmoke' : 'SlateGrey';
  }

  onColorChanged(event) {
    this.colorChanged.emit(event.target.value);
    this.complColor = this.checkColor(event.target.value);
  }

  onColorTextChanged(event) {
    this.colorTextChanged.emit(event.target.value);
    this.complTextColor = this.checkColor(event.target.value);
  }

}
