import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { IPictureObject } from '../modules/light-version/entities/picture-object';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { IApiPictureObject } from './entity';

@Injectable({
  providedIn: 'root'
})
export class ThumbnailsService {

  constructor(private readonly http: HttpClient) {
  }

  getThumbs() {
    return this.http.get(environment.serverPath);
  }

  getCalculations(data) {
    return this.http.post(`${environment.serverPath}calc`, data);
  }

  getIPictureObjects = (): Observable<IPictureObject[]> => {
    return this.http.get<IApiPictureObject[]>(environment.serverPath)
      .pipe(map((res: IApiPictureObject[]) => res.map((item: IApiPictureObject) => ({
        name: item.name,
        thumb: `${environment.serverPath}public/thumbnails/${item.name}`,
        photo: `${environment.serverPath}public/fotos/${item.name}`
      }))));
  }

}
