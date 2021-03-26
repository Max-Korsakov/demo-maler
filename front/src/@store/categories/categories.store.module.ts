import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { EffectsModule } from "@ngrx/effects";
import { StoreModule } from "@ngrx/store";

import { CATEGORIES_STATE } from "./categories.selectors";
import { reducer } from "./categories.reducer";
import { CategoriesEffects } from "./categories.effects";

@NgModule({
  imports: [
    CommonModule,
    StoreModule.forFeature(CATEGORIES_STATE, reducer),
    EffectsModule.forFeature([CategoriesEffects])
  ],
  providers: [CategoriesEffects]
})
export class CategoriesStoreModule {}
