import {
  Component,
  OnInit,
  OnDestroy
} from '@angular/core';
import { VideoViewerFacade } from '../../../../@store/video-viewer/video-viewer.facade';
import { RouterFacade } from '../../../../@store/router/router.facade';
import { Subscription } from 'rxjs';





@Component({
  selector: 'app-parking',
  templateUrl: './parking.component.html',
  styleUrls: ['./parking.component.scss']
})
export class ParkingComponent implements OnInit, OnDestroy {
  constructor(
    private playerFacade: VideoViewerFacade,
    private routerFacade: RouterFacade,
    ) {
    }

    public currentFrameView = 1;
    public dataFromModel;
    public datasetFrameElement;
    public currentFrameInformation;
    public parkLotData = [] ;
    public videoTitle: string;
    public currentFrameTableIndex = 1;
    public currentTime: number;
    private subs: Subscription;

  ngOnInit() {
    this.subs = new Subscription();
    this.subs.add(
      this.routerFacade.routeState$.subscribe(routerData => {
        const routeInfo = routerData.state.url.split('/');
        this.videoTitle = routeInfo[routeInfo.length - 1];
      })
    );
    this.playerFacade.loadVideo(this.videoTitle, 'Parking');

    this.subs.add(
      this.playerFacade.currentTime$.subscribe((currentFrame: number) => {
        this.currentTime = currentFrame;
      })
    );

    this.subs.add(
      this.playerFacade.videoData$.subscribe((data) => {
        this.dataFromModel = this.deepCopy(data);
        if (data && data.length > 0) {
          this.datasetFrameElement = this.dataFromModel[
            this.currentFrameView - 1
          ];
        }
      })
    );

    this.subs.add(
      this.playerFacade.currentFrame$.subscribe((currentFrame: number) => {
        if (currentFrame) {
          this.currentFrameView = currentFrame;
          if (this.dataFromModel.length > 0 && this.currentFrameView > 0) {
            this.datasetFrameElement = this.dataFromModel[
              this.currentFrameView - 1
            ];
          }
        }
      })
    );
  }

  private deepCopy(object: any): any {
    if (object) {
      return JSON.parse(JSON.stringify(object));
    }
  }

  ngOnDestroy() {
    this.subs.unsubscribe();
    this.playerFacade.deleteStateData();
  }

}
