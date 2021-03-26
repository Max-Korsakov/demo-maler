import { createFeatureSelector } from '@ngrx/store';
import { RouterReducerState } from '@ngrx/router-store';

export const ROUTER_STATE = 'router';
export const selectRouterState = createFeatureSelector<RouterReducerState>(ROUTER_STATE);
