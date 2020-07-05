import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { Observable } from 'rxjs';
import { PictureObjectI } from '../entities/picture-object';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class InfoService {

  INFO_URL = 'light';

  constructor(private readonly http: HttpClient) {
  }

  getIPictureObjects = (): Observable<PictureObjectI[]> => {
    return this.http.get<PictureObjectI[]>(environment.serverPath + this.INFO_URL)
      .pipe(map((res: PictureObjectI[]) => res.map((item: PictureObjectI) => {
        item.imgPath = `${environment.serverPath}public/${item.imgPath}`;
        item.thumbnailsPath = `${environment.serverPath}public/${item.thumbnailsPath}`;
        return item;
      })));
  }
}
