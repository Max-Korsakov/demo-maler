import { Component, OnInit, AfterViewInit, OnDestroy } from "@angular/core";
import { Subscription } from "rxjs";
import { VideoViewerFacade } from "../../../../@store/video-viewer/video-viewer.facade";
import { RouterFacade } from "../../../../@store/router/router.facade";

declare var Plotly: any;

@Component({
  selector: "app-oil-well",
  templateUrl: "./oil-well.component.html",
  styleUrls: ["./oil-well.component.scss"]
})
export class OilWellComponent implements OnInit, AfterViewInit, OnDestroy {
  public timeData = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
  public peopleAmountData = [];
  public last2People = [];
  public dataFromModel;
  public currentTime;
  public subs: Subscription;
  public currentFrameView = 1;
  public totalFrameAmmount;
  public datasetFrameElement;
  public videoTitle;
  public category;
  constructor(
    private VideoViewerFacade: VideoViewerFacade,
    private routerFacade: RouterFacade
  ) {}

  ngOnInit() {
    this.subs = new Subscription();

    const routerState = this.routerFacade.routeState$.subscribe(routerData => {
      const routeInfo = routerData.state.url.split("/");
      this.videoTitle = routeInfo[routeInfo.length - 1];
      this.category = routeInfo[routeInfo.length - 2];
    });
    this.VideoViewerFacade.loadVideo(this.category, this.videoTitle);

    this.subs.add(
      this.VideoViewerFacade.currentTime$.subscribe((currentFrame: number) => {
        this.currentTime = currentFrame;
      })
    );

    this.subs.add(
      this.VideoViewerFacade.videoData$.subscribe(data => {
        this.dataFromModel = this.deepCopy(data);
        if (data && data.length > 0) {
          this.totalFrameAmmount = data.length;
          this.datasetFrameElement = this.dataFromModel[
            this.currentFrameView - 1
          ];
          this.recountTimeData();
          this.recountPeopleData();
          this.recountAveragePeopleData();
          this.viewChart();
        }
      })
    );

    this.subs.add(
      this.VideoViewerFacade.currentFrame$.subscribe((currentFrame: number) => {
        if (currentFrame) {
          this.currentFrameView = currentFrame;
          if (this.dataFromModel.length > 0 && this.currentFrameView > 0) {
            this.datasetFrameElement = this.dataFromModel[
              this.currentFrameView - 1
            ];
          }
          this.recountTimeData();
          this.recountPeopleData();
          this.recountAveragePeopleData();
          this.viewChart();
        }
      })
    );
  }

  ngAfterViewInit() {
    this.viewChart();
  }

  private deepCopy(object: any): any {
    if (object) {
      return JSON.parse(JSON.stringify(object));
    }
  }

  public viewChart() {
    const trace1 = {
      x: this.timeData,
      y: this.peopleAmountData,
      dx: 0.04,
      name: "Current",
      type: "scatter"
    };

    const trace2 = {
      x: this.timeData,
      y: this.last2People,
      dx: 0.04,
      name: "Average",
      type: "scatter"
    };

    const data = [trace1, trace2];

    const layout = {
      yaxis: {
        range: [0, 5],
        zeroline: true,
        showline: true,
        linecolor: "#636363",
        linewidth: 4
      }
    };

    Plotly.newPlot("data-chart", data, layout, { displayModeBar: false });
  }

  public recountTimeData() {
    for (let i = 0; i < 250; i++) {
      this.timeData[i] = this.currentTime + i * 0.04;
    }
  }

  public recountPeopleData() {
    for (let i = 0; i < 250; i++) {
      if (this.dataFromModel[this.currentFrameView - 1 + i]) {
        this.peopleAmountData[i] = this.dataFromModel[
          this.currentFrameView - 1 + i
        ].frame_people_count;
      } else {
        this.peopleAmountData[i] = null;
      }
    }
  }

  public recountAveragePeopleData() {
    for (let i = 0; i < 250; i++) {
      if (this.dataFromModel[this.currentFrameView - 1 + i]) {
        this.last2People[i] = this.dataFromModel[this.currentFrameView - 1 + i][
          "-+5sec_median_people_count"
        ];
      } else {
        this.last2People[i] = null;
      }
    }
  }

  ngOnDestroy() {
    this.subs.unsubscribe();
  }
}
