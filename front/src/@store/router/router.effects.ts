import { Injectable } from '@angular/core';
import { Router, ActivationEnd } from '@angular/router';
import { Location } from '@angular/common';
import { tap, map, filter } from 'rxjs/operators';
import { Actions, ofType, Effect } from '@ngrx/effects';

import { Store } from '@ngrx/store';

import { RouteChange, RouterGo } from './router.actions';

@Injectable()
export class RouterEffects {
    constructor(
        private actions$: Actions,
        private router: Router,
        private location: Location,
        private store: Store<any>
    ) {
        this.listenToRouter();
    }

    @Effect({ dispatch: false })
    navigate$ = this.actions$.pipe(
        ofType('[Router] Go'),
        map((action: RouterGo) => action.payload),
        tap(({ path, queryParams, extras }) => this.router.navigate(path, { queryParams, ...extras }))
    );

    @Effect({ dispatch: false })
    navigateBack$ = this.actions$.pipe(
        ofType('[Router] Back'),
        tap(
            () => this.location.back())
    );

    @Effect({ dispatch: false })
    navigateForward$ = this.actions$.pipe(
        ofType('[Router] Forward'),
        tap(() => this.location.forward())
    );

    // @Effect({ dispatch: false })
    // routeChange$ = this.actions$.pipe(
    //   ofType('[Router] Route Change'),
    //   map((action: RouteChange) => action.payload),
    //   tap(({ params, path }) => {})
    // );

    private listenToRouter() {
        this.router.events.pipe(filter(event => event instanceof ActivationEnd)).subscribe((event: ActivationEnd) =>
            this.store.dispatch(
                new RouteChange({
                    params: { ...event.snapshot.params },
                    path: event.snapshot.routeConfig.path,
                })
            )
        );
    }
}