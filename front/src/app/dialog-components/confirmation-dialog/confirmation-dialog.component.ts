import { Component, Inject, OnChanges } from '@angular/core';
//import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { NeoDialogRef, NEO_DIALOG_DATA} from '@neomorphism/ng-neomorphism/neo-dialog';
@Component({
  selector: 'app-confirmation-dialog',
  templateUrl: './confirmation-dialog.component.html',
  styleUrls: ['./confirmation-dialog.component.scss'],
})
export class ConfirmationDialogComponent {
  public confirmationPassword = null;
  public currentPassword = 'catsAndBalloons';

  constructor(
    public dialogRef: NeoDialogRef<ConfirmationDialogComponent>,
    @Inject(NEO_DIALOG_DATA) public data: any
  ) {}

  public onYesClick(): void {
    this.dialogRef.close(true);
  }

  public onNoClick(): void {
    this.dialogRef.close(false);
  }
}
