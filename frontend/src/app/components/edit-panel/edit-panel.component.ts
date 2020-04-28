import { Component, OnInit, AfterViewInit, Output, EventEmitter, Input } from '@angular/core';
import ColorConvert from 'color-convert';
import { FigureType } from '../entity';
import { MatSelectChange } from '@angular/material/select';

@Component({
  selector: 'app-edit-panel',
  templateUrl: './edit-panel.component.html',
  styleUrls: ['./edit-panel.component.scss']
})
export class EditPanelComponent implements OnInit, AfterViewInit {

  @Input() paletteColor;
  @Input() paletteTextColor;
  @Input() figureType: FigureType;

  @Output() clearClick: EventEmitter<any> = new EventEmitter<any>();
  @Output() colorChanged: EventEmitter<string> = new EventEmitter<string>();
  @Output() colorTextChanged: EventEmitter<string> = new EventEmitter<string>();
  @Output() figureChanged: EventEmitter<MatSelectChange> = new EventEmitter<MatSelectChange>();

  complColor: string;
  complTextColor: string;

  public types: FigureType[] = ['Segment', 'Polyline', 'Polygon'];

  constructor() { }

  ngOnInit() {
    
  }

  ngAfterViewInit () {
    this.complColor = this.checkColor(this.paletteColor);
    this.complTextColor = this.checkColor(this.paletteTextColor);

  }

  onClearClick(event) {
    this.clearClick.emit(event);
    
  }

  checkColor(color:string):string {
    let hslColor = ColorConvert.hex.hsl(color);
    return hslColor[2] < 70 ? 'white' : 'black';
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
