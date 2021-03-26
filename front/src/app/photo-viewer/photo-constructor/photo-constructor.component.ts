import {
  Component,
  OnInit,
  OnDestroy,
  AfterViewInit,
  ViewChild,
  ViewContainerRef,
  ComponentFactoryResolver,
  ComponentFactory
} from '@angular/core';
import {
  trigger,
  state,
  style,
  animate,
  transition,
  keyframes
} from '@angular/animations';

import { VideoViewerFacade } from '../../../@store/video-viewer/video-viewer.facade';
import { RouterFacade } from '../../../@store/router/router.facade';
import { DialogService } from '../../services/dialog.service';
import { ChartComponent } from '../../dinamicComponents/chart/chart.component';
import { ChangeDetectorRef } from '@angular/core';
import { PhotoViewerFacade } from '../../../@store/photo-viewer/photo-viewer.facade';

@Component({
  selector: 'app-photo-constructor',
  templateUrl: './photo-constructor.component.html',
  styleUrls: ['./photo-constructor.component.scss'],
  animations: [
    trigger('move', [
      state('in', style({ transform: 'scale(1)' })),
      state('out', style({ transform: 'scale(1)' })),
      transition(
        'in <=> out',
        animate(
          '.25s linear',
          keyframes([
            style({ transform: 'scale(1.12)', offset: 0 }),
            style({ transform: 'scale(0.88)', offset: 0.4 }),
            style({ transform: 'scale(1.1)', offset: 0.7 }),
            style({ transform: 'scale(0.9)', offset: 1 })
          ])
        )
      )
    ])
  ]
})
export class PhotoConstructorComponent
  implements OnInit, AfterViewInit, OnDestroy {
  constructor(
    private dialogService: DialogService,
    private videoViewerFacade: VideoViewerFacade,
    private routerFacade: RouterFacade,
    private resolver: ComponentFactoryResolver,
    private changeDetector: ChangeDetectorRef,
    private photoViewerFacade: PhotoViewerFacade
  ) {}

  public frame;
  public videoTitle: string;
  public subscriptionPool = [];
  public items;
  public object = [];
  public state = 'in';
  public myData = [];
  public myTexts = [];
  public content = [];
  public myTable = [];
  public tableContent = [];
  public tableTitle = [];
  public isOpened = false;
  public animationLoop;
  public isCoworking = false;
  public componentRef;
  public chartData = [];
  public photoCase;
  public project;
  public currentPhotoName;

  @ViewChild('dynamicContainer', { read: ViewContainerRef })
  container: ViewContainerRef;

  ngOnInit() {
    const routerState = this.routerFacade.routeState$.subscribe(stateData => {
      const urlArray = stateData.state.url.split('/');
      this.currentPhotoName = urlArray[urlArray.length - 1];
      this.photoCase = urlArray[urlArray.length - 1];
      this.project = urlArray[urlArray.length - 2];
      if (this.photoCase && this.project) {
        this.photoViewerFacade.loadData(this.photoCase, this.project);
      }
    });
    this.subscriptionPool.push(routerState);

    const photoData = this.photoViewerFacade.photoData$.subscribe(data => {
      this.object = data;
    });
    this.photoViewerFacade.currentFrame$.subscribe(frameNumber => {
      this.frame = frameNumber;
      this.setCurrentPhoto();
      this.tableContent = [];
      this.calculateTableContent();
    });
    this.subscriptionPool.push(photoData);
  }

  ngAfterViewInit() {
    this.animationLoop = setInterval(() => {
      this.state = this.state === 'out' ? 'in' : 'out';
    }, 2000);
  }

  setCurrentPhoto() {
    if (this.object && this.object[this.frame]) {
      this.currentPhotoName = this.object[this.frame].image_name;
    }
  }

  createSquare() {
    this.bindElementProperty();
  }

  createChart() {
    this.dialogService
      .addAccessorDialog(this.object[0], this.isOpened)
      .subscribe(data => {
        if (data) {
          this.chartData = [...this.chartData, ...data];
          this.container.clear();
          const factory = this.resolver.resolveComponentFactory(ChartComponent);
          this.componentRef = this.container.createComponent(factory);
          this.componentRef.instance.chartData = this.chartData;
          this.componentRef.instance.object = this.object;
        }
      });
  }

  createTable() {
    clearInterval(this.animationLoop);
    this.bindTableProperty();
  }

  bindElementProperty() {
    this.dialogService
      .addAccessorDialog(this.object[0], this.isOpened)
      .subscribe(data => {
        this.isOpened = true;
        if (data) {
          this.myData = [...this.myData, ...data];
          this.content = [];
          this.calculateContent();
        }
      });
  }

  bindTableProperty() {
    this.dialogService
      .addAccessorDialog(this.object[0], this.isOpened)
      .subscribe(data => {
        this.isOpened = true;
        if (data) {
          this.myTable = [...this.myTable, ...data];
          this.tableContent = [];
          this.calculateTableContent();
          this.tableTitle = [];
          this.addTableTitle();
        }
      });
  }

  addTableTitle() {
    this.myTable.forEach(element => {
      this.tableTitle.push(element[element.length - 1]);
    });
  }

  createText() {
    this.myTexts = [...this.myTexts, 'Add text'];
  }

  calculateContent() {
    let value;
    this.myData.forEach(element => {
      value = this.object[this.frame - 1];
      element.forEach(property => {
        if (value && value[property]) {
          value = value[property];
        } else {
          value = 0;
        }
      });
      this.content = [...this.content, value];
      value = null;
    });
  }

  calculateTableContent() {
    let value;
    this.myTable.forEach(element => {
      value = this.object[this.frame];
      element.forEach(property => {
        if (value && value[property]) {
          value = value[property];
        } else {
          value = 0;
        }
      });
      this.tableContent = [...this.tableContent, value];
    });
  }

  ngOnDestroy() {
    this.subscriptionPool.forEach(sub => sub.unsubscribe());
    this.photoViewerFacade.deleteStateData();
  }
}
