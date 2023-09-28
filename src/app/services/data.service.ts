import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { GridData } from 'models/grid-data.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  //Dilerseniz data.json'a giderek genel verileri ve pagination için gerekli verileri değiştirebilirsiniz.
  private dataUrl = '/assets/data.json';

  constructor(private http: HttpClient) { }

  getGridData(): Observable<GridData> {
    return this.http.get<GridData>(this.dataUrl);
  }
}
