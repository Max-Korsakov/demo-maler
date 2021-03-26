import {
  BrowserModule,
  HAMMER_GESTURE_CONFIG,
} from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { StoreRouterConnectingModule, routerReducer } from '@ngrx/router-store';
import { ReactiveFormsModule } from '@angular/forms';

import { RangeInformationComponent } from './correction-information/range-information/range-information.component';
import { EditedInformationComponent } from './correction-information/edited-information/edited-information.component';
import { VideoScreenshotComponent } from './correction-information/video-screenshot/video-screenshot.component';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatSelectModule } from '@angular/material/select';
import { PlayerComponent } from './player/player-page/player.component';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule } from '@angular/material/dialog';
import { SettingsDialogComponent } from './dialog-components/settings-dialog/settings-dialog.component';
import { MatSliderModule } from '@angular/material/slider';
import { ParkingComponent } from './player/projects/parking/parking.component';
import { HttpClientModule } from '@angular/common/http';
// import { HammerGestureConfig } from '@angular/material/platform-browser';
import { RoadComponent } from './player/projects/road/road.component';
import { DemoMakerRoutingModule } from './app.routing.module';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { OverlayModule } from '@angular/cdk/overlay';
import { PortalModule } from '@angular/cdk/portal';
import { WidgetComponent } from './hoc/widget/widget.component';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { CorrectionInformationComponent } from './correction-information/correction-information.component';
import { LandingPageComponent } from './landing-page/landing-page.component';
import { CategoriesStoreModule } from '../@store/categories/categories.store.module';
import { RouterEffects } from '../@store/router/router.effects';
import { VideoViewerEffects } from '../@store/video-viewer/video-viewer.effects';
import { VideoViewerStoreModule } from '../@store/video-viewer/video-viewer.store.module';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { ConfirmationDialogComponent } from './dialog-components/confirmation-dialog/confirmation-dialog.component';
import { ConstructorComponent } from './player/projects/parking/constructor/constructor.component';
import { AccessorAddDialogComponent } from './dialog-components/accessor-add-dialog/accessor-add-dialog.component';
import { ParseElementComponent } from './player/projects/parking/constructor/parse-element/parse-element.component';
import { ComparisonComponent } from './player/projects/road/comparison/comparison.component';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { CoworkingComponent } from './player/projects/coworking/coworking.component';
import { ChartComponent } from './dinamicComponents/chart/chart.component';
import { ActorsComponent } from './player/projects/actors/actors.component';
import { FaceComponent } from './player/projects/face/face.component';
import { VideoComponent } from './landing-page/video/video.component';
import { PhotoComponent } from './landing-page/photo/photo.component';
import { PhotoViewerComponent } from './photo-viewer/photo-viewer.component';
import { PhotoViewerStoreModule } from '../@store/photo-viewer/photo-viewer.store.module';
import { PhotoViewerEffects } from '../@store/photo-viewer/photo-viewer.effects';
import { PhotoConstructorComponent } from './photo-viewer/photo-constructor/photo-constructor.component';
import { NewPhotoDialogComponent } from './dialog-components/new-photo-dialog/new-photo-dialog.component';
import { ManufacturingComponent } from './player/projects/manufacturing/manufacturing.component';
import { ReceiptComponent } from './photo-viewer/projects/receipt/receipt.component';
import { OilWellComponent } from './player/projects/oil-well/oil-well.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ParkingPenskeComponent } from './player/projects/parking-penske/parking-penske.component';
import { DoorsComponent } from './photo-viewer/projects/doors/doors.component';
import { CaseCardComponent } from './landing-page/case-card/case-card.component';
import { PlayerViewComponent } from './player/player-view/player-view.component';
import { PlayerControlsComponent } from './player/player-controls/player-controls.component';
import { VideoPlayerStoreModule } from '../@store/video-player/video-player.store.module';
import { PhotoControlsComponent } from './photo-viewer/photo-controls/photo-controls.component';
import { ModemsComponent } from './player/projects/modems/modems.component';
import { OnlineExamComponent } from './player/projects/online-exam/online-exam.component';
import { HealthComponent } from './health/health.component';
import { MaskFaceComponent } from './player/projects/mask-face/mask-face.component';
import { AcnesComponent } from './player/projects/acnes/acnes.component';
import { CarBrockenWindowComponent } from './player/projects/car-brocken-window/car-brocken-window.component';

import { NeoToolbarModule } from '@neomorphism/ng-neomorphism/neo-toolbar';
import { NeoCardModule } from '@neomorphism/ng-neomorphism/neo-card';
import { NeoButtonModule } from '@neomorphism/ng-neomorphism/neo-button';
import { NeoFormFieldModule } from '@neomorphism/ng-neomorphism/neo-form-field';
import { NeoInputModule } from '@neomorphism/ng-neomorphism/neo-input';
import { NeoProgressBarModule } from '@neomorphism/ng-neomorphism/neo-progressbar';
import { NeoSlideToggleModule } from '@neomorphism/ng-neomorphism/neo-slide-toggle';
import { NeoCheckboxModule } from '@neomorphism/ng-neomorphism/neo-checkbox';
import { NeoDialogModule } from '@neomorphism/ng-neomorphism/neo-dialog';
import { NeoSliderModule }from '@neomorphism/ng-neomorphism/neo-slider' 
@NgModule({
  declarations: [
    AppComponent,
    PlayerComponent,
    SettingsDialogComponent,
    ParkingComponent,
    RoadComponent,
    WidgetComponent,
    CorrectionInformationComponent,
    LandingPageComponent,
    RangeInformationComponent,
    EditedInformationComponent,
    VideoScreenshotComponent,
    ConfirmationDialogComponent,
    ConstructorComponent,
    AccessorAddDialogComponent,
    ParseElementComponent,
    ComparisonComponent,
    CoworkingComponent,
    ChartComponent,
    ActorsComponent,
    FaceComponent,
    VideoComponent,
    PhotoComponent,
    PhotoViewerComponent,
    PhotoConstructorComponent,
    NewPhotoDialogComponent,
    ManufacturingComponent,
    ReceiptComponent,
    OilWellComponent,
    ParkingPenskeComponent,
    DoorsComponent,
    CaseCardComponent,
    PlayerViewComponent,
    PlayerControlsComponent,
    PhotoControlsComponent,
    ModemsComponent,
    OnlineExamComponent,
    HealthComponent,
    MaskFaceComponent,
    AcnesComponent,
    CarBrockenWindowComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    MatCardModule,
    MatSelectModule,
    MatButtonModule,
    MatDividerModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    MatIconModule,
    MatDialogModule,
    MatProgressSpinnerModule,
    MatSliderModule,
    HttpClientModule,
    DemoMakerRoutingModule,
    MatCheckboxModule,
    OverlayModule,
    PortalModule,
    DragDropModule,
    MatTooltipModule,
    StoreModule.forRoot({ router: routerReducer }),
    StoreRouterConnectingModule.forRoot(),
    EffectsModule.forRoot([
      RouterEffects,
      VideoViewerEffects,
      PhotoViewerEffects,
    ]),
    EffectsModule.forFeature([
      RouterEffects,
      VideoViewerEffects,
      PhotoViewerEffects,
    ]),
    CategoriesStoreModule,
    VideoViewerStoreModule,
    VideoPlayerStoreModule,
    PhotoViewerStoreModule,
    MatSlideToggleModule,
    ReactiveFormsModule,
    MatSnackBarModule,

    NeoToolbarModule,
    NeoCardModule,
    NeoButtonModule,
    NeoFormFieldModule,
    NeoInputModule,
    NeoProgressBarModule,
    NeoSlideToggleModule,
    NeoCheckboxModule,
    NeoDialogModule,
    NeoSliderModule
  ],
  // providers: [{ provide: HAMMER_GESTURE_CONFIG, useClass: GestureConfig }],
  entryComponents: [
    SettingsDialogComponent,
    WidgetComponent,
    ConfirmationDialogComponent,
    AccessorAddDialogComponent,
    ChartComponent,
    NewPhotoDialogComponent,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
