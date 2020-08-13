import { Component, OnInit, OnDestroy, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { Subject } from 'rxjs';
import { Colors } from './entities/constants';
import { takeUntil } from 'rxjs/operators';
import { InfoService } from './services/info.service';
import { PictureObjectI } from './entities/picture-object';
import { InfoViewModeType } from './entities/common';

@Component({
  selector: 'app-light-version',
  templateUrl: 'light-version.component.html',
  styleUrls: ['light-version.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LightVersionComponent implements OnInit, OnDestroy {

  pictureObjects: PictureObjectI[] = [];
  needAutoSelect = true;
  zoomScorer = 0;
  infoViewMode = InfoViewModeType.length;
  userLineColor: string = Colors.Red;
  userTextColor: string = Colors.Blue;
  currentPicture: PictureObjectI;
  clearTrigger;

  private readonly destroy$ = new Subject();

  constructor(
    private readonly infoService: InfoService,
    private readonly changeDetectorRef: ChangeDetectorRef
  ) {
    this.infoService.getIPictureObjects()
      .pipe(takeUntil(this.destroy$))
      .subscribe((pictureObjects: PictureObjectI[]) => {
        this.pictureObjects = pictureObjects;
        if (this.needAutoSelect && this.pictureObjects && this.pictureObjects.length > 0) {
          this.needAutoSelect = false;
          this.onPictureChanged(this.pictureObjects[0]);
        }
        this.changeDetectorRef.markForCheck();
      });
  }

  ngOnInit() {
  }

  onPictureChanged(item: PictureObjectI) {
    this.currentPicture = item;
  }

  onClearClick(event) {
    this.clearTrigger = !this.clearTrigger;
  }

  onLineColorChanged(newColor: string) {
    this.userLineColor = newColor;
  }

  onTextColorChanged(newColor: string) {
    this.userTextColor = newColor;
  }

  onZoomInClick(event) {
    this.zoomScorer += 1;
  }

  onZoomOutClick(event) {
    this.zoomScorer -= 1;
  }

  onInfoViewModeChange(newValue: InfoViewModeType) {
    this.infoViewMode = newValue;
  }

  ngOnDestroy() {
    this.destroy$.unsubscribe();
  }

}
