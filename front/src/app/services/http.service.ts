import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpEventType } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class HttpService {
  public server = `http://${location.hostname}:8000`;

  constructor(private http: HttpClient) {}

  public getBindingData(chosenVideo: string): Observable<any> {
    if (chosenVideo) {
      return this.http.get(this.server + '/data/' + `${chosenVideo}`);
    }
  }

  public getCategories(isVideo): Observable<any> {
    if (isVideo) {
      return this.http.get(this.server + '/video');
    } else {
      return this.http.get(this.server + '/photo');
    }
  }

  public getPhoto(
    project: string,
    caseName: string,
    photoName: string
  ): Observable<any> {
    const params = new HttpParams()
      .set('project', project)
      .set('caseName', caseName)
      .set('photoName', photoName);
    return this.http.get(this.server + '/photo/getone', { params });
  }

  public getVideo(project: string, caseName: string): Observable<any> {
    const params = new HttpParams()
      .set('project', project)
      .set('caseName', caseName);
    if (project && caseName) {
      return this.http.get(this.server + '/video/getvideo', { params });
    }
  }

  public getCasesInCategory(action: any): Observable<any> {
    if (action.isVideo) {
      return this.http.get(
        this.server + '/video/' + `/${action.chosenCategory}`
      );
    } else {
      return this.http.get(
        this.server + '/photo/' + `/${action.chosenCategory}`
      );
    }
  }

  public getPosterLink(
    caseName: string,
    chosenProject: string,
    isVideo: boolean
  ): Observable<any> {
    const params = new HttpParams()
      .set('caseName', caseName)
      .set('project', chosenProject);
    if (isVideo) {
      return this.http.get(this.server + '/video/poster', { params });
    } else {
      return this.http.get(this.server + '/photo/poster', { params });
    }
  }

  public getBindingPhotoData(
    project: string,
    caseName: string
  ): Observable<any> {
    const params = new HttpParams()
      .set('caseName', caseName)
      .set('project', project);
    return this.http.get(this.server + '/photo/jsondata', { params });
  }

  public getBindingVideoData(
    project: string,
    caseName: string
  ): Observable<any> {
    const params = new HttpParams()
      .set('caseName', caseName)
      .set('project', project);
    return this.http.get(this.server + '/video/jsondata', { params });
  }

  public saveStandardData(categoryId: string, data: string): Observable<any> {
    return this.http.post<any>(this.server + '/data/' + `${categoryId}`, data);
  }

  public loadStandardData(): Observable<any> {
    return this.http.get<any>(this.server + '/data/standard');
  }

  public loadCorrectionData(): Observable<any> {
    return this.http.get<any>(this.server + '/data/correction');
  }

  public uploadNewCase(
    data: any,
    caseName: string,
    project: string,
    isVideo: boolean,
    jsonName?: string
  ): Observable<any> {
    const params = new HttpParams()
      .set('caseName', caseName)
      .set('project', project)
      .set('isVideo', String(isVideo))
      .set('jsonName', jsonName);
    return this.http
      .post<any>(this.server + `/upload`, data, {
        params,
        reportProgress: true,
        observe: 'events',
      })
      .pipe(
        map((event) => {
          switch (event.type) {
            case HttpEventType.UploadProgress:
              const progress = Math.round((100 * event.loaded) / event.total);
              return { status: 'progress', message: progress };
            case HttpEventType.Response:
              return { status: 'loaded', data: event.body };
            default:
              null;
          }
        })
      );
  }

  public deletePhotoCase(caseName: string, project: string): Observable<any> {
    const params = new HttpParams()
      .set('caseName', caseName)
      .set('project', project);
    return this.http.delete<any>(this.server + '/photo/case', { params });
  }

  public deleteVideoCase(caseName: string, project: string): Observable<any> {
    const params = new HttpParams()
      .set('caseName', caseName)
      .set('project', project);
    return this.http.delete<any>(this.server + '/video/case', { params });
  }
}
