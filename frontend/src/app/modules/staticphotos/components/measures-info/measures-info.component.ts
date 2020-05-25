
import { Component, OnInit, Input } from '@angular/core';
import { IPicture, IExifInfoObj } from '../entity';

@Component({
  selector: 'app-measures-info',
  templateUrl: './measures-info.component.html',
  styleUrls: ['./measures-info.component.scss']
})
export class MeasuresInfoComponent implements OnInit {
  @Input() picture: IPicture;

  public readonly displayedColumns: string[] = ['label', 'field'];
  public readonly fieldsToShow: IExifInfoObj[] = [
    {
      label: 'Ratio:',
      field: 'ratio'
    }, {
      label: 'Diagonal:',
      field: 'diagonal'
    }, {
      label: 'Width:',
      field: 'width'
    }, {
      label: 'Height:',
      field: 'height'
    }
  ];

  constructor() { }

  ngOnInit() {
  }

}
