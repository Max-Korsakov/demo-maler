import { Injectable } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { Observable } from 'rxjs';

import { RouterState } from './router.state';
import { selectRouterState } from './router.selectors';

@Injectable({ providedIn: 'root' })
export class RouterFacade {
    constructor(private store: Store<RouterState>) {}

    get routeState$(): Observable<any> {
        return this.store.pipe(select(selectRouterState));
    }

    // go(routerObject: any): void {
    //     this.store.dispatch(new RouterActions.Go(routerObject));
    // }

    // back(): void {
    //     this.store.dispatch(new RouterActions.Back());
    // }

    // forward(): void {
    //     this.store.dispatch(new RouterActions.Forward());
    // }
}
