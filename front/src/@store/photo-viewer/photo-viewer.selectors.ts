import { createSelector, createFeatureSelector } from '@ngrx/store';

import { PhotoViewerState } from './photo-viewer.state';

export const PHOTO_VIEWER_STATE = '[Photo viewer]';

export const selectPhotoViewerState = createFeatureSelector<PhotoViewerState>(
    PHOTO_VIEWER_STATE
);
export const selectLoadedPhoto = createSelector(
    selectPhotoViewerState,
  (state: PhotoViewerState) => state.loadedPhoto
);
export const selectIsLoading = createSelector(
    selectPhotoViewerState,
  (state: PhotoViewerState) => state.isLoading
);
export const selectPhotoData = createSelector(
    selectPhotoViewerState,
  (state: PhotoViewerState) => state.photoData
);


export const selectErrorStatus = createSelector(
    selectPhotoViewerState,
  (state: PhotoViewerState) => state.error
);

export const selectCurrentFrame = createSelector(
    selectPhotoViewerState,
  (state: PhotoViewerState) => state.currentFrame
);

