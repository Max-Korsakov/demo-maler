import { createReducer, Action, on } from '@ngrx/store';

import { VideoViewerState, initialState } from './video-viewer.state';
import * as videoViewerActions from './video-viewer.actions';

const playerReducer = createReducer(
  initialState,
  on(videoViewerActions.LoadVideo, (state, { chosenVideo }) => ({
    ...state,
    loadedVideo: chosenVideo
  })),
  on(videoViewerActions.LoadVideoSuccess, (state, { video }) => ({
    ...state,
    loadedVideo: video,
    isLoading: false
  })),
  on(videoViewerActions.LoadVideoError, (state, { error }) => ({
    ...state,
    error,
    isLoading: false
  })),

  on(videoViewerActions.LoadData, (state, { chosenVideo }) => ({
    ...state,
    isLoading: true
  })),
  on(videoViewerActions.LoadDataSuccess, (state, { data }) => ({
    ...state,
    videoData: data,
    isLoading: false
  })),
  on(videoViewerActions.LoadDataError, (state, { error }) => ({
    ...state,
    videoData: [],
    error,
    isLoading: false
  })),

  on(videoViewerActions.LoadStandardData, (state) => ({
    ...state,
    isLoading: true
  })),
  on(videoViewerActions.LoadStandardDataSuccess, (state, { standardData }) => ({
    ...state,
    standardData,
    isLoading: false
  })),
  on(videoViewerActions.LoadStandardDataError, (state, { error }) => ({
    ...state,
    error,
    isLoading: false
  })),
  on(videoViewerActions.LoadCorrectionDataSuccess, (state, { correctionData }) => ({
    ...state,
    correctionData,
    isLoading: false
  })),
  on(videoViewerActions.LoadCorrectionDataError, (state, { error }) => ({
    ...state,
    error,
    isLoading: false
  })),
  on(videoViewerActions.ChangeCurrentFrame, (state, { currentFrame }) => ({
    ...state,
    currentFrame
  })),
  on(videoViewerActions.ChangeCurrentTime, (state, { currentTime }) => ({
    ...state,
    stopCurrentTime: currentTime
  })),
  on(videoViewerActions.ChangeVideoPlayStatus, (state, { isVideoPlayStatus }) => ({
    ...state,
    isVideoPlay: isVideoPlayStatus
  })),
  on(videoViewerActions.SaveStandardDataSuccess, (state, { standardData }) => ({
    ...state,
    standardData
  })),
  on(videoViewerActions.DeleteStateData, (state) => ({
    ...state,
    standardData: null,
    videoData: [],
    correctionData: null
  }))
);

export function reducer(state: VideoViewerState | undefined, action: Action) {
  return playerReducer(state, action);
}
