import { Component, OnInit, OnDestroy } from '@angular/core';
import { VideoViewerFacade } from '../../../../@store/video-viewer/video-viewer.facade';
import { RouterFacade } from '../../../../@store/router/router.facade';

@Component({
  selector: 'app-online-exam',
  templateUrl: './online-exam.component.html',
  styleUrls: ['./online-exam.component.scss'],
})
export class OnlineExamComponent implements OnInit, OnDestroy {
  public recognitionData;
  public datasetFrameElement;
  public currentFrameView = 1;
  public subscriptionPool = [];
  public videoTitle;
  public category;
  public modemPhoto: string;
  public backgroundColor: string;

  constructor(
    private videoViewerFacade: VideoViewerFacade,
    private routerFacade: RouterFacade
  ) {}

  ngOnInit(): void {
    const routerState = this.routerFacade.routeState$.subscribe(
      (routerData) => {
        const routeInfo = routerData.state.url.split('/');
        this.videoTitle = routeInfo[routeInfo.length - 1];
      }
    );
    this.subscriptionPool.push(routerState);

    const videoData = this.videoViewerFacade.videoData$.subscribe((data) => {
      if (data.length > 0) {
        this.recognitionData = data;
        this.datasetFrameElement = this.recognitionData[
          this.currentFrameView - 1
        ];
        if (
          this.datasetFrameElement && this.datasetFrameElement.last_1sec_data[0].background_color
        ) {
          this.backgroundColor = this.datasetFrameElement.last_1sec_data[0].background_color.toString();
          this.backgroundColor = 'rgb ' + '(' + this.backgroundColor + ')';
        }
      }
    });
    this.subscriptionPool.push(videoData);

    const frame = this.videoViewerFacade.currentFrame$.subscribe(
      (frameNumber) => {
        this.currentFrameView = frameNumber;
        if (this.recognitionData) {
          this.datasetFrameElement = this.recognitionData[
            this.currentFrameView - 1
          ];
        }
      }
    );
    this.subscriptionPool.push(frame);
  }

  changeBackground(i): any {
    this.backgroundColor = this.datasetFrameElement.last_1sec_data[i].background_color.toString();
    this.backgroundColor = 'rgb' + '(' + this.backgroundColor + ')';
    return { 'background-color': this.backgroundColor };
}

  ngOnDestroy(): void {
    this.subscriptionPool.forEach((sub) => sub.unsubscribe());
    this.videoViewerFacade.deleteStateData();
  }
}
