import { Component, OnInit, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import ColorConvert from 'color-convert';

@Component({
  selector: 'app-edit-panel',
  templateUrl: './edit-panel.component.html',
  styleUrls: ['./edit-panel.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EditPanelComponent implements OnInit {

  private lColor: string;
  @Input() set lineColor(color) {
    this.lColor = color;
    this.linePaletteBackgroundColor = this.checkColor(color);
  }
  get lineColor() {
    return this.lColor;
  }

  private txtColor: string;
  @Input() set textColor(color) {
    this.txtColor = color;
    this.textPaletteBackgroundColor = this.checkColor(color);
  }
  get textColor() {
    return this.txtColor;
  }

  @Output() clearClick = new EventEmitter<any>();
  @Output() lineColorChanged = new EventEmitter<string>();
  @Output() textColorChanged = new EventEmitter<string>();
  @Output() zoomInClick = new EventEmitter<any>();
  @Output() zoomOutClick = new EventEmitter<any>();

  linePaletteBackgroundColor = '';
  textPaletteBackgroundColor = '';

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

  onLinesColorChanged(event) {
    this.lineColorChanged.emit(event.target.value);
    this.linePaletteBackgroundColor = event.target.value;
  }

  onTextColorChanged(event) {
    this.textColorChanged.emit(event.target.value);
    this.textPaletteBackgroundColor = event.target.value;
  }

  onZoomInClick(event) {
    this.zoomInClick.emit(event);
  }

  onZoomOutClick(event) {
    this.zoomOutClick.emit(event);
  }

}
