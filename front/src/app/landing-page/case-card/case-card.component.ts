import { Component, Input, Output, EventEmitter } from "@angular/core";

@Component({
  selector: "app-case-card",
  templateUrl: "./case-card.component.html",
  styleUrls: ["./case-card.component.scss"]
})
export class CaseCardComponent {
  @Input() postersLink: string;
  @Input() caseName: string;
  @Output() onCaseChoose = new EventEmitter<string>();
  @Output() onCaseDelete = new EventEmitter<any>();

  constructor() {}

  chooseCase(): void {
    this.onCaseChoose.emit(this.caseName);
  }
  deleteCase(event: Event) {
    event.stopPropagation();
    this.onCaseDelete.emit(this.caseName);
  }
}
