import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { Store, select } from "@ngrx/store";

import { CategoriesState } from "./categories.state";
import {
  selectCategories,
  selectIsLoading,
  selectErrorStatus,
  selectChosenCategory,
  selectChosenCategoryCases,
  selectCategoryState
} from "./categories.selectors";
import * as categoryActions from "./categories.actions";

@Injectable({ providedIn: "root" })
export class CategoriesFacade {
  constructor(private store: Store<CategoriesState>) {}

  get categories$(): Observable<string[]> {
    return this.store.pipe(select(selectCategories));
  }

  get isLoading$(): Observable<boolean> {
    return this.store.pipe(select(selectIsLoading));
  }

  get error$(): Observable<Error | any> {
    return this.store.pipe(select(selectErrorStatus));
  }

  get chosenCategory$(): Observable<string> {
    return this.store.pipe(select(selectChosenCategory));
  }

  get categoryState$(): Observable<boolean> {
    return this.store.pipe(select(selectCategoryState));
  }

  get chosenCategoryCases$(): Observable<any[]> {
    return this.store.pipe(select(selectChosenCategoryCases));
  }

  LoadCategories(isVideo: boolean): void {
    this.store.dispatch(categoryActions.LoadCategories({ isVideo }));
  }

  switchCategories(isVideo: boolean): void {
    this.store.dispatch(categoryActions.SwitchCategories({ isVideo }));
  }

  chooseCategory(chosenCategory: string, isVideo?: boolean): void {
    this.store.dispatch(
      categoryActions.ChooseCategory({ chosenCategory, isVideo })
    );
  }

  chooseVideo(chosenVideo: string, category: string): void {
    this.store.dispatch(categoryActions.ChooseVideo({ chosenVideo, category }));
  }

  choosePhoto(chosenPhoto: string, category: string): void {
    this.store.dispatch(categoryActions.ChoosePhoto({ chosenPhoto, category }));
  }

  deleteData(): void {
    this.store.dispatch(categoryActions.DeleteData());
  }
}
