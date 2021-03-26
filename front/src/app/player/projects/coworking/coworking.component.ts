import {
  Component,
  OnInit,
  AfterViewInit,
  OnDestroy,
  ViewChild,
  ElementRef
} from "@angular/core";
import { VideoViewerFacade } from "../../../../@store/video-viewer/video-viewer.facade";
import { Subscription } from "rxjs";
import * as h337 from "../../../../libs/heatmap.js";

declare var Plotly: any;

@Component({
  selector: "app-coworking",
  templateUrl: "./coworking.component.html",
  styleUrls: ["./coworking.component.scss"]
})
export class CoworkingComponent implements OnInit, AfterViewInit, OnDestroy {
  public timeData = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
  public peopleAmountData = [];
  public last2People = [];
  public subs: Subscription;
  public currentTime: number;
  public dataFromModel: any;
  public datasetFrameElement: any;
  public currentFrameView: any;
  public roundedUpCeilCurrentTime = 0;
  public mapContainer: HTMLElement;
  public heatMapConfig;
  public heatmapInstance;
  public totalFrameAmmount: number;
  public placeOneFrames40 = 1;
  public placeOneFrames41 = 1;
  public placeOneFrames42 = 1;
  public placeOneFrames43 = 1;
  public cameraOn = true;

  constructor(private VideoViewerFacade: VideoViewerFacade) {}

  @ViewChild("mapContainer")
  heatMapContainer: ElementRef<HTMLElement>;

  ngOnInit() {
    this.subs = new Subscription();

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
          if (
            this.mapContainer &&
            this.currentFrameView % 10 === 0 &&
            this.cameraOn
          ) {
            this.calculatePlaceOccupancy();
            this.setHeatMapData();
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

  ngAfterViewInit() {
    this.viewChart();
    this.mapContainer = this.heatMapContainer.nativeElement;
    this.heatMapConfig = {
      container: this.mapContainer,
      radius: 60,
      maxOpacity: 0.9,
      minOpacity: 0,
      blur: 0.8,
      gradient: {
        // enter n keys between 0 and 1 here
        // for gradient color customization
        ".1": "grey",
        ".2": "#31859b",
        ".5": "yellow",
        ".7": "red"
      }
    };
    this.heatmapInstance = h337.create(this.heatMapConfig);
    this.setHeatMapData();
  }

  public setHeatMapData() {
    const dataPoint41 = {
      x: 385,
      y: 130,
      value: this.placeOneFrames41
    };

    const dataPoint42 = {
      x: 270,
      y: 130,
      value: this.placeOneFrames42
    };

    const dataPoint43 = {
      x: 270,
      y: 250,
      value: this.placeOneFrames43
    };

    const dataPoint40 = {
      x: 385,
      y: 250,
      value: this.placeOneFrames40
    };
    const data = {
      max: this.totalFrameAmmount,
      min: 0,
      data: [dataPoint41, dataPoint42, dataPoint43, dataPoint40]
    };
    this.heatmapInstance.setData(data);
  }

  public turnOffHeatMap() {
    const dataPoint41 = {
      x: 385,
      y: 130,
      value: 0
    };

    const dataPoint42 = {
      x: 270,
      y: 130,
      value: 0
    };

    const dataPoint43 = {
      x: 270,
      y: 250,
      value: 0
    };

    const dataPoint40 = {
      x: 385,
      y: 250,
      value: 0
    };
    const data = {
      max: this.totalFrameAmmount,
      min: 0,
      data: [dataPoint41, dataPoint42, dataPoint43, dataPoint40]
    };
    this.heatmapInstance.setData(data);
  }

  public calculatePlaceOccupancy() {
    if (this.datasetFrameElement) {
      this.placeOneFrames42 = this.datasetFrameElement.frame_data[0][0].was_occupied_since_start;
      this.placeOneFrames41 = this.datasetFrameElement.frame_data[0][1].was_occupied_since_start;
      this.placeOneFrames43 = this.datasetFrameElement.frame_data[1][0].was_occupied_since_start;
      this.placeOneFrames40 = this.datasetFrameElement.frame_data[1][1].was_occupied_since_start;
    }
  }

  public cameraTurn() {
    this.cameraOn = !this.cameraOn;
    this.calculatePlaceOccupancy();
    this.setHeatMapData();
    if (this.cameraOn) {
      this.setHeatMapData();
    } else {
      this.turnOffHeatMap();
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
        ].people_count;
      } else {
        this.peopleAmountData[i] = null;
      }
    }
  }

  public recountAveragePeopleData() {
    for (let i = 0; i < 250; i++) {
      if (this.dataFromModel[this.currentFrameView - 1 + i]) {
        this.last2People[i] = this.dataFromModel[
          this.currentFrameView - 1 + i
        ].last_2people_count;
      } else {
        this.last2People[i] = null;
      }
    }
  }

  ngOnDestroy() {
    this.subs.unsubscribe();
  }
}
