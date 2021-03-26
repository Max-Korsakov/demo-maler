import { createAction, props } from '@ngrx/store';

export const LoadPhoto = createAction(
  '[Photo viewer] Load Photo',
  props<{ chosenCase: string; project: string, photo: string }>()
);

export const LoadPhotoSuccess = createAction(
  '[Photo viewer] Load Photo Success',
  props<{ photo: any }>()
);

export const LoadPhotoError = createAction(
  '[Photo viewer] Load Video Error',
  props<{ error: Error | any }>()
);

export const LoadData = createAction(
  '[Photo viewer] Load Data',
  props<{ chosenCase: string; project: string }>()
);

export const LoadDataSuccess = createAction(
  '[Photo viewer] Load  Data Success',
  props<{ data: any[] }>()
);

export const LoadDataError = createAction(
  '[Photo viewer] Load Data Error',
  props<{ error: Error | any }>()
);


export const ChangeCurrentFrame = createAction(
  '[Photo viewer] Change Current Frame',
  props<{ currentFrame: number }>()
);

export const DeleteStateData = createAction(
    '[Photo viewer] Delete State Data',
  );
