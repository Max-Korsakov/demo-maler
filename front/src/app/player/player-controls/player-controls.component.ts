import { Component, OnInit, OnDestroy } from '@angular/core';
import { PlayerFacade } from '../../../@store/video-player/video-player.facade';
import { VideoViewerFacade } from '../../../@store/video-viewer/video-viewer.facade';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-player-controls',
  templateUrl: './player-controls.component.html',
  styleUrls: ['./player-controls.component.scss']
})
export class PlayerControlsComponent implements OnInit, OnDestroy {
  public sliderCurrentTime: number;
  public sliderInterval: ReturnType<typeof setInterval>;
  public currentFrameView = 1;
  public isVideoPlay: boolean;
  public currentFrameCalculation: number;
  public currentTimeCalculation = 0;
  public framePerSecond: number;
  public frameOffset: number;
  public currentTimeView: string;
  public videoTimeView: string;
  public duration = 0;
  public seekingFrame: number;
  public seekingCurrentTime: number;
  public playBackRate = 1;
  public isVideoReadyToPlay = false;
  public subscriptionPool: Subscription[] = [];

  private readonly OFFSET_FROM_START_FACTOR = 1.0001;

  constructor(
    private playerFacade: PlayerFacade,
    private videoViewerFacade: VideoViewerFacade
  ) {}

  ngOnInit() {
    const isReadyPlay = this.playerFacade.isReadyToPlay$.subscribe(status => {
      this.isVideoReadyToPlay = status;
    });

    this.subscriptionPool.push(isReadyPlay);

    const fpsSub = this.playerFacade.framePerSecond$.subscribe(fps => {
      this.framePerSecond = fps;
      this.calculateFrameTime();
    });

    this.subscriptionPool.push(fpsSub);

    const dur = this.playerFacade.videoDuration$.subscribe(videoDuration => {
      this.duration = videoDuration;
    });

    this.subscriptionPool.push(dur);

    const pbR = this.playerFacade.playbackRate$.subscribe(pbRate => {
      this.playBackRate = pbRate;
    });

    this.subscriptionPool.push(pbR);

    const isPlay = this.playerFacade.isVideoPlay$.subscribe(
      isVideoPlayStatus => {
        this.isVideoPlay = isVideoPlayStatus;
      }
    );
    this.subscriptionPool.push(isPlay);

    let updateCounter = 0;
    const cTime = this.playerFacade.currentTime$.subscribe(currentTime => {
      updateCounter++;
      this.currentTimeCalculation = currentTime;
      this.currentTimeView = this.currentTimeCalculation.toFixed(4);
      this.calculateFrameNumber();
      this.videoViewerFacade.changeCurrentFrame(this.currentFrameView);
      this.setVideoTime(this.currentTimeCalculation);
      if (updateCounter === 5) {
        this.updateSliderData();
        updateCounter = 0;
      }
    });
    this.subscriptionPool.push(cTime);
  }

  play(): void {
    if (!this.isVideoPlay) {
      this.playerFacade.playVideo(true);
    } else {
      this.playerFacade.playVideo(false);
      this.playerFacade.changeCurrentTimeFromControls(
        this.currentTimeCalculation
      );
    }
  }

  calculateFrameTime(): void {
    this.frameOffset = 1 / this.framePerSecond;
  }

  calculateFrameNumber(): void {
    this.currentFrameCalculation =
      this.currentTimeCalculation / this.frameOffset;
    if (
      this.currentFrameCalculation === 0 ||
      isNaN(this.currentFrameCalculation)
    ) {
      this.currentFrameView = 1;
    } else {
      this.currentFrameView = Math.ceil(this.currentFrameCalculation);
    }
  }

  goToNextFrame(): void {
    const framesAmount = Math.floor(this.currentFrameCalculation) + 1;
    const currentTime =
      this.frameOffset * framesAmount * this.OFFSET_FROM_START_FACTOR;
    this.playerFacade.changeCurrentTimeFromControls(currentTime);
  }

  goToPreviousFrame(): void {
    const framesAmount = Math.floor(this.currentFrameCalculation) - 1;
    const currentTime =
      this.frameOffset * framesAmount * this.OFFSET_FROM_START_FACTOR;
    this.playerFacade.changeCurrentTimeFromControls(currentTime);
  }

  updateSliderData(): void {
    this.sliderCurrentTime = this.currentTimeCalculation;
  }

  onSlide(event): void {
    this.playerFacade.changeCurrentTimeFromControls(event.value);
  }

  setVideoTime(time): void {
    const givenSeconds = Math.floor(time);
    const dateObj = new Date(givenSeconds * 1000);
    const hours = dateObj.getUTCHours();
    const minutes = dateObj.getUTCMinutes();
    const seconds = dateObj.getSeconds();
    this.videoTimeView =
      hours.toString().padStart(2, '0') +
      ':' +
      minutes.toString().padStart(2, '0') +
      ':' +
      seconds.toString().padStart(2, '0');
  }

  findFrame(): void {
    const currentTime =
      this.frameOffset *
      (this.seekingFrame - 1) *
      this.OFFSET_FROM_START_FACTOR;
    this.playerFacade.changeCurrentTimeFromControls(currentTime);
    this.seekingFrame = null;
  }

  findCurrentTime(): void {
    this.playerFacade.changeCurrentTimeFromControls(this.seekingCurrentTime);
    this.seekingCurrentTime = null;
  }

  speedUpPlaybackRate(): void {
    if (this.playBackRate === 1) {
      this.playerFacade.changePlayerSpeed(2);
    } else if (this.playBackRate === 2) {
      this.playerFacade.changePlayerSpeed(4);
    } else {
      this.playerFacade.changePlayerSpeed(1);
    }
  }

  slowDawnPlaybackRate(): void {
    if (this.playBackRate === 1) {
      this.playerFacade.changePlayerSpeed(0.5);
    } else if (this.playBackRate === 0.5) {
      this.playerFacade.changePlayerSpeed(0.25);
    } else {
      this.playerFacade.changePlayerSpeed(1);
    }
  }

  ngOnDestroy() {
    this.subscriptionPool.forEach(sub => sub.unsubscribe());
  }
}
