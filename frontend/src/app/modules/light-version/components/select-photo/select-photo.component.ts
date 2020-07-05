import { Component, OnInit, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { PictureObjectI } from '../../entities/picture-object';

@Component({
  selector: 'app-select-photo',
  templateUrl: './select-photo.component.html',
  styleUrls: ['./select-photo.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SelectPhotoComponent implements OnInit {

  @Input() items: PictureObjectI[];

  @Output() itemSelected = new EventEmitter<PictureObjectI>();

  constructor() { }

  ngOnInit() {
  }

  onItemClick(item: PictureObjectI) {
    this.itemSelected.emit(item);
  }

}
