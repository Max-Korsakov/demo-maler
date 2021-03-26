import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { PlayerComponent } from './player/player-page/player.component';
import { RoadComponent } from './player/projects/road/road.component';
import { LandingPageComponent } from './landing-page/landing-page.component';
import { ConstructorComponent } from './player/projects/parking/constructor/constructor.component';
import { ParkingComponent } from './player/projects/parking/parking.component';
import { ActorsComponent } from './player/projects/actors/actors.component';
import { FaceComponent } from './player/projects/face/face.component';
import { PhotoViewerComponent } from './photo-viewer/photo-viewer.component';
import { PhotoConstructorComponent } from './photo-viewer/photo-constructor/photo-constructor.component';
import { ManufacturingComponent } from './player/projects/manufacturing/manufacturing.component';
import { ReceiptComponent } from './photo-viewer/projects/receipt/receipt.component';
import { OilWellComponent } from './player/projects/oil-well/oil-well.component';
import { ParkingPenskeComponent } from './player/projects/parking-penske/parking-penske.component';
import { DoorsComponent } from './photo-viewer/projects/doors/doors.component';
import { ModemsComponent} from './player/projects/modems/modems.component';
import { OnlineExamComponent } from './player/projects/online-exam/online-exam.component';
import { HealthComponent } from './health/health.component';
import {MaskFaceComponent } from './player/projects/mask-face/mask-face.component';
import { AcnesComponent } from './player/projects/acnes/acnes.component';
import { CarBrockenWindowComponent } from './player/projects/car-brocken-window/car-brocken-window.component';

const routes: Routes = [
  {
    path: '',
    component: LandingPageComponent
  },
  {
    path: 'player',
    component: PlayerComponent,
    children: [
      { path: 'Traffic/:videoId', component: RoadComponent },
      { path: 'Parking/:videoId', component: ParkingComponent },
      { path: 'SteelRolls/:videoId', component: ConstructorComponent },
      { path: 'CatsBalloons/:videoId', component: ConstructorComponent },
      { path: 'Coworking/:videoId', component: ConstructorComponent },
      { path: 'Actors/:videoId', component: ActorsComponent },
      { path: 'ActorsTwo/:videoId', component: ActorsComponent },
      { path: 'FaceVideo/:videoId', component: FaceComponent },
      { path: 'RotaryPrint/:videoId', component: ManufacturingComponent },
      { path: 'OilWell/:videoId', component: OilWellComponent },
      { path: 'PenskeTruckId/:videoId', component: ParkingPenskeComponent },
      { path: 'Modems/:videoId', component: ModemsComponent },
      { path: 'OnlineExam/:videoId', component: OnlineExamComponent },
      { path: 'FaceMask/:videoId', component: MaskFaceComponent },
      { path: 'Cosmetics/:videoId', component: AcnesComponent },
      { path: 'CarBrokenWindow/:videoId', component: CarBrockenWindowComponent },
      { path: '**', component: ConstructorComponent }
    ]
  },

  {
    path: 'photoviewer',
    component: PhotoViewerComponent,
    children: [
      { path: 'MallReceipts/MallReceipts', component: ReceiptComponent },
      { path: 'HousingProducts/:id', component: DoorsComponent },
      { path: '**', component: PhotoConstructorComponent }
    ]
  },
  {
    path: 'health',
    component: HealthComponent
  },
  {
    path: '**',
    component: LandingPageComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class DemoMakerRoutingModule {}
