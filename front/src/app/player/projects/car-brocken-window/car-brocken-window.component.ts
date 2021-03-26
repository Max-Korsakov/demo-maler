import { Component, OnInit, OnDestroy } from "@angular/core";
import { VideoViewerFacade } from "../../../../@store/video-viewer/video-viewer.facade";
import { RouterFacade } from "../../../../@store/router/router.facade";
import { Subscription } from "rxjs";

@Component({
  selector: "app-car-brocken-window",
  templateUrl: "./car-brocken-window.component.html",
  styleUrls: ["./car-brocken-window.component.scss"],
})
export class CarBrockenWindowComponent implements OnInit, OnDestroy {
  public recognitionData: any[];
  public datasetFrameElement: any[];
  public currentFrameView = 1;
  public subscriptionPool: Subscription[] = [];
  public videoTitle: string;

  constructor(
    private videoViewerFacade: VideoViewerFacade,
    private routerFacade: RouterFacade
  ) {}

  ngOnInit() {
    const routerState = this.routerFacade.routeState$.subscribe(
      (routerData) => {
        const routeInfo = routerData.state.url.split("/");
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
        console.log(this.datasetFrameElement);
      }
    );
    this.subscriptionPool.push(frame);
  }

  changeBackground(): any {
    if (this.datasetFrameElement) {
      let backgroundColor = this.datasetFrameElement[
        "Broken Window"
      ].background_color.toString();
      backgroundColor = "rgb" + "(" + backgroundColor + ")";
      return { "background-color": backgroundColor };
    } else {
      return { "background-color": "white" };
    }
  }

  ngOnDestroy() {
    this.subscriptionPool.forEach((sub) => sub.unsubscribe());
    this.videoViewerFacade.deleteStateData();
  }
}
