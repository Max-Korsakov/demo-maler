import { createSelector, createFeatureSelector } from '@ngrx/store';

import { VideoPlayerState } from './video-player.state';

export const PLAYER_STATE = '[Player]';

export const selectVideoPlayerState = createFeatureSelector<VideoPlayerState>(
  PLAYER_STATE
);
export const selectVideoURl = createSelector(
  selectVideoPlayerState,
(state: VideoPlayerState) => state.videoURl
);

export const selectVideoDuration = createSelector(
  selectVideoPlayerState,
(state: VideoPlayerState) => state.videoDuration
);
export const selectCurrentTimeFromControls = createSelector(
  selectVideoPlayerState,
(state: VideoPlayerState) => state.currentTimeFromControls
);
export const selectIsReadyPlay = createSelector(
  selectVideoPlayerState,
(state: VideoPlayerState) => state.isReadyToPlay
);
export const selectIsVideoPlay = createSelector(
    selectVideoPlayerState,
  (state: VideoPlayerState) => state.isVideoPlay
);
export const selectCurrentTime = createSelector(
    selectVideoPlayerState,
  (state: VideoPlayerState) => state.currentTime
);
export const selectCurrentFrame = createSelector(
    selectVideoPlayerState,
  (state: VideoPlayerState) => state.currentFrame
);
export const selectFramePerSecond = createSelector(
  selectVideoPlayerState,
(state: VideoPlayerState) => state.framePerSecond
);
export const selectPlaybackRate = createSelector(
    selectVideoPlayerState,
  (state: VideoPlayerState) => state.playbackRate
);
export const selectErrorStatus = createSelector(
    selectVideoPlayerState,
  (state: VideoPlayerState) => state.error
);




