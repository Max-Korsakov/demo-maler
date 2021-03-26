import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Store, select } from '@ngrx/store';

import { PhotoViewerState } from './photo-viewer.state';
import {
    FrameDataRoad,
  TrafficLogData
} from '../../app/models/traffic-models/index';
import {
    selectLoadedPhoto,
    selectIsLoading,
    selectPhotoData,
    selectErrorStatus,
    selectCurrentFrame
} from './photo-viewer.selectors';
import * as photoViewerActions from './photo-viewer.actions';

@Injectable({ providedIn: 'root' })
export class PhotoViewerFacade {
  constructor(private store: Store<PhotoViewerState>) {}

  get photoData$(): Observable<FrameDataRoad[]> {
    return this.store.pipe(select(selectPhotoData));
  }

  get isLoading$(): Observable<boolean> {
    return this.store.pipe(select(selectIsLoading));
  }

  get error$(): Observable<Error | any> {
    return this.store.pipe(select(selectErrorStatus));
  }


  get loadedPhoto$(): Observable<string> {
    return this.store.pipe(select(selectLoadedPhoto));
  }

  get currentFrame$(): Observable<number> {
    return this.store.pipe(select(selectCurrentFrame));
  }



  loadPhoto(photo: string, chosenCase: string, project: string): void {
    this.store.dispatch(photoViewerActions.LoadPhoto({  chosenCase, project, photo }));
  }

  loadData(chosenCase: string, project: string): void {
    this.store.dispatch(photoViewerActions.LoadData({chosenCase, project}));
  }

  changeCurrentFrame(currentFrame: number): void {
    this.store.dispatch(photoViewerActions.ChangeCurrentFrame({ currentFrame }));
  }

  deleteStateData(): void {
    this.store.dispatch(photoViewerActions.DeleteStateData());
  }
}
