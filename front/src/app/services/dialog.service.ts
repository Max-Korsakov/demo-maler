import { Injectable } from '@angular/core';
import { NeoDialog} from '@neomorphism/ng-neomorphism/neo-dialog';

import { SettingsDialogComponent } from '../dialog-components/settings-dialog/settings-dialog.component';
import { ConfirmationDialogComponent } from '../dialog-components/confirmation-dialog/confirmation-dialog.component';
import { AccessorAddDialogComponent } from '../dialog-components/accessor-add-dialog/accessor-add-dialog.component';
import { Observable } from 'rxjs';
import { NewPhotoDialogComponent } from '../dialog-components/new-photo-dialog/new-photo-dialog.component';

@Injectable({
  providedIn: 'root'
})
export class DialogService {
  constructor(private dialog: NeoDialog) {}

  public openSettingsDialog() {
    const dialogRef = this.dialog.open(SettingsDialogComponent, {
      panelClass: 'custom-dialog-container',
      width: '600px',
      height: '400px',
      data: {
        buttons: {
          no: 'No',
          yes: 'Save'
        }
      }
    });
    return dialogRef.afterClosed();
  }

  public openConfirmationDialog(): Observable<boolean> {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      panelClass: 'custom-dialog-container',
      width: '420px',
      height: '300px',
      data: {
        title: 'Confirm your action',
        text: 'This action can not be canceled. Are you sure?',
        buttons: {
          no: 'No',
          yes: 'Yes'
        }
      }
    });
    return dialogRef.afterClosed();
  }

  public addAccessorDialog(object, isOpened): Observable<any> {
    const dialogRef = this.dialog.open(AccessorAddDialogComponent, {
      panelClass: 'custom-dialog-container',
      width: '600px',
      height: '800px',
      data: {
        object,
        isOpened,
        title: 'Bind property',
        buttons: {
          no: 'No',
          yes: 'Yes'
        }
      }
    });
    return dialogRef.afterClosed();
  }

  public newPhotoProjectDialog(): Observable<any> {
    const dialogRef = this.dialog.open(NewPhotoDialogComponent, {
      panelClass: 'custom-dialog-container',
      width: '600px',
      height: '800px',
      data: {
        title: 'New project',
        buttons: {
          no: 'No',
          yes: 'Yes'
        }
      }
    });
    return dialogRef.afterClosed();
  }

  public newPhotoCaseDialog(): Observable<any> {
    const dialogRef = this.dialog.open(NewPhotoDialogComponent, {
      panelClass: 'custom-dialog-container',
      width: '600px',
      height: 'auto',
      backdropClass: 'backdropBackground',
      data: {
        title: 'New case',
        buttons: {
          no: 'Refuse',
          yes: 'Upload'
        }
      }
    });
    return dialogRef.afterClosed();
  }
}
