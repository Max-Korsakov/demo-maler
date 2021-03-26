import { Component, OnInit, OnDestroy } from '@angular/core';
import { VideoViewerFacade } from '../../../../@store/video-viewer/video-viewer.facade';
import { RouterFacade } from '../../../../@store/router/router.facade';


@Component({
  selector: 'app-modems',
  templateUrl: './modems.component.html',
  styleUrls: ['./modems.component.scss']
})
export class ModemsComponent implements OnInit, OnDestroy {

  public recognitionData;
  public datasetFrameElement;
  public currentFrameView = 1;
  public subscriptionPool = [];
  public videoTitle;
  public category;
  public modemPhoto: string;

  constructor(
    private videoViewerFacade: VideoViewerFacade,
    private routerFacade: RouterFacade
  ) {}

  ngOnInit(): void {
    const routerState = this.routerFacade.routeState$.subscribe(routerData => {
      const routeInfo = routerData.state.url.split('/');
      this.videoTitle = routeInfo[routeInfo.length - 1];
    });
    this.subscriptionPool.push(routerState);

    const videoData = this.videoViewerFacade.videoData$.subscribe(data => {
      if (data.length > 0) {
        this.recognitionData = data;
        this.datasetFrameElement = this.recognitionData[
          this.currentFrameView - 1
        ];
        this.setPhotoAdress();
      }
    });
    this.subscriptionPool.push(videoData);

    const frame = this.videoViewerFacade.currentFrame$.subscribe(
      frameNumber => {
        this.currentFrameView = frameNumber;
        if (this.recognitionData) {
          this.datasetFrameElement = this.recognitionData[
            this.currentFrameView - 1
          ];
          this.setPhotoAdress();
        }
      }
    );
    this.subscriptionPool.push(frame);
  }

  setPhotoAdress() {
    if (this.datasetFrameElement && this.datasetFrameElement.model) {
      this.modemPhoto = `../../../../assets/examples_nl/${this.datasetFrameElement.model}.jpg`;
    }
  }

  ngOnDestroy(): void {
    this.subscriptionPool.forEach(sub => sub.unsubscribe());
    this.videoViewerFacade.deleteStateData();
  }
}
