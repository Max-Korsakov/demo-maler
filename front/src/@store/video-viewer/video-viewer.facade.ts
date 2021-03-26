import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Store, select } from '@ngrx/store';

import { VideoViewerState } from './video-viewer.state';
import {
    FrameDataRoad,
  TrafficLogData
} from '../../app/models/traffic-models/index';
import {
  selectVideoViewerState,
  selectIsLoading,
  selectErrorStatus,
  selectLoadedVideo,
  selectVideoData,
  selectStandardData,
  selectIsVideoPlay,
  selectCurrentFrame,
  selectStopCurrentTime,
  selectCorrectionData
} from './video-viewer.selectors';
import * as videoViewerActions from './video-viewer.actions';

@Injectable({ providedIn: 'root' })
export class VideoViewerFacade {
  constructor(private store: Store<VideoViewerState>) {}

  get videoData$(): Observable<FrameDataRoad[]> {
    return this.store.pipe(select(selectVideoData));
  }

  get isLoading$(): Observable<boolean> {
    return this.store.pipe(select(selectIsLoading));
  }

  get error$(): Observable<Error | any> {
    return this.store.pipe(select(selectErrorStatus));
  }

  get standardData$(): Observable<TrafficLogData> {
    return this.store.pipe(select(selectStandardData));
  }

  get correctionData$(): Observable<TrafficLogData> {
    return this.store.pipe(select(selectCorrectionData));
  }

  get isVideoPlay$(): Observable<boolean> {
    return this.store.pipe(select(selectIsVideoPlay));
  }

  get loadedVideo$(): Observable<string> {
    return this.store.pipe(select(selectLoadedVideo));
  }

  get currentFrame$(): Observable<number> {
    return this.store.pipe(select(selectCurrentFrame));
  }

  get currentTime$(): Observable<number> {
    return this.store.pipe(select(selectStopCurrentTime));
  }

  loadVideo(chosenVideo: string, category: string): void {
    this.store.dispatch(videoViewerActions.LoadVideo({ chosenVideo, category }));
  }

  loadData(chosenVideo: string, project: string): void {
    this.store.dispatch(videoViewerActions.LoadData({chosenVideo, project}));
  }

  loadStandardData(): void {
    this.store.dispatch(videoViewerActions.LoadStandardData());
  }

  changeCurrentFrame(currentFrame: number): void {
    this.store.dispatch(videoViewerActions.ChangeCurrentFrame({ currentFrame }));
  }

  changeCurrentTime(currentTime: number): void {
    this.store.dispatch(videoViewerActions.ChangeCurrentTime({ currentTime }));
  }

  changeVideoPlayStatus(isVideoPlayStatus: boolean): void {
    this.store.dispatch(videoViewerActions.ChangeVideoPlayStatus({ isVideoPlayStatus }));
  }
  saveStandardData( category: string, data: any): void {
    this.store.dispatch(videoViewerActions.SaveStandardData({category, data}));
  }

  deleteStateData(): void {
    this.store.dispatch(videoViewerActions.DeleteStateData());
  }
}
