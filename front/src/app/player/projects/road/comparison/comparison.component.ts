import { Component, OnInit, OnDestroy } from "@angular/core";
import { VideoViewerFacade } from "../../../../../@store/video-viewer/video-viewer.facade";

declare var Plotly: any;

@Component({
  selector: "app-comparison",
  templateUrl: "./comparison.component.html",
  styleUrls: ["./comparison.component.scss"]
})
export class ComparisonComponent implements OnInit, OnDestroy {
  constructor(private VideoViewerFacade: VideoViewerFacade) {}

  public standardData;
  public trafficData;
  public correctionData;
  public coverage = [0, 0, 0, 0, 0, 0];
  public accuracy = [0, 0, 0, 0, 0, 0];
  public accuracyCar = [0, 0, 0, 0, 0, 0];
  public accuracyTruck = [0, 0, 0, 0, 0, 0];
  public subscriptionPool = [];
  public checkedFrames;
  public framesWithError;
  public isErrors = false;

  ngOnInit() {
    this.VideoViewerFacade.loadStandardData();
    const videoData = this.VideoViewerFacade.videoData$.subscribe(data => {
      if (data.length > 0) {
        this.trafficData = this.deepCopy(data);
      }
    });
    this.subscriptionPool.push(videoData);
    const standardData = this.VideoViewerFacade.standardData$.subscribe(
      data => {
        if (data) {
          this.standardData = this.deepCopy(data);
          if (this.correctionData && this.standardData && this.trafficData) {
            this.checkRowsCoverage();
            this.viewChart();
          }
        }
      }
    );
    this.subscriptionPool.push(standardData);
    const correctionData = this.VideoViewerFacade.correctionData$.subscribe(
      data => {
        if (data) {
          this.correctionData = this.deepCopy(data);
          if (this.correctionData && this.standardData && this.trafficData) {
            this.checkRowsCoverage();
            this.viewChart();
          }
        }
      }
    );
    this.subscriptionPool.push(correctionData);
  }

  public viewChart() {
    const trace1 = {
      x: ["Row 1", "Row 2", "Row 3", "Row 4", "Row 5", "Row 6"],
      y: this.coverage,
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

    const trace3 = {
      x: ["Row 1", "Row 2", "Row 3", "Row 4", "Row 5", "Row 6"],
      y: this.accuracyCar,
      name: "Accuracy Cars %",
      texttemplate: "%{value}",
      textposition: "inside",
      marker: {
        color: [
          "rgba(240, 87, 108,  0.6)",
          "rgba(248, 217, 42,  0.6)",
          "rgba(161, 240, 69, 0.6)",
          "rgba(240, 87, 108, 0.6)",
          "rgba(248, 217, 42, 0.6)",
          "rgba(161, 240, 69, 0.6)"
        ]
      },
      type: "bar"
    };

    const trace4 = {
      x: ["Row 1", "Row 2", "Row 3", "Row 4", "Row 5", "Row 6"],
      y: this.accuracyTruck,
      name: "Accuracy Truck%",
      texttemplate: "%{value}",
      textposition: "inside",
      marker: {
        color: [
          "rgba(240, 87, 108, 1)",
          "rgba(248, 217, 42, 1)",
          "rgba(161, 240, 69, 1)",
          "rgba(240, 87, 108, 1)",
          "rgba(248, 217, 42, 1)",
          "rgba(161, 240, 69, 1)"
        ]
      },
      type: "bar"
    };

    const data = [trace1, trace3, trace4];

    const layout = {
      title: "Traffic data",
      barmode: "group"
    };

    Plotly.newPlot("trafficChart", data, layout, { displayModeBar: false });
  }

  checkRowsCoverage() {
    const allFrames = this.trafficData.length;
    const coverage = [0, 0, 0, 0, 0, 0];
    const coveragePercents = [];
    this.correctionData.checkedRaws.forEach((checkedArray, index) => {
      if (index === 1) {
        checkedArray.forEach((row, i) => {
          if (this.correctionData.checkpoints[index - 1] !== 1) {
            coverage[i] = this.correctionData.checkpoints[index - 1];
          } else if (this.correctionData.checkpoints[index - 1] === 1 && row) {
            coverage[i] = this.correctionData.checkpoints[index - 1];
          }
        });
      } else if (index > 1) {
        checkedArray.forEach((row, i) => {
          if (
            this.correctionData.checkedRaws[index - 1][i] &&
            coverage[i] !== 0
          ) {
            coverage[i] =
              coverage[i] +
              this.correctionData.checkpoints[index - 1] -
              this.correctionData.checkpoints[index - 2];
          } else if (
            this.correctionData.checkedRaws[index - 1][i] &&
            coverage[i] === 0
          ) {
            coverage[i] =
              this.correctionData.checkpoints[index - 1] -
              this.correctionData.checkpoints[index - 2];
          }
        });
      }
    });

    coverage.forEach(item => {
      if (!item) {
        coveragePercents.push(0);
      } else {
        const value = Number(((item / allFrames) * 100).toFixed(2));
        coveragePercents.push(value);
      }
    });
    this.coverage = [...coveragePercents];
    if (this.trafficData && this.standardData) {
      this.checkAccuracy();
    }
  }

  checkAccuracy() {
    const errors = [[], [], [], [], [], []];
    this.checkedFrames = this.correctionData.checkpoints[
      this.correctionData.checkpoints.length - 1
    ];
    const trafficCopy = this.deepCopy(this.trafficData);
    const standardCopy = this.deepCopy(this.standardData);
    const checkingInterval = trafficCopy.splice(0, this.checkedFrames);
    const standardInterval = standardCopy.splice(0, this.checkedFrames);
    this.correctionData.checkpoints.forEach((checkPoint, index) => {
      checkingInterval[checkPoint - 1].frame_data.car_counter.forEach(
        (row, i) => {
          if (this.correctionData.checkedRaws[index][i]) {
            if (
              row.car !==
              standardInterval[checkPoint - 1].frame_data.car_counter[i].car
            ) {
              let rangeStart = 0;
              if (this.correctionData.checkpoints[index - 1]) {
                rangeStart = this.correctionData.checkpoints[index - 1];
              }
              errors[i] = [
                ...errors[i],
                {
                  range: `${rangeStart}-${checkPoint}`,
                  type: "car",
                  data: row.car,
                  correctData:
                    standardInterval[checkPoint - 1].frame_data.car_counter[i]
                      .car
                }
              ];
              const correction =
                standardInterval[checkPoint - 1].frame_data.car_counter[i].car -
                row.car;

              this.correctError(
                checkingInterval,
                correction,
                i,
                checkPoint - 1,
                "car"
              );
            }

            if (
              row["bus/truck"] !==
              standardInterval[checkPoint - 1].frame_data.car_counter[i][
                "bus/truck"
              ]
            ) {
              let rangeStart = 0;
              if (this.correctionData.checkpoints[index - 1]) {
                rangeStart = this.correctionData.checkpoints[index - 1];
              }
              errors[i] = [
                ...errors[i],
                {
                  range: `${rangeStart}-${checkPoint}`,
                  type: "bus/truck",
                  data: row["bus/truck"],
                  correctData:
                    standardInterval[checkPoint - 1].frame_data.car_counter[i][
                      "bus/truck"
                    ]
                }
              ];
              const correction =
                standardInterval[checkPoint - 1].frame_data.car_counter[i].car -
                row["bus/truck"];
              this.correctError(
                checkingInterval,
                correction,
                i,
                checkPoint - 1,
                "bus/truck"
              );
            }
          }
        }
      );
    });
    errors.forEach(row => {
      if (row.length > 0) {
        this.isErrors = true;
      }
    });
    this.framesWithError = [...errors];
    this.mapErrors(errors);
  }

  public correctError(object, correction, rowIndex, frameLimit, vehicleType) {
    object.forEach(frame => {
      if (+frame.frame_number >= frameLimit) {
        frame.frame_data.car_counter[rowIndex][vehicleType] =
          frame.frame_data.car_counter[rowIndex][vehicleType] + correction;
      }
    });
  }

  // public mapErrors(errorArray) {
  //   errorArray.forEach((row, i) => {
  //     let rowCarErrors = 0;
  //     let rowTruckErrors = 0;
  //     row.forEach(error => {
  //       if (error.type === 'car') {
  //         rowCarErrors = rowCarErrors + 1;
  //       } else if (error.type === 'bus/truck') {
  //         rowTruckErrors = rowTruckErrors + 1;
  //       }
  //     });

  //     if (this.coverage[i]) {
  //       this.accuracyCar[i] =
  //         ((this.checkedFrames - rowCarErrors) / this.checkedFrames) * 100;
  //       this.accuracyTruck[i] =
  //         ((this.checkedFrames - rowTruckErrors) / this.checkedFrames) * 100;
  //     }
  //   });

  //   this.framesWithError = frameErrors;
  // }

  public mapErrors(errors) {
    errors.forEach((rowErrorsArray, index) => {
      let rowCarErrors = 0;
      let rowTruckErrors = 0;
      if (rowErrorsArray.length > 0) {
        rowErrorsArray.forEach(error => {
          if (error.type === "car") {
            rowCarErrors = rowCarErrors + 1;
          } else if (error.type === "bus/truck") {
            rowTruckErrors = rowTruckErrors + 1;
          }
        });
      }
      if (
        this.correctionData.checkedRaws[
          this.correctionData.checkedRaws.length - 1
        ][index]
      ) {
        this.accuracyCar[index] =
          ((this.correctionData.checkpoints.length - rowCarErrors) /
            this.correctionData.checkpoints.length) *
          100;
        this.accuracyTruck[index] =
          ((this.correctionData.checkpoints.length - rowTruckErrors) /
            this.correctionData.checkpoints.length) *
          100;
      }
    });
  }

  private deepCopy(object: any): any {
    if (object) {
      return JSON.parse(JSON.stringify(object));
    }
  }

  ngOnDestroy() {
    this.subscriptionPool.forEach(item => {
      item.unsubscribe();
    });
  }
}
