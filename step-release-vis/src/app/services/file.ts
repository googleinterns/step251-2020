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

  getBinaryData(): Observable<ArrayBuffer> {
    return of(
      this.stringToArrayBuffer(window.localStorage.getItem('binaryData'))
    );
  }

  private stringToArrayBuffer(str: string): ArrayBuffer {
    const buf: ArrayBuffer = new ArrayBuffer(str.length);
    const bufView = new Uint8Array(buf);
    for (let i = 0, strLen = str.length; i < strLen; i++) {
      bufView[i] = str.charCodeAt(i);
    }
    return buf;
  }

  getData(): Observable<string> {
    return of(window.localStorage.getItem('data'));
  }
}
