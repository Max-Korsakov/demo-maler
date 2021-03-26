import { StoreModule } from '@ngrx/store';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { EffectsModule } from '@ngrx/effects';

import { PHOTO_VIEWER_STATE } from './photo-viewer.selectors';
import { reducer } from './photo-viewer.reducer';
import { PhotoViewerEffects } from './photo-viewer.effects';

@NgModule({
    imports: [
        CommonModule,
        StoreModule.forFeature(PHOTO_VIEWER_STATE, reducer),
        EffectsModule.forFeature([PhotoViewerEffects]),
    ],
    providers: [PhotoViewerEffects],
})
export class PhotoViewerStoreModule {}