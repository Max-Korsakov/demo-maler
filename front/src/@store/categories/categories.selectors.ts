import { createSelector, createFeatureSelector } from "@ngrx/store";

import { CategoriesState } from "./categories.state";

export const CATEGORIES_STATE = "[Landing page] categories";

export const selectCategoriesState = createFeatureSelector<CategoriesState>(
  CATEGORIES_STATE
);
export const selectCategories = createSelector(
  selectCategoriesState,
  (state: CategoriesState) => state.categories
);
export const selectIsLoading = createSelector(
  selectCategoriesState,
  (state: CategoriesState) => state.isLoading
);
export const selectChosenCategory = createSelector(
  selectCategoriesState,
  (state: CategoriesState) => state.chosenCategory
);
export const selectCategoryState = createSelector(
  selectCategoriesState,
  (state: CategoriesState) => state.isVideo
);
export const selectChosenCategoryCases = createSelector(
  selectCategoriesState,
  (state: CategoriesState) => state.chosenCategoryCases
);
export const selectErrorStatus = createSelector(
  selectCategoriesState,
  (state: CategoriesState) => state.error
);
export const selectChosenVideo = createSelector(
  selectCategoriesState,
  (state: CategoriesState) => state.chosenVideo
);
