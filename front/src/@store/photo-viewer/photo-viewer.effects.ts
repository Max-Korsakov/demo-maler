import { Injectable } from '@angular/core';
import { Actions, ofType, createEffect } from '@ngrx/effects';
import { Observable, of } from 'rxjs';
import { Action } from '@ngrx/store';
import { HttpErrorResponse } from '@angular/common/http';
import {
  catchError,
  map,
  take,
  switchMap,
  withLatestFrom,
  filter
} from 'rxjs/operators';

import * as photoViewerActions from './photo-viewer.actions';
import * as videoCategoryActions from '../categories/categories.actions';
import * as routerActions from '../router/router.actions';
import { HttpService } from '../../app/services/http.service';
import { RouterFacade } from '../router/router.facade';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ConnectedPositionStrategy } from '@angular/cdk/overlay';

@Injectable()
export class PhotoViewerEffects {
  constructor(
    private actions$: Actions,
    private httpService: HttpService,
    private snackBar: MatSnackBar
  ) {}

  public goToPlayerPage$: Observable<Action> = createEffect(() =>
    this.actions$.pipe(
      ofType(photoViewerActions.LoadPhoto),
      map(payload => {
        const chosenCase = payload.chosenCase;
        const category = payload.project;
        return new routerActions.RouterGo({
          path: [`/photoviewer/${category}`, chosenCase],
          queryParams: {},
          extras: { replaceUrl: false }
        });
      })
    )
  );

    public loadDataWithPhoto$: Observable<Action> = createEffect(() =>
      this.actions$.pipe(
        ofType(photoViewerActions.LoadData),
        switchMap(action => {
          const project = action.project;
          const caseName = action.chosenCase;
          return this.httpService.getBindingPhotoData(project, caseName).pipe(
            map(data => {
              return photoViewerActions.LoadDataSuccess({ data });
            }),
            catchError((err: HttpErrorResponse) =>
              of(photoViewerActions.LoadDataError({ error: err }))
            ),
            take(1)
          );
        })
      )
    );
}
