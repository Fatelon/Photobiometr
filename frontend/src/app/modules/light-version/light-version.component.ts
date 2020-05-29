import { Component, OnInit, OnDestroy, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { ThumbnailsService } from '../../services/thumbnails.service';
import { Subject } from 'rxjs';
import { IPictureObject } from './entities/picture-object';
import { Colors } from './entities/constants';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-light-version',
  templateUrl: './light-version.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LightVersionComponent implements OnInit, OnDestroy {

  pictureObjects: IPictureObject[] = [];
  needAutoSelect = true;
  userColor: string = Colors.Green;
  currentPicture: IPictureObject;

  private readonly destroy$ = new Subject();

  constructor(
    private readonly thubmnailsService: ThumbnailsService,
    private readonly changeDetectorRef: ChangeDetectorRef
  ) {
    this.thubmnailsService.getIPictureObjects()
      .pipe(takeUntil(this.destroy$))
      .subscribe((pictureObjects: IPictureObject[]) => {
        this.pictureObjects = pictureObjects;
        if (this.needAutoSelect && this.pictureObjects && this.pictureObjects.length > 0) {
          this.needAutoSelect = false;
          this.currentPicture = this.pictureObjects[0];
        }
        this.changeDetectorRef.markForCheck();
      });
  }

  ngOnInit() {
  }

  onPictureChanged(item: IPictureObject) {
    console.log('onPictureChanged', item);
    this.currentPicture = item;
  }

  onClearClick(event) {
  }

  onColorChanged(newColor: string) {
    this.userColor = newColor;
  }

  onZoomInClick(event) {
  }

  onZoomOutClick(event) {
  }

  ngOnDestroy() {
    this.destroy$.unsubscribe();
  }

}
