import { createReducer, Action, on } from "@ngrx/store";

import { CategoriesState, initialState } from "./categories.state";
import * as categoriesActions from "./categories.actions";

const videoCategoriesReducer = createReducer(
  initialState,
  on(categoriesActions.LoadCategories, state => ({
    ...state,
    isLoading: true
  })),
  on(categoriesActions.SwitchCategories, (state, { isVideo }) => ({
    ...state,
    isVideo
  })),
  on(categoriesActions.LoadCategoriesSuccess, (state, { categories }) => ({
    ...state,
    categories,
    isLoading: false
  })),
  on(categoriesActions.LoadCategoriesError, (state, { error }) => ({
    ...state,
    error,
    isLoading: false
  })),
  on(
    categoriesActions.ChooseCategory,
    (state, { chosenCategory, isVideo }) => ({
      ...state,
      isLoading: true,
      chosenCategory
    })
  ),
  on(categoriesActions.LoadCategoryCases, (state, { chosenCategory }) => ({
    ...state,
    isLoading: true
  })),
  on(
    categoriesActions.LoadCategoryCasesSuccess,
    (state, { chosenCategoryCases }) => ({
      ...state,
      chosenCategoryCases,
      isLoading: false
    })
  ),
  on(categoriesActions.LoadCategoriesError, (state, { error }) => ({
    ...state,
    error,
    isLoading: false
  })),
  on(categoriesActions.ChooseVideo, (state, { chosenVideo }) => ({
    ...state,
    chosenVideo
  })),
  on(categoriesActions.ChoosePhoto, (state, { chosenPhoto }) => ({
    ...state,
    chosenPhoto
  })),
  on(categoriesActions.DeleteData, state => ({
    ...state,
    isCategoriesLoaded: false,
    categories: null,
    chosenCategory: null,
    chosenCategoryCases: null,
    chosenVideo: null,
    chosenPhoto: null
  }))
);

export function reducer(state: CategoriesState | undefined, action: Action) {
  return videoCategoriesReducer(state, action);
}
