import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { IPictureObject } from '../../entities/picture-object';

@Component({
  selector: 'app-select-photo',
  templateUrl: './select-photo.component.html',
  styleUrls: ['./select-photo.component.scss']
})
export class SelectPhotoComponent implements OnInit {

  @Input() items: IPictureObject[];

  @Output() itemSelected = new EventEmitter<IPictureObject>();

  constructor() { }

  ngOnInit() {
  }

  onItemClick(item: IPictureObject) {
    this.itemSelected.emit(item);
  }

}
