import {
  Component,
  OnInit,
  Input,
  ViewChild,
  OnDestroy,
  ElementRef,
  Output,
  EventEmitter
} from "@angular/core";
import { CorrectionInformation, FrameDataRoad } from "../models/traffic-models";
import { CarCounterData } from "../models/traffic-models";
import { Observable, Subscription, BehaviorSubject } from "rxjs";
import { VideoViewerFacade } from "../../@store/video-viewer/video-viewer.facade";
import { DialogService } from "../services/dialog.service";

@Component({
  selector: "app-correction-information",
  templateUrl: "./correction-information.component.html",
  styleUrls: ["./correction-information.component.scss"]
})
export class CorrectionInformationComponent implements OnInit, OnDestroy {
  @ViewChild("commentInputField")
  commentInputField: ElementRef;

  @Input() correctionInformation$: Observable<CorrectionInformation>;
  @Input() frameIndex = 0;
  @Output() saveComment = new EventEmitter<string>();
  @Output() deleteCheckpoint = new EventEmitter<number>();

  private videoTime = "";
  private newCarCounter: CarCounterData[] = [];
  private oldCarCounter: CarCounterData[] = [];
  private comment = "";
  private frameNumber = 0;
  private frameRangeStart: number;
  private frameRangeEnd: number;
  private timeRangeStart: number;
  private timeRangeEnd: number;
  private subs: Subscription;
  private correction: boolean;

  constructor(
    private VideoViewerFacade: VideoViewerFacade,
    private dialogService: DialogService
  ) {}

  public onSaveComment(): void {
    this.saveComment.next(this.commentInputField.nativeElement.value);
    this.commentInputField.nativeElement.value = "";
  }

  public onDeleteCheckpoint(): void {
    this.dialogService.openConfirmationDialog().subscribe(confirmation => {
      if (confirmation) {
        this.deleteCheckpoint.next(this.frameIndex);
      }
    });
  }

  public getFrameNumber(): number {
    return this.frameNumber;
  }

  public getVideoTime(): string {
    return this.videoTime;
  }

  public getComment(): string {
    return this.comment;
  }

  public getNewCarCounter(): CarCounterData[] {
    return this.newCarCounter;
  }

  public getOldCarCounter(): CarCounterData[] {
    return this.oldCarCounter;
  }

  public getFrameRange(): any {
    return {
      frameRangeStart: this.frameRangeStart,
      frameRangeEnd: this.frameRangeEnd
    };
  }

  public getCorrectionStatus(): boolean {
    return this.correction;
  }

  public getTimeRange(): any {
    return {
      timeRangeStart: this.timeRangeStart,
      timeRangeEnd: this.timeRangeEnd
    };
  }

  private setUpData(correctionInformation: CorrectionInformation): void {
    if (correctionInformation) {
      this.frameNumber = Number(
        correctionInformation.frameDataRoad[this.frameIndex].frame_number
      );
      this.correction =
        correctionInformation.frameDataRoad[this.frameIndex].correction;
      this.videoTime =
        correctionInformation.frameDataRoad[this.frameIndex].currentTime;

      this.timeRangeStart =
        correctionInformation.frameDataRoad[this.frameIndex].timeRanges[0];
      this.timeRangeEnd =
        correctionInformation.frameDataRoad[this.frameIndex].timeRanges[1];

      this.frameRangeStart =
        correctionInformation.frameDataRoad[this.frameIndex].frameRanges[0];
      this.frameRangeEnd =
        correctionInformation.frameDataRoad[this.frameIndex].frameRanges[1];

      this.oldCarCounter = [
        ...correctionInformation.frameDataRoad[this.frameIndex].frame_data
          .car_counter
      ];
      this.comment =
        correctionInformation.frameDataRoad[this.frameIndex].comment;
    }
  }

  ngOnInit() {
    this.subs = new Subscription();
    if (this.correctionInformation$) {
      this.subs.add(
        this.correctionInformation$.subscribe(
          (correctionInformation: CorrectionInformation) => {
            this.setUpData(correctionInformation);
          }
        )
      );
    }

    this.subs.add(
      this.VideoViewerFacade.videoData$.subscribe(
        (framesData: FrameDataRoad[]) => {
          framesData.forEach((frameData: FrameDataRoad) => {
            if (+frameData.frame_data.analysed_frame === this.frameNumber) {
              this.newCarCounter = [...frameData.frame_data.car_counter];
              return;
            }
          });
        }
      )
    );
  }

  ngOnDestroy() {
    this.subs.unsubscribe();
  }
}
