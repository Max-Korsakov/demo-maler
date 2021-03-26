import { Component, ViewChild, Input, OnDestroy, AfterViewInit, EventEmitter, Output } from '@angular/core';
import { TemplatePortal } from '@angular/cdk/portal';
import { OverlayRef, Overlay, ConnectedPosition, FlexibleConnectedPositionStrategy } from '@angular/cdk/overlay';

@Component({
  selector: 'app-widget',
  templateUrl: './widget.component.html',
  styleUrls: ['./widget.component.scss']
})
export class WidgetComponent implements OnDestroy, AfterViewInit {

  @ViewChild('widget', { static: true} ) widget: TemplatePortal;
  @Input() connectedElement: HTMLElement;
  @Input() header: string;
  @Output() closeWidget = new EventEmitter();

  private overlay: OverlayRef;

  constructor(private overlayService: Overlay) { }

  public onCloseWidget(): void {
    this.closeWidget.next();
  }

  private createPositionToConnectedElement(element: HTMLElement) {
    const connectedPosition = { 
      originX: 'center', 
      originY: 'center', 
      overlayX: 'center', 
      overlayY: 'center' 
    } as ConnectedPosition;
    return this.overlayService.position()
      .flexibleConnectedTo(element)
      .withPositions([connectedPosition])
      .withDefaultOffsetX(5)
      .withDefaultOffsetY(5);
  }

  private createDeafultPostion() {
    return this.overlayService.position()
      .global()
      .centerHorizontally()
      .centerVertically()
  }

  ngAfterViewInit() {
    const positionStrategy = this.connectedElement 
      ? this.createPositionToConnectedElement(this.connectedElement) 
      : this.createDeafultPostion();

    this.overlay = this.overlayService.create({
      positionStrategy
    })

    this.overlay.attach(this.widget);
  }

  ngOnDestroy() {
    this.overlay.detach();
  }
}
