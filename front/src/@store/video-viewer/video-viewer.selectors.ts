import { createSelector, createFeatureSelector } from '@ngrx/store';

import { VideoViewerState } from './video-viewer.state';

export const VIDEO_VIEWER = '[VideoViewer]';

export const selectVideoViewerState = createFeatureSelector<VideoViewerState>(
  VIDEO_VIEWER
);
export const selectLoadedVideo = createSelector(
  selectVideoViewerState,
  (state: VideoViewerState) => state.loadedVideo
);
export const selectIsLoading = createSelector(
  selectVideoViewerState,
  (state: VideoViewerState) => state.isLoading
);
export const selectVideoData = createSelector(
  selectVideoViewerState,
  (state: VideoViewerState) => state.videoData
);
export const selectStandardData = createSelector(
  selectVideoViewerState,
  (state: VideoViewerState) => state.standardData
);

export const selectCorrectionData = createSelector(
  selectVideoViewerState,
  (state: VideoViewerState) => state.correctionData
);

export const selectErrorStatus = createSelector(
  selectVideoViewerState,
  (state: VideoViewerState) => state.error
);
export const selectIsVideoPlay = createSelector(
  selectVideoViewerState,
  (state: VideoViewerState) => state.isVideoPlay
);
export const selectCurrentFrame = createSelector(
  selectVideoViewerState,
  (state: VideoViewerState) => state.currentFrame
);

export const selectStopCurrentTime = createSelector(
  selectVideoViewerState,
  (state: VideoViewerState) => state.stopCurrentTime
);


