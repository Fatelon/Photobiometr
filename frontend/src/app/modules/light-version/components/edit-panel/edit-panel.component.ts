import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import ColorConvert from 'color-convert';

@Component({
  selector: 'app-edit-panel',
  templateUrl: './edit-panel.component.html',
  styleUrls: ['./edit-panel.component.scss']
})
export class EditPanelComponent implements OnInit {

  private pColor: string;
  @Input() set paletteColor(color) {
    this.pColor = color;
    this.paletteBackgroundColor = this.checkColor(color);
  }
  get paletteColor() {
    return this.pColor;
  }

  @Output() clearClick = new EventEmitter<any>();
  @Output() colorChanged = new EventEmitter<string>();
  @Output() zoomInClick = new EventEmitter<any>();
  @Output() zoomOutClick = new EventEmitter<any>();

  paletteBackgroundColor = '';

  constructor() { }

  ngOnInit() {
  }

  private checkColor(color: string): string {
    const hslColor = ColorConvert.hex.hsl(color);
    return hslColor[2] < 70 ? 'WhiteSmoke' : 'SlateGrey';
  }

  onClearClick(event) {
    this.clearClick.emit(event);
  }

  onColorChanged(event) {
    this.colorChanged.emit(event.target.value);
    this.paletteBackgroundColor = event.target.value;
  }

  onZoomInClick(event) {
    this.zoomInClick.emit(event);
  }

  onZoomOutClick(event) {
    this.zoomOutClick.emit(event);
  }

}
