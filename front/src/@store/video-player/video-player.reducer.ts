import { createReducer, Action, on } from '@ngrx/store';

import { VideoPlayerState, initialState } from './video-player.state';
import * as videoPlayerActions from './video-player.actions';

const playerReducer = createReducer(
  initialState,
  on(videoPlayerActions.SetVideoURl, (state, { url }) => ({
    ...state,
    videoURl: url
  })),
  on(videoPlayerActions.SetVideoDuration, (state, { duration }) => ({
    ...state,
    videoDuration: duration
  })),
  on(videoPlayerActions.ChangeCurrentTimeFromControls, (state, { currentTime }) => ({
    ...state,
    currentTimeFromControls: currentTime
  })),
  on(videoPlayerActions.PlayVideo, (state, { isPlay }) => ({
    ...state,
    isVideoPlay: isPlay
  })),
  on(videoPlayerActions.ChangeReadyToPlayStatus, (state, { isReadyToPlay }) => ({
    ...state,
    isReadyToPlay
  })),
  on(videoPlayerActions.FindFrame, (state, { frameNumber }) => ({
    ...state,
    currentFrame: frameNumber
  })),
  on(videoPlayerActions.FindCurrentTime, (state, { currentTime }) => ({
    ...state,
    currentTime
  })),

  on(videoPlayerActions.ChangePlayerSpeed, (state, { playbackRate }) => ({
    ...state,
    playbackRate
  })),

  on(videoPlayerActions.ChangeFPS, (state, { fps }) => ({
    ...state,
    framePerSecond: fps
  })),

  on(videoPlayerActions.Error, (state, { error }) => ({
    ...state,
    error
  })),
  on(videoPlayerActions.DeleteStateData, (state) => ({
    ...state,
    videoURl: null,
    currentTime: 0,
    currentTimeFromControls: 0,
    isVideoPlay: false,
    isReadyToPlay: false,
    videoDuration: 0,
    currentFrame: 0,
    playbackRate: 1,
    framePerSecond: 25,
    error: null
  }))
);

export function reducer(state: VideoPlayerState | undefined, action: Action) {
  return playerReducer(state, action);
}
