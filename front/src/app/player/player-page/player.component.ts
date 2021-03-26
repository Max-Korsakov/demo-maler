import { Component, OnInit, OnDestroy } from "@angular/core";
import { DialogService } from "../../services/dialog.service";
import { RouterFacade } from "../../../@store/router/router.facade";
import { environment } from "./../../../environments/environment";
import { PlayerFacade } from "../../../@store/video-player/video-player.facade";
import { VideoViewerFacade } from "../../../@store/video-viewer/video-viewer.facade";
import { Subscription } from "rxjs";
import { HttpService } from "../../services/http.service";

@Component({
  selector: "app-player",
  templateUrl: "./player.component.html",
  styleUrls: ["./player.component.scss"]
})
export class PlayerComponent implements OnInit, OnDestroy {
  constructor(
    private playerFacade: PlayerFacade,
    private routerFacade: RouterFacade,
    private dialogService: DialogService,
    private videoViewerFacade: VideoViewerFacade,
    private httpService: HttpService
  ) {
    this.baseUrl = `http://${location.hostname}:8000/video`;
  }

  public baseUrl: string;
  public dataSrc: string;
  public subscriptionPool: Subscription[] = [];
  public isLoading = true;
  public caseName: string;
  public project: string;

  ngOnInit() {
    const routerState = this.routerFacade.routeState$.subscribe(state => {
      const urlArray = state.state.url.split("/");
      this.caseName = urlArray[urlArray.length - 1];
      this.project = urlArray[urlArray.length - 2];
      this.httpService
        .getVideo(this.project, this.caseName)
        .subscribe(sighnedLink => {
          this.dataSrc = sighnedLink;
          this.playerFacade.setVideoURl(this.dataSrc);
        });
    });
    this.subscriptionPool.push(routerState);
    this.videoViewerFacade.loadVideo(this.caseName, this.project);
  }

  updateSettings() {
    this.dialogService.openSettingsDialog().subscribe(settings => {
      if (settings) {
        this.playerFacade.changeFPS(settings.framePerSecond);
      }
    });
  }

  ngOnDestroy() {
    this.playerFacade.deleteStateData();
    this.subscriptionPool.forEach(sub => sub.unsubscribe());
  }
}
