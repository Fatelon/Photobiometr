import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';

@Component({
  selector: 'app-edit-panel',
  templateUrl: './edit-panel.component.html',
  styleUrls: ['./edit-panel.component.scss']
})
export class EditPanelComponent implements OnInit {

  @Input() paletteColor;

  @Output() clearClick: EventEmitter<any> = new EventEmitter<any>();
  @Output() colorChanged: EventEmitter<string> = new EventEmitter<string>();

  public types: string[] = ['Segment', 'Polyline'];

  constructor() { }

  ngOnInit() {
  }

  onClearClick(event) {
    this.clearClick.emit(event);
  }

  onColorChanged(event) {
    this.colorChanged.emit(event.target.value);
  }

}
