import {
  Component,
  AfterViewInit,
  ViewChild,
  ElementRef,
  OnInit,
  OnDestroy,
} from "@angular/core";

import { PlayerFacade } from "../../../@store/video-player/video-player.facade";
import { PlayerService } from "../../services/player.service";
import { VideoViewerFacade } from "../../../@store/video-viewer/video-viewer.facade";
import { Subscription } from "rxjs";
import { MatSnackBar } from "@angular/material/snack-bar";

@Component({
  selector: "app-player-view",
  templateUrl: "./player-view.component.html",
  styleUrls: ["./player-view.component.scss"],
})
export class PlayerViewComponent implements OnInit, AfterViewInit, OnDestroy {
  constructor(
    private playerFacade: PlayerFacade,
    private playerService: PlayerService,
    private videoViewerFacade: VideoViewerFacade,
    private snackBar: MatSnackBar
  ) {}

  @ViewChild("videoPlayer") videoPlayer: ElementRef;

  public video: HTMLVideoElement;
  public videoInterval: ReturnType<typeof setInterval>;
  public dataSrc: string;
  public subscriptionPool: Subscription[] = [];
  public isLoading = true;
  public framePerSecond = 25;

  private readonly OFFSET_TO_DO_INTERVAL_LESS_THAN_FRAMETIME = 0.9;

  ngOnInit() {
    const playerError = this.videoViewerFacade.error$.subscribe((error) => {
      if (error) {
        this.openSnackBar(error.error.message);
      }
    });
    this.subscriptionPool.push(playerError);
    const videoUrl = this.playerFacade.videoURl$.subscribe((url) => {
      this.dataSrc = url;
    });
    this.subscriptionPool.push(videoUrl);

    const currentTimeFromControls = this.playerFacade.currentTimeFromControls$.subscribe(
      (currentTime) => {
        if (this.video) {
          this.video.currentTime = currentTime;
        }
      }
    );

    this.subscriptionPool.push(currentTimeFromControls);

    const fpsSub = this.playerFacade.framePerSecond$.subscribe((fps) => {
      this.framePerSecond = fps;
    });

    this.subscriptionPool.push(fpsSub);
  }

  ngAfterViewInit() {
    this.video = this.videoPlayer.nativeElement;
    this.updateCurrantTimeAtStore();
    const playbackRate = this.playerFacade.playbackRate$.subscribe((pbRate) => {
      this.video.playbackRate = pbRate;
    });
    this.subscriptionPool.push(playbackRate);
    this.video.onloadedmetadata = () => {
      this.playerFacade.setVideoDuration(this.video.duration);
    };
    this.video.oncanplay = () => {
      this.playerFacade.changeReadyToPlayStatus(true);
      const isPlay = this.playerFacade.isVideoPlay$.subscribe(
        (isPlayStatus) => {
          if (isPlayStatus) {
            this.video.play();
          } else {
            this.video.pause();
          }
        }
      );
      this.subscriptionPool.push(isPlay);
      this.isLoading = false;
    };

    this.video.onwaiting = () => {
      this.isLoading = true;
    };

    this.playerService.setVideo(this.video);
  }

  openSnackBar(message) {
    this.snackBar.open(message, "Undo", {
      duration: 3000,
    });
  }

  updateCurrantTimeAtStore(): void {
    this.videoInterval = setInterval(() => {
      this.playerFacade.changeCurrentTime(this.video.currentTime);
    }, (1000 / this.framePerSecond) * this.OFFSET_TO_DO_INTERVAL_LESS_THAN_FRAMETIME);
  }

  ngOnDestroy() {
    clearInterval(this.videoInterval);
    this.subscriptionPool.forEach((sub) => sub.unsubscribe());
  }
}
