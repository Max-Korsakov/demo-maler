import { Component, OnInit, Input, Output, EventEmitter, ChangeDetectionStrategy, ChangeDetectorRef, OnDestroy } from '@angular/core';

@Component({
  selector: 'app-parse-element',
  templateUrl: './parse-element.component.html',
  styleUrls: ['./parse-element.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ParseElementComponent implements OnInit, OnDestroy {
  constructor(private detector: ChangeDetectorRef) {}

  @Input() parseData;
  @Input() path;
  @Output()
  onCheck = new EventEmitter();
  public mappedData;


  @Output() onArrowClick = new EventEmitter();


  ngOnInit() {
    if (this.parseData && this.parseData.object) {
      this.mappedData = this.mapDataToIterable(this.parseData.object);
    } else {
      this.mappedData = this.parseData;
    }
    this.detector.detectChanges();
  }

  mapDataToIterable(dataObject) {
    const iterableArray = [];
    for (const key in dataObject) {
      if (typeof dataObject[key] !== 'object') {
        const obj = {};
        obj[key] = dataObject[key];
        iterableArray.push(obj);
      } else {
        const obj = {};
        const childArray = this.mapChildToIterable(dataObject[key]);
        obj[key] = childArray;
        // tslint:disable-next-line: no-string-literal
        obj['isExpanded'] = false;
        iterableArray.push(obj);
      }
    }
    return iterableArray;
  }

  mapChildToIterable(object) {
    const iterableChild = [];
    for (const key in object) {
      if (typeof object[key] !== 'object') {
        const obj = {};
        obj[key] = object[key];
        iterableChild.push(obj);

      } else {
        const obj = {};
        const childArray = this.mapChildToIterable(object[key]);
        obj[key] = childArray;
        // tslint:disable-next-line: no-string-literal
        obj['isExpanded']  = false;
        iterableChild.push(obj);
      }
    }
    return iterableChild;
  }

  checkObjectType(object) {
    if (this.checkIsArray(object)) {
      return this.mappedData;
    } else {
      const key = this.getKeyName(object);
      return object[key];
    }

  }

  checkIsObject(item) {
    const key = Object.keys(item)[0];
    return item[key] instanceof Object;
  }

  checkIsArray(item) {
    return Array.isArray(item);
  }

  getKeyName(key) {
    return Object.keys(key)[0];
  }

  getChildElements(key) {
    const property = this.getKeyName(key);
    return property;
  }

  handleArrowClick(key, i) {
    this.checkObjectType(this.mappedData).forEach((element, index) => {
      if (index !== i) {
        element.isExpanded = false;
      }
    });
    key.isExpanded = !key.isExpanded;
  }

  clickCheck(key) {
    this.path.push(this.getKeyName(key));
    this.handleCheck(this.path);
  }

  handleCheck = (path) => {
    this.onCheck.emit(path);
  }

  handleExpandClick = childPath => {
    this.onArrowClick.emit(childPath);
  }

  getChildPath = i => {
    return [...(this.path ? this.path : []), i];
  }

  ngOnDestroy() {
    this.checkObjectType(this.mappedData).forEach(node => {
      node.isExpanded = false;
    });
  }
}
