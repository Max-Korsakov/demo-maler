import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class PlayerService {
  private video: HTMLVideoElement;

  constructor() {}

  public setVideo(video: HTMLVideoElement): void {
    this.video = video;
  }

  public getVideo(): HTMLVideoElement {
    return this.video;
  }
}
