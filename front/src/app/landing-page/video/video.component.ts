import { Component, OnInit, OnDestroy } from "@angular/core";
import { HttpService } from "../../services/http.service";
import { CategoriesFacade } from "../../../@store/categories/categories.facade";
import { DialogService } from "../../services/dialog.service";
import { Subscription } from "rxjs";

@Component({
  selector: "app-video",
  templateUrl: "./video.component.html",
  styleUrls: ["./video.component.scss"]
})
export class VideoComponent implements OnInit, OnDestroy {
  public videoCategories: string[] = null;
  public videoCases: string[] = [];
  public subscriptionPool: Subscription[] = [];
  public categoryTitle: string;
  public isVideo: boolean;
  public postersLink: string[] = [];
  public chosenProject: string;
  public isLoading = true;

  constructor(
    private categoriesFacade: CategoriesFacade,
    private httpService: HttpService,
    private dialogService: DialogService
  ) {}

  ngOnInit() {
    const videoCategories = this.categoriesFacade.categories$.subscribe(
      videoCategoriesData => {
        this.videoCategories = videoCategoriesData;
      }
    );

    this.subscriptionPool.push(videoCategories);

    const categoriesLoading = this.categoriesFacade.isLoading$.subscribe(
      loadingStatus => {
        this.isLoading = loadingStatus;
      }
    );
    this.subscriptionPool.push(categoriesLoading);

    const chosenCategoryVideos = this.categoriesFacade.chosenCategoryCases$.subscribe(
      categoryVideo => {
        if (categoryVideo) {
          this.videoCases = categoryVideo.map(categoryItem => {
            const caseArray = categoryItem.split("/");
            return caseArray[caseArray.length - 1];
          });
          if (this.videoCases && this.videoCases.length > 0) {
            this.getPosters();
          }
        } else {
          this.videoCases = [];
        }
      }
    );
    this.subscriptionPool.push(chosenCategoryVideos);

    const state = this.categoriesFacade.categoryState$.subscribe(stateData => {
      this.isVideo = stateData;
      if (this.isVideo) {
        this.categoriesFacade.LoadCategories(stateData);
      }
    });
    this.subscriptionPool.unshift(state);

    const chosenCategory = this.categoriesFacade.chosenCategory$.subscribe(
      project => {
        if (project) {
          this.videoCases = null;
          this.postersLink = [];
          this.chosenProject = project;
        }
      }
    );
    this.subscriptionPool.push(chosenCategory);
  }

  chooseCategory(categoryId: string): void {
    this.categoriesFacade.chooseCategory(categoryId, this.isVideo);
    this.categoryTitle = categoryId;
  }

  chooseVideoCase(videoName: string): void {
    this.categoriesFacade.chooseVideo(videoName, this.categoryTitle);
  }

  getPosters(): void {
    this.videoCases.forEach((caseName, i) => {
      this.httpService
        .getPosterLink(caseName, this.chosenProject, this.isVideo)
        .subscribe(data => {
          this.postersLink[i] = data;
        });
    });
  }

  deleteCase(caseName: string): void {
    this.dialogService.openConfirmationDialog().subscribe(confirmation => {
      if (confirmation) {
        this.httpService
          .deleteVideoCase(caseName, this.chosenProject)
          .subscribe(response => {
            if (response) {
              this.categoriesFacade.deleteData();
              setTimeout(() => {
                this.categoriesFacade.LoadCategories(this.isVideo);
              }, 300); // костыль,если вернуть сразу, то aws возвращает список проектов включая удаленный, подумать как решить
            }
          });
      }
    });
  }

  ngOnDestroy() {
    this.subscriptionPool.forEach(subscription => subscription.unsubscribe());
    this.categoriesFacade.deleteData();
  }
}
