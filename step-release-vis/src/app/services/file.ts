import {Injectable} from '@angular/core';
import {Observable, of} from 'rxjs';
import {HttpClient} from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class FileService {
  constructor(private http: HttpClient) {}

  readContents<T>(filePath: string): Observable<T> {
    return this.http.get<T>(filePath);
  }

  readBinaryContents(filePath: string): Observable<ArrayBuffer> {
    return this.http.get(filePath, {responseType: 'arraybuffer'});
  }

  getData(): Observable<string> {
    return of(window.localStorage.getItem('data'));
  }
}
