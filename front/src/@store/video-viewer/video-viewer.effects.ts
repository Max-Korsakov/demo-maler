import { Injectable } from '@angular/core';
import { Actions, ofType, createEffect } from '@ngrx/effects';
import { Observable, of } from 'rxjs';
import { Action } from '@ngrx/store';
import { HttpErrorResponse } from '@angular/common/http';
import { catchError, map, take, switchMap } from 'rxjs/operators';

import * as videoViewerActions from './video-viewer.actions';
import * as routerActions from '../router/router.actions';
import { HttpService } from '../../app/services/http.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable()
export class VideoViewerEffects {
  constructor(
    private actions$: Actions,
    private httpService: HttpService,
    private snackBar: MatSnackBar
  ) {}

  public goToPlayerPage$: Observable<Action> = createEffect(() =>
    this.actions$.pipe(
      ofType(videoViewerActions.LoadVideo),
      map(payload => {
        const chosenVideo = payload.chosenVideo;
        const category = payload.category;
        if (category) {
          return new routerActions.RouterGo({
            path: [`/player/${category}`, chosenVideo],
            queryParams: {},
            extras: { replaceUrl: false }
          });
        }
      })
    )
  );

  public saveStandardData$: Observable<Action> = createEffect(() =>
    this.actions$.pipe(
      ofType(videoViewerActions.SaveStandardData),
      switchMap(payload => {
        return this.httpService
          .saveStandardData(payload.category, payload.data)
          .pipe(
            map(standardData => {
              this.snackBar.open('Data saved', null, {
                duration: 2000,
                horizontalPosition: 'left'
              });
              return videoViewerActions.SaveStandardDataSuccess({
                standardData
              });
            }),
            catchError((err: HttpErrorResponse) =>
              of(videoViewerActions.SaveStandardDataError({ error: err }))
            )
          );
      })
    )
  );

  public saveStandardDataSuccess$: Observable<Action> = createEffect(() =>
    this.actions$.pipe(
      ofType(videoViewerActions.SaveStandardDataSuccess),
      switchMap(payload => {
        return this.httpService.loadStandardData().pipe(
          map(standardData => {
            return videoViewerActions.LoadStandardDataSuccess({ standardData });
          }),
          catchError((err: HttpErrorResponse) =>
            of(videoViewerActions.LoadStandardDataError({ error: err }))
          )
        );
      })
    )
  );

  public loadStandardData$: Observable<Action> = createEffect(() =>
    this.actions$.pipe(
      ofType(videoViewerActions.LoadStandardData),
      switchMap(payload => {
        return this.httpService.loadStandardData().pipe(
          map(standardData => {
            return videoViewerActions.LoadStandardDataSuccess({ standardData });
          }),
          catchError((err: HttpErrorResponse) =>
            of(videoViewerActions.LoadStandardDataError({ error: err }))
          )
        );
      })
    )
  );

  public loadCorrectionData$: Observable<Action> = createEffect(() =>
    this.actions$.pipe(
      ofType(videoViewerActions.LoadStandardData),
      switchMap(payload => {
        return this.httpService.loadCorrectionData().pipe(
          map(correctionData => {
            return videoViewerActions.LoadCorrectionDataSuccess({
              correctionData
            });
          }),
          catchError((err: HttpErrorResponse) =>
            of(videoViewerActions.LoadCorrectionDataError({ error: err }))
          )
        );
      })
    )
  );

  public loadDataWithVideo$: Observable<Action> = createEffect(() =>
    this.actions$.pipe(
      ofType(videoViewerActions.LoadVideo),
      switchMap(action => {
        return this.httpService
          .getBindingVideoData(action.category, action.chosenVideo)
          .pipe(
            map(data => {
              return videoViewerActions.LoadDataSuccess({ data });
            }),
            catchError((err: HttpErrorResponse) =>
              of(videoViewerActions.LoadDataError({ error: err }))
            ),
            take(1)
          );
      })
    )
  );
}
