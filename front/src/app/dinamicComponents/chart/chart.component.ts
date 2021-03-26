import { Component, Input, AfterViewInit } from "@angular/core";

import { VideoViewerFacade } from "../../../@store/video-viewer/video-viewer.facade";

declare var Plotly: any;

@Component({
  selector: "app-chart",
  templateUrl: "./chart.component.html",
  styleUrls: ["./chart.component.scss"]
})
export class ChartComponent implements AfterViewInit {
  @Input() chartData;
  @Input() object;

  public frame: number;
  public content = [];

  constructor(private VideoViewerFacade: VideoViewerFacade) {}

  ngAfterViewInit() {
    this.VideoViewerFacade.currentFrame$.subscribe(frameNumber => {
      this.frame = frameNumber;
      this.content = [];
      this.bindData();
      this.viewChart();
    });
  }

  public bindData() {
    let value;
    this.chartData.forEach(element => {
      value = this.object[this.frame - 1];
      element.forEach(property => {
        if (value && value[property]) {
          value = value[property];
        } else {
          value = 0;
        }
      });
      this.content = [...this.content, value];
      value = null;
    });
  }

  public viewChart() {
    const trace1 = {
      x: ["Row 1"],
      y: this.content,
      name: "Coverage %",
      texttemplate: "%{value}",
      textposition: "inside",
      marker: {
        color: [
          "rgba(240, 87, 108, 0.2)",
          "rgba(248, 217, 42, 0.2)",
          "rgba(161, 240, 69, 0.2)",
          "rgba(240, 87, 108, 0.2)",
          "rgba(248, 217, 42, 0.2)",
          "rgba(161, 240, 69, 0.2)"
        ]
      },
      type: "bar"
    };

    const data = [trace1];

    const layout = {
      title: "Binding data",
      barmode: "group"
    };

    Plotly.newPlot("chart", data, layout, { displayModeBar: false });
  }
}
