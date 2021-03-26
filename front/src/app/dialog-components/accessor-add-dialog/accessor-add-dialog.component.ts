import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { NeoDialogRef, NEO_DIALOG_DATA} from '@neomorphism/ng-neomorphism/neo-dialog';

@Component({
  selector: 'app-accessor-add-dialog',
  templateUrl: './accessor-add-dialog.component.html',
  styleUrls: ['./accessor-add-dialog.component.scss']
})
export class AccessorAddDialogComponent implements OnInit {
  constructor(
    public dialogRef: NeoDialogRef<AccessorAddDialogComponent>,
    @Inject(NEO_DIALOG_DATA) public data: any
  ) {}
  public isOpened = false;
  public path = [];
  public pathArray = [];

  ngOnInit() {
    this.isOpened = this.data.isOpened;
    setTimeout(() => {
      this.isOpened = true;
    }, 2000);
  }

  handleCheck(path) {
    this.pathArray = [...this.pathArray, path];
    this.path = [];
  }

  public onYesClick(): void {
    this.dialogRef.close(this.pathArray);
  }

  public onNoClick(): void {
    this.dialogRef.close(false);
  }
}
