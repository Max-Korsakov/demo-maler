import { Component, OnInit, HostListener, OnDestroy } from "@angular/core";

import { FrameDataRoad } from "../../../models/traffic-models/frame.model";
import { FrameInformation } from "../../../models/traffic-models/frame-information.model";
import { TrafficLogData } from "../../../models/traffic-models/traffic-log.model";
import { CarCounterData } from "../../../models/traffic-models/car-counter.model";
import { CorrectionInformation } from "../../../models/traffic-models/correction-information.model";
import { BehaviorSubject, Subscription, Observable } from "rxjs";
import { VideoViewerFacade } from "../../../../@store/video-viewer/video-viewer.facade";
import { PlayerFacade } from "../../../../@store/video-player/video-player.facade";
import { RouterFacade } from "../../../../@store/router/router.facade";
import { DialogService } from "../../../services/dialog.service";
import {
  CreateTimeRange,
  CreateFrameRange
} from "../../../../@calculations/traffic/index";

@Component({
  selector: "app-road",
  templateUrl: "./road.component.html",
  styleUrls: ["./road.component.scss"]
})
export class RoadComponent implements OnInit, OnDestroy {
  public isVideoPlay$: Observable<boolean>;
  public currentFrameView = 0;
  public dataFromModel: FrameDataRoad[];
  public datasetFrameElement: FrameDataRoad;
  public log: TrafficLogData[] = [];
  public chosenRow: number = null;
  public chosenType: string = null;
  public showingRowsConfig: boolean[] = [];
  public currentFrameInformation: FrameInformation;
  public widgetShown = false;
  public videoTitle: string;
  public correctionInformation: CorrectionInformation;
  public correctionInformation$: BehaviorSubject<CorrectionInformation>;
  public currentFrameTableIndex = 1;
  public carCounter: CarCounterData[];
  public currentTime: number;
  public mode = "editor";
  public correctFrameForSavingCheckbox = true;
  public snackBarDurationInSeconds = 3;
  public applyingFrames = true;
  private subs: Subscription;

  constructor(
    private VideoViewerFacade: VideoViewerFacade,
    private routerFacade: RouterFacade,
    private dialogService: DialogService,
    private playerFacade: PlayerFacade
  ) {}

  ngOnInit() {
    this.subs = new Subscription();
    this.correctionInformation = new CorrectionInformation();
    this.correctionInformation$ = new BehaviorSubject<CorrectionInformation>(
      this.correctionInformation
    );
    this.subs.add(
      this.routerFacade.routeState$.subscribe(routerData => {
        const routeInfo = routerData.state.url.split("/");
        this.videoTitle = routeInfo[routeInfo.length - 1];
      })
    );
    this.VideoViewerFacade.loadVideo(this.videoTitle, "Traffic");

    this.subs.add(
      this.VideoViewerFacade.currentTime$.subscribe((currentFrame: number) => {
        this.currentTime = currentFrame;
      })
    );

    this.subs.add(
      this.VideoViewerFacade.videoData$.subscribe((data: FrameDataRoad[]) => {
        this.dataFromModel = this.deepCopy(data);
        if (data && data.length > 0 && data[0].frame_data) {
          this.datasetFrameElement = this.dataFromModel[
            this.currentFrameView - 1
          ];
          this.carCounter = this.datasetFrameElement.frame_data.car_counter;
          this.initializeAcceptableRows();
          this.dataFromModel.forEach(frame => {
            frame.frame_data.car_counter.forEach(element => {
              if (element.car === undefined) {
                element.car = 0;
              }
              if (element["bus/truck"] === undefined) {
                element["bus/truck"] = 0;
              }
            });
          });
        }
      })
    );

    this.subs.add(
      this.VideoViewerFacade.currentFrame$.subscribe((currentFrame: number) => {
        if (currentFrame) {
          this.currentFrameView = currentFrame;
          this.correctFrameForSavingCheckbox = this.frameRangeCorrect(
            currentFrame
          );

          if (this.dataFromModel && this.currentFrameView) {
            this.datasetFrameElement = this.dataFromModel[
              this.currentFrameView - 1
            ];
          }
        }
      })
    );

    this.isVideoPlay$ = this.playerFacade.isVideoPlay$;
  }

  public onFocusOut(value: number): void {
    if (+value !== -1 && +value !== this.getCurrentRowValue()) {
      this.affectAllFrames(Number(value));
    }

    this.chosenRow = null;
    this.chosenType = null;
  }

  startNewGoldenSetFromZero() {
    this.dialogService.openConfirmationDialog().subscribe(confirm => {
      if (confirm) {
        const zeroLineIntersection = [false, false, false, false, false, false];
        this.dataFromModel.forEach(frameData => {
          frameData.frame_data.car_counter.forEach(row => {
            row.car = 0;
            row["bus/truck"] = 0;
          });
          frameData.frame_data.lane_intersection_flags = [
            ...zeroLineIntersection
          ];
        });
      }
    });
  }

  public async applyRangeBefore(event, id: number): Promise<void> {
    if (event.checked) {
      this.dialogService
        .openConfirmationDialog()
        .toPromise()
        .then((confirm: boolean) => {
          if (confirm) {
            this.applyRange(id);
            event.source.disabled = true;
            return;
          }
          event.source.checked = false;
        });
    }
  }

  public applyingFramesToggle(): void {
    this.applyingFrames = !this.applyingFrames;
  }

  private applyRange(id: number): void {
    const [firstFrame, lastFrame] = this.correctionInformation.frameDataRoad[
      id
    ].frameRanges;
    const carCounter = this.dataFromModel[
      this.currentFrameView - 1
    ].frame_data.car_counter.slice(0);

    for (let index = +firstFrame; index <= +lastFrame; index++) {
      this.dataFromModel[index].frame_data.car_counter = this.deepCopy(
        carCounter
      );
    }
  }

  private applyFrames(index: number, value: number): void {
    for (; index < this.dataFromModel.length; index++) {
      const frame = this.dataFromModel[index];
      this.changeFrameCarCounter(frame, this.chosenRow, this.chosenType, value);
    }
  }

  public affectAllFrames(newValue: number): void {
    const value = newValue - this.getCurrentRowValue();
    const frame = this.dataFromModel[this.currentFrameView - 1];

    if (!this.frameRangeCorrect(+frame.frame_number)) {
      return;
    }
    if (this.getCurrentRowValue() === newValue) {
      return;
    }

    this.changeFrameCarCounter(frame, this.chosenRow, this.chosenType, value);
    this.addFrameCorrectionInformation();

    if (this.applyingFrames) {
      this.applyFrames(this.currentFrameView, value);
    }
  }

  public decrementNumber(): void {
    if (this.getCurrentRowValue() === 0) {
      return;
    }
    const value = this.getCurrentRowValue() - 1;
    this.affectAllFrames(value);
  }

  public incrementNumber(): void {
    const value = this.getCurrentRowValue() + 1;
    this.affectAllFrames(value);
  }

  public showWidget(id: number): void {
    this.currentFrameTableIndex = id;
    this.widgetShown = true;
  }

  public closeWidget(): void {
    this.widgetShown = false;
    this.correctionInformation$.next(this.correctionInformation);
  }

  public chooseElement(index: number, type: string): void {
    this.chosenRow = index;
    this.chosenType = type;
  }

  public toggleMode(event): void {
    if (event.checked) {
      this.mode = "comparison";
    } else {
      this.mode = "editor";
    }
  }

  public resetCheckpoints(): void {
    this.dialogService.openConfirmationDialog().subscribe(confirm => {
      if (confirm) {
        this.correctionInformation.checkpoints = [];
        this.correctionInformation.frameDataRoad = [];
        this.correctionInformation$.next(this.correctionInformation);
        this.VideoViewerFacade.loadData(this.videoTitle, "Traffic");
        this.correctFrameForSavingCheckbox = this.frameRangeCorrect(
          this.currentFrameView - 1
        );
      }
    });
  }

  public saveComment(comment: string): void {
    this.addCommentToCorrectionInformation(comment);
    this.correctionInformation$.next(this.correctionInformation);
  }

  public deleteCheckpoint(frameIndex: number): void {
    this.correctionInformation.frameDataRoad.splice(frameIndex, 1);
    this.correctionInformation.checkpoints.splice(frameIndex, 1);
    this.log.splice(frameIndex, 1);
    this.widgetShown = false;
  }

  public preventFocusLose(): boolean {
    return false;
  }

  public saveStandardData(): void {
    this.VideoViewerFacade.saveStandardData("traffic", {
      data: this.dataFromModel,
      correction: this.correctionInformation
    });
  }

  public handleRowAvailabilityChange(): void {
    this.addCheckPoint();
  }

  public getWidgetHeader(): string {
    return `Checkpoint ${this.currentFrameTableIndex + 1}`;
  }

  public addCheckPoint(): void {
    const frame = this.dataFromModel[this.currentFrameView - 1];
    if (!this.frameRangeCorrect(+frame.frame_number)) {
      return;
    }

    const frameIndex = this.getFrameIndex();
    let correctedFrameInformation;

    if (frameIndex === -1) {
      correctedFrameInformation = this.deepCopy(this.datasetFrameElement);
      this.correctionInformation.frameDataRoad.push(correctedFrameInformation);
      this.correctionInformation.checkpoints.push(
        +this.datasetFrameElement.frame_number
      );
      correctedFrameInformation.currentTime = this.currentTime;
      correctedFrameInformation.timeRanges = CreateTimeRange(
        this.correctionInformation
      );
      correctedFrameInformation.frameRanges = CreateFrameRange(
        this.correctionInformation
      );
      this.correctionInformation.checkedRaws = [
        ...this.correctionInformation.checkedRaws,
        [...this.showingRowsConfig]
      ];
    } else {
      this.correctionInformation.frameDataRoad[
        frameIndex
      ].currentTime = this.currentTime;
      this.correctionInformation.frameDataRoad[
        frameIndex
      ].timeRanges = CreateTimeRange(this.correctionInformation);
      this.correctionInformation.frameDataRoad[
        frameIndex
      ].frameRanges = CreateFrameRange(this.correctionInformation);
      this.correctionInformation.checkedRaws[frameIndex + 1] = [
        ...this.showingRowsConfig
      ];
    }
  }

  private getCurrentRowValue(): number {
    return Number(
      this.dataFromModel[this.currentFrameView - 1].frame_data.car_counter[
        this.chosenRow
      ][this.chosenType]
    );
  }

  private frameRangeCorrect(frameNumber: number): boolean {
    const len = this.correctionInformation.frameDataRoad.length;

    if (len === 0) {
      return true;
    }

    if (
      this.correctionInformation.frameDataRoad[len - 1].frame_number <=
      frameNumber
    ) {
      return true;
    }

    return false;
  }

  private changeFrameCarCounter(
    frame: FrameDataRoad,
    chosenRow: number,
    chosenType: string,
    value: number
  ): void {
    if (!frame) {
      return;
    }
    frame.frame_data.car_counter[chosenRow][chosenType] += value;
  }

  private addCommentToCorrectionInformation(comment: string): void {
    this.correctionInformation.frameDataRoad.forEach((frame: FrameDataRoad) => {
      if (+frame.frame_number === this.currentFrameView) {
        frame.comment = comment;
        return;
      }
    });
  }

  private addFrameCorrectionInformation(): void {
    const frameIndex = this.getFrameIndex();
    let correctedFrameInformation;
    if (frameIndex === -1) {
      correctedFrameInformation = this.deepCopy(this.datasetFrameElement);
      this.correctionInformation.frameDataRoad.push(correctedFrameInformation);
      this.correctionInformation.checkpoints.push(
        +this.datasetFrameElement.frame_number
      );
      correctedFrameInformation.currentTime = this.currentTime;
      correctedFrameInformation.correction = true;
      correctedFrameInformation.timeRanges = CreateTimeRange(
        this.correctionInformation
      );
      correctedFrameInformation.frameRanges = CreateFrameRange(
        this.correctionInformation
      );
      this.correctionInformation.checkedRaws = [
        ...this.correctionInformation.checkedRaws,
        [...this.showingRowsConfig]
      ];
    } else {
      this.correctionInformation.frameDataRoad[
        frameIndex
      ].currentTime = this.currentTime;
      this.correctionInformation.frameDataRoad[frameIndex].correction = true;
      this.correctionInformation.frameDataRoad[
        frameIndex
      ].timeRanges = CreateTimeRange(this.correctionInformation);
      this.correctionInformation.frameDataRoad[
        frameIndex
      ].frameRanges = CreateFrameRange(this.correctionInformation);
      this.correctionInformation.checkedRaws[frameIndex] = [
        ...this.showingRowsConfig
      ];
    }
  }

  private getFrameIndex(): number {
    for (let i = 0; i < this.correctionInformation.frameDataRoad.length; ++i) {
      if (
        this.correctionInformation.frameDataRoad[i].frame_number ===
        this.datasetFrameElement.frame_number
      ) {
        return i;
      }
    }
    return -1;
  }

  private initializeAcceptableRows(): void {
    this.datasetFrameElement.frame_data.car_counter.forEach(
      (row: CarCounterData) => {
        this.showingRowsConfig = [...this.showingRowsConfig, true];
      }
    );
    this.correctionInformation.checkedRaws = [
      ...[],
      [...this.showingRowsConfig]
    ];
  }

  private deepCopy(object: any): any {
    if (object) {
      return JSON.parse(JSON.stringify(object));
    }
  }

  ngOnDestroy() {
    this.subs.unsubscribe();
    this.VideoViewerFacade.deleteStateData();
  }
}
