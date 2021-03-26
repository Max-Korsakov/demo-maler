import { Component, OnInit, OnDestroy } from '@angular/core';
import { RouterFacade } from '../../../../@store/router/router.facade';
import {PhotoViewerFacade} from '../../../../@store/photo-viewer/photo-viewer.facade';

@Component({
  selector: 'app-receipt',
  templateUrl: './receipt.component.html',
  styleUrls: ['./receipt.component.scss']
})
export class ReceiptComponent implements OnInit, OnDestroy {

  public frame;
  public subscriptionPool = [];
  public object = [];
  public datasetFrameElement;
  public photoCase;
  public project;
  public currentPhotoName;

  constructor(
    private routerFacade: RouterFacade,
    private photoViewerFacade: PhotoViewerFacade
  ) { }

  ngOnInit() {
    const routerState = this.routerFacade.routeState$.subscribe(stateData => {
      const urlArray = stateData.state.url.split('/');
      this.currentPhotoName = urlArray[urlArray.length - 1];
      this.photoCase = urlArray[urlArray.length - 1];
      this.project = urlArray[urlArray.length - 2];
      if(this.photoCase){
        this.photoViewerFacade.loadData(this.photoCase, this.project);
      }
      });
    this.subscriptionPool.push(routerState);

    const dataState = this.photoViewerFacade.photoData$.subscribe(data => {
      this.object = data;
      if (this.object && typeof this.frame === 'number' ) {
        this.datasetFrameElement = this.object[this.frame];
      }
    });

    this.subscriptionPool.push(dataState);

    const frameState = this.photoViewerFacade.currentFrame$.subscribe(frameNumber => {
      this.frame = frameNumber;
      if (this.object && typeof this.frame === 'number' ) {
        this.datasetFrameElement = this.object[this.frame];
      }
    });

    this.subscriptionPool.push(frameState);
  }

  ngOnDestroy() {
    this.subscriptionPool.forEach(sub => sub.unsubscribe());
    this.photoViewerFacade.deleteStateData();
  }

}
