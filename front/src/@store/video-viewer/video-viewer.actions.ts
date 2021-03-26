import { createAction, props } from '@ngrx/store';

export const LoadVideo = createAction(
  '[VideoViewer] Load Video',
  props<{ chosenVideo: string; category: string }>()
);

export const LoadVideoSuccess = createAction(
  '[VideoViewer] Load Video Success',
  props<{ video: any }>()
);

export const LoadVideoError = createAction(
  '[VideoViewer] Load Video Error',
  props<{ error: Error | any }>()
);

export const LoadData = createAction(
  '[VideoViewer] Load Data',
  props<{ chosenVideo: string; project: string }>()
);

export const LoadDataSuccess = createAction(
  '[VideoViewer] Load  Data Success',
  props<{ data: any[] }>()
);

export const LoadDataError = createAction(
  '[VideoViewer] Load Data Error',
  props<{ error: Error | any }>()
);

export const LoadStandardData = createAction(
  '[VideoViewer] Load Standard Videos'
);

export const LoadStandardDataSuccess = createAction(
  '[VideoViewer] Load Standard Data Success',
  props<{ standardData: any }>()
);

export const LoadStandardDataError = createAction(
  '[VideoViewer] Load Standard Data Error',
  props<{ error: Error | any }>()
);

export const ChangeCurrentFrame = createAction(
  '[VideoViewer] Change Current Frame',
  props<{ currentFrame: number }>()
);

export const ChangeCurrentTime = createAction(
  '[VideoViewer] Change Current Time',
  props<{ currentTime: number }>()
);

export const ChangeVideoPlayStatus = createAction(
  '[VideoViewer] Change Video Play Status',
  props<{ isVideoPlayStatus: boolean }>()
);

export const SaveStandardData = createAction(
  '[VideoViewer] Save Standard Data',
  props<{ category: string; data: any }>()
);

export const SaveStandardDataSuccess = createAction(
  '[VideoViewer] Save Standard Success',
  props<{ standardData: any }>()
);

export const SaveStandardDataError = createAction(
  '[VideoViewer] Save Standard Data Error',
  props<{ error: Error | any }>()
);

export const DeleteStateData = createAction(
  '[VideoViewer] Delete State Data',
);

export const LoadCorrectionDataSuccess = createAction(
  '[VideoViewer] Load Correction Data Success',
  props<{ correctionData: any }>()
);

export const LoadCorrectionDataError = createAction(
  '[VideoViewer] Load Correction Data Error',
  props<{ error: Error | any }>()
);


