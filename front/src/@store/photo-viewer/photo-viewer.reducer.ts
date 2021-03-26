import { createReducer, Action, on } from '@ngrx/store';

import { PhotoViewerState, initialState } from './photo-viewer.state';
import * as PhotoViewerActions from './photo-viewer.actions';

const playerReducer = createReducer(
  initialState,
  on(PhotoViewerActions.LoadPhoto, (state, { chosenCase }) => ({
    ...state,
    loadedPhoto: chosenCase,
    isLoading: true
  })),
  on(PhotoViewerActions.LoadPhotoSuccess, (state, { photo }) => ({
    ...state,
    loadedPhoto: photo,
    isLoading: false
  })),
  on(PhotoViewerActions.LoadPhotoError, (state, { error }) => ({
    ...state,
    error,
    isLoading: false
  })),

  on(PhotoViewerActions.LoadData, (state, { chosenCase }) => ({
    ...state,
    isLoading: true
  })),
  on(PhotoViewerActions.LoadDataSuccess, (state, { data }) => ({
    ...state,
    photoData: data,
    isLoading: false
  })),
  on(PhotoViewerActions.LoadDataError, (state, { error }) => ({
    ...state,
    videoData: [],
    error,
    isLoading: false
  })),


  on(PhotoViewerActions.ChangeCurrentFrame, (state, { currentFrame }) => ({
    ...state,
    currentFrame
  })),

  on(PhotoViewerActions.DeleteStateData, (state) => ({
    ...state,
    photoData: [],
    currentFrame: 0
  }))
);

export function reducer(state: PhotoViewerState | undefined, action: Action) {
  return playerReducer(state, action);
}
