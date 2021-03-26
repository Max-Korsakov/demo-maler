import { Component, Inject } from "@angular/core";
//import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import {
  NeoDialogRef,
  NEO_DIALOG_DATA,
} from "@neomorphism/ng-neomorphism/neo-dialog";
@Component({
  selector: "app-settings-dialog",
  templateUrl: "./settings-dialog.component.html",
  styleUrls: ["./settings-dialog.component.scss"],
})
export class SettingsDialogComponent {
  public framePerSecond = 25;
  public firstFrameNumber = 1;

  constructor(
    public dialogRef: NeoDialogRef<SettingsDialogComponent>,
    @Inject(NEO_DIALOG_DATA) public data: any
  ) {}

  public onYesClick(): void {
    this.dialogRef.close({
      framePerSecond: this.framePerSecond,
      // firstFrameNumber: this.firstFrameNumber
    });
  }

  public onNoClick(): void {
    this.dialogRef.close(false);
  }
}
