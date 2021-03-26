import { Component, OnInit } from '@angular/core';
import { PhotoViewerFacade } from '../../../@store/photo-viewer/photo-viewer.facade';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-photo-controls',
  templateUrl: './photo-controls.component.html',
  styleUrls: ['./photo-controls.component.scss']
})
export class PhotoControlsComponent implements OnInit {
  public currentFrameView: number;
  public subscriptionPool: Subscription[] = [];
  public seekingFrame: number;
  public photoArrayLength = 1;

  constructor(private photoViewerFacade: PhotoViewerFacade) {}

  ngOnInit() {
    const curFrame = this.photoViewerFacade.currentFrame$.subscribe(
      frameNumber => {
        this.currentFrameView = frameNumber;
      }
    );

    const len = this.photoViewerFacade.photoData$.subscribe(data => {
      if (data && data.length) {
        this.photoArrayLength = data.length;
      }
    });

    this.subscriptionPool.push(curFrame);
  }

  goToPreviousFrame() {
    if (this.currentFrameView) {
      this.photoViewerFacade.changeCurrentFrame(this.currentFrameView - 1);
    }
  }
  goToNextFrame() {
    if (this.currentFrameView < this.photoArrayLength - 1) {
      this.photoViewerFacade.changeCurrentFrame(this.currentFrameView + 1);
    }
  }

  findFrame() {
    if (
      this.seekingFrame - 1 >= 0 &&
      this.seekingFrame - 1 <= this.photoArrayLength - 1
    ) {
      this.currentFrameView = this.seekingFrame - 1;
      this.photoViewerFacade.changeCurrentFrame(this.currentFrameView);
      this.seekingFrame = null;
    } else {
      this.seekingFrame = null;
    }
  }
}
