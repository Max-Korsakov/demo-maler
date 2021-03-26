import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Store, select } from '@ngrx/store';

import { VideoPlayerState } from './video-player.state';
import {
    FrameDataRoad,
  TrafficLogData
} from '../../app/models/traffic-models/index';
import {
  selectIsVideoPlay,
  selectCurrentTime,
  selectCurrentFrame,
  selectPlaybackRate,
  selectErrorStatus,
  selectFramePerSecond,
  selectVideoURl,
  selectVideoDuration,
  selectCurrentTimeFromControls,
  selectIsReadyPlay
} from './video-player.selectors';
import * as videoPlayerActions from './video-player.actions';

@Injectable({ providedIn: 'root' })
export class PlayerFacade {
  constructor(private store: Store<VideoPlayerState>) {}

  get videoURl$(): Observable<string | null> {
    return this.store.pipe(select(selectVideoURl));
  }

  get currentTimeFromControls$(): Observable<number> {
    return this.store.pipe(select(selectCurrentTimeFromControls));
  }

  get videoDuration$(): Observable<number> {
    return this.store.pipe(select(selectVideoDuration));
  }

  get isVideoPlay$(): Observable<boolean> {
    return this.store.pipe(select(selectIsVideoPlay));
  }

  get isReadyToPlay$(): Observable<boolean> {
    return this.store.pipe(select(selectIsReadyPlay));
  }

  get currentTime$(): Observable<number> {
    return this.store.pipe(select(selectCurrentTime));
  }
  get framePerSecond$(): Observable<number> {
    return this.store.pipe(select(selectFramePerSecond));
  }
  get error$(): Observable<Error | any> {
    return this.store.pipe(select(selectErrorStatus));
  }

  get playbackRate$(): Observable<number> {
    return this.store.pipe(select(selectPlaybackRate));
  }

  get currentFrame$(): Observable<number> {
    return this.store.pipe(select(selectCurrentFrame));
  }

  setVideoURl(url: string | null): void {
    this.store.dispatch(videoPlayerActions.SetVideoURl({ url }));
  }

  changeCurrentTimeFromControls(currentTime: number): void {
    this.store.dispatch(videoPlayerActions.ChangeCurrentTimeFromControls({ currentTime }));
  }


  setVideoDuration(duration: number): void {
    this.store.dispatch(videoPlayerActions.SetVideoDuration({ duration }));
  }

  playVideo(isPlay: boolean): void {
    this.store.dispatch(videoPlayerActions.PlayVideo({ isPlay }));
  }

  changeReadyToPlayStatus(isReadyToPlay: boolean): void {
    this.store.dispatch(videoPlayerActions.ChangeReadyToPlayStatus({ isReadyToPlay }));
  }

  changeFrame(frameNumber: number): void {
    this.store.dispatch(videoPlayerActions.FindFrame({frameNumber}));
  }

  changeCurrentTime(currentTime: number): void {
    this.store.dispatch(videoPlayerActions.FindCurrentTime({currentTime}));
  }

  changePlayerSpeed(playbackRate: number): void {
    this.store.dispatch(videoPlayerActions.ChangePlayerSpeed({ playbackRate }));
  }

  changeFPS(fps: number): void {
    this.store.dispatch(videoPlayerActions.ChangeFPS({ fps }));
  }

  deleteStateData(): void {
    this.store.dispatch(videoPlayerActions.DeleteStateData());
  }
}
