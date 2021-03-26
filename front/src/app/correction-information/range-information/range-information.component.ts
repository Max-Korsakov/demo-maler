import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-range-information',
  templateUrl: './range-information.component.html',
  styleUrls: ['./range-information.component.scss']
})
export class RangeInformationComponent {
  @Input() frameRange: any;
  @Input() timeRange: any;

  constructor() {}

  public getFrameRangeStart(): any {
    return this.frameRange.frameRangeStart;
  }

  public getFrameRangeEnd(): any {
    return this.frameRange.frameRangeEnd;
  }

  public getTimeRangeStart(): any {
    return this.timeRange.timeRangeStart;
  }

  public getTimeRangeEnd(): any {
    return this.timeRange.timeRangeEnd;
  }
}
