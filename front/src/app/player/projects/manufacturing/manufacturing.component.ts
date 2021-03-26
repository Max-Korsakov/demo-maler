import { Component, OnInit, OnDestroy } from "@angular/core";
import { VideoViewerFacade } from "../../../../@store/video-viewer/video-viewer.facade";
import { RouterFacade } from "../../../../@store/router/router.facade";

@Component({
  selector: "app-manufacturing",
  templateUrl: "./manufacturing.component.html",
  styleUrls: ["./manufacturing.component.scss"]
})
export class ManufacturingComponent implements OnInit, OnDestroy {
  public recognitionData;
  public datasetFrameElement;
  public currentFrameView = 1;
  public subscriptionPool = [];
  public videoTitle;

  constructor(
    private VideoViewerFacade: VideoViewerFacade,
    private routerFacade: RouterFacade
  ) {}

  ngOnInit() {
    const routerState = this.routerFacade.routeState$.subscribe(routerData => {
      const routeInfo = routerData.state.url.split("/");
      this.videoTitle = routeInfo[routeInfo.length - 1];
    });
    this.subscriptionPool.push(routerState);
    const category = "RotaryPrint";
    this.VideoViewerFacade.loadVideo(this.videoTitle, category);
    this.VideoViewerFacade.loadStandardData();
    const videoData = this.VideoViewerFacade.videoData$.subscribe(data => {
      if (data.length > 0) {
        this.recognitionData = data;
        this.datasetFrameElement = this.recognitionData[
          this.currentFrameView - 1
        ];
      }
    });
    this.subscriptionPool.push(videoData);

    const frame = this.VideoViewerFacade.currentFrame$.subscribe(
      frameNumber => {
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

  ngOnDestroy() {
    this.subscriptionPool.forEach(sub => sub.unsubscribe());
    this.VideoViewerFacade.deleteStateData();
  }
}
