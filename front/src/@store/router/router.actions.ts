import { Action } from '@ngrx/store';
import { NavigationExtras } from '@angular/router';

export const ROUTE_GO = '[Router] Go';
export const ROUTE_CHANGE = '[Router] Route Change';
export const ROUTE_BACK = '[Router] Back';
export const ROUTE_FORWARD = '[Router] Forward';

export class RouterGo implements Action {
    readonly type = ROUTE_GO;

    constructor(
        public payload: {
            path: any[];
            queryParams?: object;
            extras?: NavigationExtras;
        }
    ) {}
}

export class RouterBack implements Action {
    readonly type = ROUTE_BACK;
}

export class RouterForward implements Action {
    readonly type = ROUTE_FORWARD;
}

export class RouteChange implements Action {
    readonly type = ROUTE_CHANGE;

    constructor(public payload: { params: any; path: string }) {}
}
