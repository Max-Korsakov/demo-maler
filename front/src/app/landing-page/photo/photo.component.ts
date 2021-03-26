import { Component, OnInit, OnDestroy } from '@angular/core';

import { CategoriesFacade } from '../../../@store/categories/categories.facade';
import { DialogService } from '../../services/dialog.service';
import { HttpService } from '../../services/http.service';
import {Subscription} from 'rxjs';
@Component({
  selector: 'app-photo',
  templateUrl: './photo.component.html',
  styleUrls: ['./photo.component.scss']
})
export class PhotoComponent implements OnInit, OnDestroy {
  public photoProjects: string[] = [];
  public photoCases: string[] = [];
  public chosenProject: string = null;
  public subscriptionPool: Subscription[] = [];
  public categoryTitle: string;
  public isVideo: boolean;
  public postersLink: string[] = [];
  public isLoading = false;


  constructor(
    private categoriesFacade: CategoriesFacade,
    private dialogService: DialogService,
    private httpService: HttpService
  ) {}

  ngOnInit() {
    const photoProjects = this.categoriesFacade.categories$.subscribe(
      categoriesData => {
        this.photoProjects = categoriesData;
      }
    );

    this.subscriptionPool.push(photoProjects);

    const loading = this.categoriesFacade.isLoading$.subscribe(loadingStatus => {
      this.isLoading = loadingStatus;
    });
    this.subscriptionPool.push(loading);
    const chosenCategory = this.categoriesFacade.chosenCategoryCases$.subscribe(
      cases => {
        if (this.chosenProject && cases) {
          this.photoCases = cases.map(caseItem => {
            const caseArray = caseItem.split('/');
            return caseArray[caseArray.length - 1];
          });
          if (this.photoCases.length > 0) {
            this.getPosters();
          }
        } else  {
          this.photoCases = [];
        }
      }
    );
    this.subscriptionPool.push(chosenCategory);

    const state = this.categoriesFacade.categoryState$.subscribe(stateData => {
      this.isVideo = stateData;
      if (this.isVideo) {
        this.categoriesFacade.LoadCategories(stateData);
      }
    });
    this.subscriptionPool.unshift(state);
  }

  chooseCategory(categoryId: string): void {
    this.categoriesFacade.chooseCategory(categoryId, this.isVideo);
    this.categoryTitle = categoryId;
    const chosenCategory = this.categoriesFacade.chosenCategory$.subscribe(
      project => {
        this.photoCases = null;
        this.postersLink = [];
        this.chosenProject = project;
      }
    );

    this.subscriptionPool.push(chosenCategory);
  }

  deleteCase( caseName: string): void {
    this.dialogService.openConfirmationDialog().subscribe(confirmation => {
      if (confirmation) {
        this.httpService
          .deletePhotoCase(caseName, this.chosenProject)
          .subscribe(response => {
            if (response) {
              this.categoriesFacade.deleteData();
              setTimeout(() => {
                this.categoriesFacade.LoadCategories(this.isVideo);
              }, 300); // костыль, aws возвращает список проектов включая удаленный, подумать как
            }
          });
      }
    });
  }

  getPosters(): void {
    this.photoCases.forEach((caseName,i) => {
      this.httpService
        .getPosterLink(caseName, this.chosenProject, this.isVideo)
        .subscribe(data => {
          this.postersLink[i] = data;
        });
    });
  }

  choosePhotoCase(photoName: string): void {
    this.categoriesFacade.choosePhoto(photoName, this.categoryTitle);
  }

  ngOnDestroy() {
    this.subscriptionPool.forEach(subscription => subscription.unsubscribe());
    this.categoriesFacade.deleteData();
  }
}
