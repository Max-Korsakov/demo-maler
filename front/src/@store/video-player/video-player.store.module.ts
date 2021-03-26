import { StoreModule } from '@ngrx/store';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import {  PLAYER_STATE } from './video-player.selectors';
import { reducer } from './video-player.reducer';


@NgModule({
    imports: [
        CommonModule,
        StoreModule.forFeature(PLAYER_STATE, reducer),

    ]
})
export class VideoPlayerStoreModule {}