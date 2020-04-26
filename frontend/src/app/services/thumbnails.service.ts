import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

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
}
