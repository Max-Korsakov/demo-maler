import { Component, OnInit, OnDestroy } from '@angular/core';
import { RouterFacade } from '../../@store/router/router.facade';
import { PhotoViewerFacade } from '../../@store/photo-viewer/photo-viewer.facade';
import { MatSnackBar } from '@angular/material/snack-bar';
import { HttpService } from '../services/http.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-photo-viewer',
  templateUrl: './photo-viewer.component.html',
  styleUrls: ['./photo-viewer.component.scss']
})
export class PhotoViewerComponent implements OnInit, OnDestroy {
  public currentFrameView = 0;
  public currentPhotoURL = '../../assets/Loading.jpg';
  public photoCase: string;
  public project: string;
  public dataObject: any[];
  public subscriptionPool: Subscription[] = [];
  public isloading = true;

  constructor(
    private routerFacade: RouterFacade,
    private photoViewerFacade: PhotoViewerFacade,
    private httpService: HttpService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit() {
    const photoViewerError = this.photoViewerFacade.error$.subscribe(error => {
      if (error) {
        this.openSnackBar(error.error.message);
      }
    });
    this.subscriptionPool.push(photoViewerError);

    const routerState = this.routerFacade.routeState$.subscribe(state => {
      const urlArray = state.state.url.split('/');
      this.photoCase = urlArray[urlArray.length - 1];
      this.project = urlArray[urlArray.length - 2];
    });
    this.subscriptionPool.push(routerState);

    const photoData = this.photoViewerFacade.photoData$.subscribe(data => {
      this.dataObject = data;
      if (data) {
        this.loadNewPhoto();
      }
    });
    this.subscriptionPool.push(photoData);

    const curFrame = this.photoViewerFacade.currentFrame$.subscribe(
      frameNumber => {
        this.currentFrameView = frameNumber;
        this.loadNewPhoto();
      }
    );

    this.subscriptionPool.push(curFrame);
  }

  openSnackBar(message) {
    this.snackBar.open(message, 'Undo', {
      duration: 3000
    });
  }

  loadNewPhoto() {
    this.currentPhotoURL = '../../assets/Loading.jpg';
    if (this.dataObject && this.dataObject.length > 0) {
      this.httpService
        .getPhoto(
          this.project,
          this.photoCase,
          this.dataObject[this.currentFrameView].image_name
        )
        .subscribe(sighnedLink => {
          this.currentPhotoURL = sighnedLink;
        });
    }
  }

  ngOnDestroy(): void {
    this.subscriptionPool.forEach(sub => sub.unsubscribe());
    this.photoViewerFacade.deleteStateData();
  }
}
