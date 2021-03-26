import { Component, AfterViewInit, ElementRef, Input, OnDestroy } from '@angular/core';
import { PlayerService } from '../../services/player.service';

@Component({
  selector: 'app-video-screenshot',
  templateUrl: './video-screenshot.component.html',
  styleUrls: ['./video-screenshot.component.scss']
})
export class VideoScreenshotComponent implements AfterViewInit, OnDestroy {

  @Input() videoTime: string;

  private canvas: HTMLCanvasElement;
  private video: HTMLVideoElement;
  private currentTime: number;
  private readonly width = 640;
  private readonly height = 360;

  constructor(
    private elementRef: ElementRef,
    private playerService: PlayerService
  ) { }

  private saveFrame(video: HTMLVideoElement): void {
    if (video) {
      this.getCanvasContext().drawImage(video, 0, 0, this.width, this.height);
      const frame = this.getCanvasContext().getImageData(0, 0, this.width, this.height);
      this.drowImage(frame);
    }
  }

  private drowImage(image: ImageData): void {
    const length = image.data.length / 4;

    for (let i = 0; i < length; i++) {
      const r = image.data[i * 4 + 0];
      const g = image.data[i * 4 + 1];
      const b = image.data[i * 4 + 2];
      if (g > 100 && r > 100 && b < 43) {
        image.data[i * 4 + 3] = 0;
      }
    }
    this.getCanvasContext().putImageData(image, 0, 0);
  }

  private getCanvasContext(): CanvasRenderingContext2D {
    if (this.canvas) {
      return this.canvas.getContext('2d');
    } else {
      this.canvas = this.elementRef.nativeElement.querySelector('.screenshot-canvas');
      return this.canvas.getContext('2d');
    }
  }

  ngAfterViewInit() {
    if (!this.video) {
      this.video = this.playerService.getVideo();
    }
    this.currentTime = this.video.currentTime;
    this.video.addEventListener('timeupdate', () => this.saveFrame(this.video));
    this.video.currentTime = Number(this.videoTime);
  }

  ngOnDestroy() {
    this.video.removeEventListener('timeupdate', () => this.saveFrame(this.video));
    this.video.currentTime = this.currentTime;
  }
}
