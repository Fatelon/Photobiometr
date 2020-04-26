import { Component, OnInit, Input } from '@angular/core';
import { IPicture, IExifInfoObj } from '../entity';

@Component({
  selector: 'app-exif-info',
  templateUrl: './exif-info.component.html',
  styleUrls: ['./exif-info.component.scss']
})
export class ExifInfoComponent implements OnInit {

  @Input() picture: IPicture;

  public readonly displayedColumns: string[] = ['label', 'field'];
  public readonly fieldsToShow: IExifInfoObj[] = [
    {
      label: 'Distance:',
      field: 'distance'
    }, {
      label: 'Focus Length:',
      field: 'fl'
    }, {
      label: 'Focus Length 35mm:',
      field: 'efl'
    }, {
      label: 'DOF:',
      field: 'dof'
    }
  ];

  constructor() { }

  ngOnInit() {
  }

}
