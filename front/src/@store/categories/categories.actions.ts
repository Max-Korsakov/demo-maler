import { createAction, props } from '@ngrx/store';

export const SwitchCategories = createAction(
  '[Landing page] Switch Categories',
  props<{ isVideo: boolean }>()
);

export const LoadCategories = createAction(
  '[Landing page] Load Categories',
  props<{ isVideo: boolean }>()
);

export const LoadCategoriesSuccess = createAction(
  '[Landing page] Load Categories Success',
  props<{ categories: string[] }>()
);

export const LoadCategoriesError = createAction(
  '[Landing page] Load Categories Error',
  props<{ error: Error | any }>()
);

export const ChooseCategory = createAction(
  '[Landing page] Choose Category',
  props<{ chosenCategory: string; isVideo?: boolean }>()
);

export const LoadCategoryCases = createAction(
  '[Landing page] Load Category Videos',
  props<{ chosenCategory: string }>()
);

export const LoadCategoryCasesSuccess = createAction(
  '[Landing page] Load Category Videos Success',
  props<{ chosenCategoryCases: string[] }>()
);

export const LoadCategoryCasesError = createAction(
  '[Landing page] Load Category Videos Error',
  props<{ error: Error | any }>()
);

export const ChooseVideo = createAction(
  '[Landing page] Choose Video',
  props<{ chosenVideo: string; category: string }>()
);

export const ChoosePhoto = createAction(
  '[Landing page] Choose Photo',
  props<{ chosenPhoto: string; category: string }>()
);

export const DeleteData = createAction('[Landing page] Delete Data');
