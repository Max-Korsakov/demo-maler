import { Component, Input } from '@angular/core';
import { CarCounterData } from '../../models/traffic-models';

@Component({
  selector: 'app-edited-information',
  templateUrl: './edited-information.component.html',
  styleUrls: ['./edited-information.component.scss']
})
export class EditedInformationComponent {

  @Input() newCarCounter: CarCounterData[] = [];
  @Input() oldCarCounter: CarCounterData[] = [];

  constructor() { }

  public getOldCarCounter(): CarCounterData[] {
    return this.oldCarCounter;
  }

  public getNewCarCounter(): CarCounterData[] {
    return this.newCarCounter;
  }
}
