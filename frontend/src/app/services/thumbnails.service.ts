import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ThumbnailsService {


  constructor(private readonly http: HttpClient) {
  }

  getThumbs() {
    return this.http.get('http://localhost:3001/');
  }

  getCalculations(data) {
    return this.http.post('http://localhost:3001/calc', data);
  }
}
