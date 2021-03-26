import { Injectable } from '@angular/core';
import { Actions, ofType, createEffect } from '@ngrx/effects';
import { Observable, of } from 'rxjs';
import { Action } from '@ngrx/store';
import { HttpErrorResponse } from '@angular/common/http';
import { catchError, map, switchMap, withLatestFrom } from 'rxjs/operators';

import * as categoriesActions from './categories.actions';
import * as playerActions from '../video-viewer/video-viewer.actions';
import * as photoViewerActions from '../photo-viewer/photo-viewer.actions';
import { HttpService } from '../../app/services/http.service';
import { RouterFacade } from '../router/router.facade';

@Injectable()
export class CategoriesEffects {
  constructor(
    private actions$: Actions,
    private httpService: HttpService,
    private routerFacade: RouterFacade
  ) {}

  public loadCategories$: Observable<Action> = createEffect(() =>
    this.actions$.pipe(
      ofType(categoriesActions.LoadCategories),
      switchMap(action => {
        return this.httpService.getCategories(action.isVideo).pipe(
          map(categories => {
            return categoriesActions.LoadCategoriesSuccess({
              categories
            });
          }),
          catchError((err: HttpErrorResponse) =>
            of(categoriesActions.LoadCategoriesError({ error: err }))
          )
        );
      })
    )
  );

  public chooseCategoryCases$: Observable<Action> = createEffect(() =>
    this.actions$.pipe(
      ofType(categoriesActions.ChooseCategory),
      switchMap(action => {
        return this.httpService.getCasesInCategory(action).pipe(
          map(chosenCategoryCases => {
            return categoriesActions.LoadCategoryCasesSuccess({
              chosenCategoryCases
            });
          }),
          catchError((err: HttpErrorResponse) =>
            of(categoriesActions.LoadCategoryCasesError({ error: err }))
          )
        );
      })
    )
  );

  public chooseVideo$: Observable<Action> = createEffect(() =>
    this.actions$.pipe(
      ofType(categoriesActions.ChooseVideo),
      withLatestFrom(this.routerFacade.routeState$),
      map(payload => {
        const category = payload[0].category;
        const chosenVideo = payload[0].chosenVideo;
        return playerActions.LoadVideo({ chosenVideo, category });
      })
    )
  );

  public choosePhoto$: Observable<Action> = createEffect(() =>
    this.actions$.pipe(
      ofType(categoriesActions.ChoosePhoto),
      withLatestFrom(this.routerFacade.routeState$),
      map(payload => {
        const photo = 'null';
        const project = payload[0].category;
        const chosenCase = payload[0].chosenPhoto;
        return photoViewerActions.LoadPhoto({ chosenCase, project, photo });
      })
    )
  );
}
