import { StoreModule } from '@ngrx/store';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { EffectsModule } from '@ngrx/effects';

import { VIDEO_VIEWER } from './video-viewer.selectors';
import { reducer } from './video-viewer.reducer';
import { VideoViewerEffects } from './video-viewer.effects';

@NgModule({
    imports: [
        CommonModule,
        StoreModule.forFeature(VIDEO_VIEWER, reducer),
        EffectsModule.forFeature([VideoViewerEffects]),
    ],
    providers: [VideoViewerEffects],
})
export class VideoViewerStoreModule {}
