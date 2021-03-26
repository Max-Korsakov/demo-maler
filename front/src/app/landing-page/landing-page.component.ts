import { Component, OnInit, OnDestroy } from '@angular/core';
import { CategoriesFacade } from '../../@store/categories/categories.facade';
import { DialogService } from '../services/dialog.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-landing-page',
  templateUrl: './landing-page.component.html',
  styleUrls: ['./landing-page.component.scss']
})
export class LandingPageComponent implements OnInit, OnDestroy {
  public isVideo = false;
  public isNewAdd = false;
  public subscriptionPool: Subscription[] = [];

  constructor(
    private categoriesFacade: CategoriesFacade,
    private dialogService: DialogService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit() {
    const mode = this.categoriesFacade.categoryState$.subscribe(state => {
      this.isVideo = state;
      this.categoriesFacade.LoadCategories(this.isVideo);
    });
    this.subscriptionPool.push(mode);
    const categoryError = this.categoriesFacade.error$.subscribe(error => {
      if (error) {
        this.openSnackBar(error.error.message);
      }
    });
    this.subscriptionPool.push(categoryError);

  }

  openSnackBar(message) {
    this.snackBar.open(message, 'Undo', {
      duration: 3000
    });
  }

  public changeMode() {
    this.isVideo = !this.isVideo;
    this.categoriesFacade.switchCategories(this.isVideo);
  }

  public addNewCase() {
    this.dialogService.newPhotoCaseDialog().subscribe(() => {
      this.categoriesFacade.deleteData();
      this.categoriesFacade.LoadCategories(this.isVideo);
    });
  }

  ngOnDestroy() {
    this.subscriptionPool.forEach(subscription => subscription.unsubscribe());
    this.categoriesFacade.deleteData();
  }
}
