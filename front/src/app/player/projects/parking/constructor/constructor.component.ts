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

import { VideoViewerFacade } from '../../../../../@store/video-viewer/video-viewer.facade';
import { RouterFacade } from '../../../../../@store/router/router.facade';
import { DialogService } from '../../../../services/dialog.service';
import { ChartComponent } from '../../../../dinamicComponents/chart/chart.component';
import { ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-constructor',
  templateUrl: './constructor.component.html',
  styleUrls: ['./constructor.component.scss'],
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
export class ConstructorComponent implements OnInit, AfterViewInit, OnDestroy {
  constructor(
    private dialogService: DialogService,
    private playerFacade: VideoViewerFacade,
    private routerFacade: RouterFacade,
    private resolver: ComponentFactoryResolver,
    private changeDetector: ChangeDetectorRef
  ) {}

  public frame = 1;
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
  public category;

  @ViewChild('dynamicContainer', { read: ViewContainerRef })
  container: ViewContainerRef;

  ngOnInit() {
    const routerState = this.routerFacade.routeState$.subscribe(routerData => {
      const routeInfo = routerData.state.url.split('/');
      this.videoTitle = routeInfo[routeInfo.length - 1];
      this.category = routeInfo[routeInfo.length - 2];
    });
    this.subscriptionPool.push(routerState);

    // if (this.videoTitle === 'coworking') {
    //   this.category = 'Coworking';
    // } else if (
    //   this.videoTitle === 'ffmpeg_video_01_21_2020_15_15_11_fps_25-rolls'
    // ) {
    //   this.category = 'SteelRolls';
    // } else if (
    //   this.videoTitle === 'ffmpeg_video_01_21_2020_13_02_35_fps_25-baloons'
    // ) {
    //   this.category = 'CatsBalloons';
    // } else if (
    //   this.videoTitle === 'well'
    // ) {
    //   this.category = 'Well';
    // }
    this.playerFacade.loadVideo(this.videoTitle, this.category);
    this.playerFacade.videoData$.subscribe(data => {
      this.object = data;
      if (
        this.object.length > 0 &&
        this.object[0].frame_data &&
        this.object[0].frame_data.steel_rolls_count
      ) {
        clearInterval(this.animationLoop);
        this.myTable = [
          ['frame_data', 'min_confidence'],
          ['frame_data', 'steel_rolls_count']
        ];
        this.calculateTableContent();
        this.tableTitle = [];
        this.addTableTitle();
      } else if (
        this.object.length > 0 &&
        this.object[0].frame_data &&
        this.object[0].people_count
      ) {
        this.isCoworking = true;
      }
    });
    this.playerFacade.currentFrame$.subscribe(frameNumber => {
      this.frame = frameNumber;
      this.content = [];
      this.calculateContent();
      this.tableContent = [];
      this.calculateTableContent();
    });
  }

  ngAfterViewInit() {
    this.animationLoop = setInterval(() => {
      this.state = this.state === 'out' ? 'in' : 'out';
    }, 2000);
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
      value = this.object[this.frame - 1];
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
    this.playerFacade.deleteStateData();
  }
}
