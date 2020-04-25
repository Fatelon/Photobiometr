import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable, throwError} from 'rxjs';
import {catchError, retry} from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class ThubmnailsService {


  constructor(private http: HttpClient) { 
  }
  getThumbs() {
    return this.http.get('http://localhost:3001/');
  }

  getCalculations (data) {
    return this.http.post('http://localhost:3001/calc', data);
  }
}
