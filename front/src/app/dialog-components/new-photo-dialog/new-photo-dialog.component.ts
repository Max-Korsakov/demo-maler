import { Component, Inject, OnInit, OnDestroy } from '@angular/core';
//import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { CategoriesFacade } from '../../../@store/categories/categories.facade';
import { Subscription } from 'rxjs';
import { NeoDialogRef, NEO_DIALOG_DATA} from '@neomorphism/ng-neomorphism/neo-dialog';

import { HttpService } from '../../services/http.service';
import { from } from 'rxjs';

@Component({
  selector: 'app-new-photo-dialog',
  templateUrl: './new-photo-dialog.component.html',
  styleUrls: ['./new-photo-dialog.component.scss']
})
export class NewPhotoDialogComponent implements OnInit, OnDestroy {
  public framePerSecond = 25;
  public firstFrameNumber = 1;
  public images: any = [];
  public jsonDataFile: any;
  public size = 0;
  public categories: string[];
  public imageUrls: string[] = [];
  public dataFile: any;
  public isOldProjects = true;
  public subscriptionPool: Subscription[] = [];
  public showDeleteButton = false;
  public jsonError = false;
  public imageError = false;
  public notAllData = true;
  public isVideo = true;
  public previewImage: any;
  public isUploadInProgress = false;
  public canvasInput: any;
  public canvasInputCtx: any;

  constructor(
    private categoriesFacade: CategoriesFacade,
    private http: HttpService,
    public dialogRef: NeoDialogRef<NewPhotoDialogComponent>,
    @Inject(NEO_DIALOG_DATA) public data: any
  ) {}

  myForm = new FormGroup({
    projectControl: new FormControl('', [
      Validators.required,
      Validators.pattern(/^[A-z0-9]*$/)
    ]),
    name: new FormControl('', [
      Validators.required,
      Validators.pattern(/^[A-z0-9]*$/)
    ]),
    file: new FormControl('', [Validators.required]),
    json: new FormControl('', [Validators.required]),
    fileSource: new FormControl('', [Validators.required])
  });

  ngOnInit() {
    const cats = this.categoriesFacade.categories$.subscribe(categories => {
      this.categories = categories;
    });

    this.subscriptionPool.push(cats);

    const viewState = this.categoriesFacade.categoryState$.subscribe(state => {
      this.isVideo = state;
    });
    this.subscriptionPool.push(viewState);
  }

  get f() {
    return this.myForm.controls;
  }

  checkIsFormReadyToSubmit() {
    if (
      this.dataFile &&
      this.imageUrls.length > 0 &&
      this.myForm.value.name &&
      this.myForm.value.projectControl &&
      !this.f.projectControl.hasError('pattern') &&
      !this.f.name.hasError('pattern')
    ) {
      this.notAllData = false;
    } else {
      this.notAllData = true;
    }
  }

  onJsonFileChange(event) {
    if (
      event &&
      event.target.files &&
      event.target.files[0] &&
      event.target.files[0].type.match('application/json')
    ) {
      const reader = new FileReader();
      const file = event.target.files[0];
      this.dataFile = file;
      reader.onload = (event: any) => {
        this.jsonDataFile = {
          name: file.name,
          data: event.target.result,
          size: file.size
        };
        this.sumSize();
        this.checkIsFormReadyToSubmit();
      };

      reader.readAsText(file);
    } else {
      this.showJsonErrorMessage();
      this.f.json.reset();
    }
  }

  showJsonErrorMessage() {
    this.jsonError = true;
    setTimeout(() => {
      this.jsonError = false;
    }, 2500);
  }

  validateFile(event) {
    if (this.isVideo) {
      return (
        event.target.files &&
        event.target.files[0] &&
        event.target.files[0].type.match('video/mp4')
      );
    } else {
      return (
        event.target.files &&
        event.target.files[0] &&
        event.target.files[0].type.match('image.*')
      );
    }
  }

  onFileChange(event) {
    if (event && this.validateFile(event)) {
      if (this.isVideo) {
        this.deletePhoto(0);
      }
      const filesAmount = event.target.files.length;
      for (let i = 0; i < filesAmount; i++) {
        const file = event.target.files[i];
        const reader = new FileReader();
        reader.onload = (event: any) => {
          const uploadedFile = {
            name: file.name,
            size: file.size,
            data: event.target.result
          };
          this.images = [...this.images, uploadedFile];
          this.imageUrls = [...this.imageUrls, file];
          this.myForm.patchValue({
            fileSource: this.images
          });
          this.sumSize();
          this.checkIsFormReadyToSubmit();
          this.f.file.reset();
          if (this.isVideo && this.images.length > 0) {
            setTimeout(this.setVideoPreview.bind(this), 0);
          }
        };
        reader.readAsDataURL(event.target.files[i]);
      }
    } else {
      this.showImageErrorMessage();
      this.f.file.reset();
    }
  }

  setVideoPreview() {
    const video: HTMLVideoElement = document.querySelector('.hide-from-view');
    if (!video.oncanplay) {
      video.oncanplay = () => {
        this.canvasInput = document.querySelector('.preview-video');
        let scale = 1;
        let adjustWidth = video.videoWidth;
        while (adjustWidth > 280) {
          adjustWidth = video.videoWidth * scale;
          scale = scale - 0.01;
        }
        this.canvasInput.width = video.videoWidth * scale;
        this.canvasInput.height = video.videoHeight * scale;
        this.canvasInputCtx = this.canvasInput.getContext('2d');
        const drowImage = () => {
          this.canvasInputCtx.drawImage(
            video,
            0,
            0,
            this.canvasInput.width,
            this.canvasInput.height
          );
          this.previewImage = new Image();
          this.previewImage.width = this.canvasInput.width;
          this.previewImage.height = this.canvasInput.height;
          const ImageData = this.canvasInputCtx.getImageData(
            0,
            0,
            this.canvasInput.height,
            this.canvasInput.width
          );
          this.previewImage.src = getImageURL.call(this, ImageData);
          function getImageURL(imgData) {
            this.canvasInputCtx.putImageData(imgData, 0, 0);
            return this.canvasInput.toDataURL();
          }
          const imgContainer = document.querySelector('.preview-container_video');
          imgContainer.append(this.previewImage);
          video.pause();
          this.canvasInput.remove();
        };
        video.play();
        setTimeout(drowImage, 1000);
      };
    }

    video.setAttribute('src', `${this.images[0].data}`);
  }

  showImageErrorMessage() {
    this.imageError = true;
    setTimeout(() => {
      this.imageError = false;
    }, 2500);
  }

  deletePhoto(index) {
    this.images = this.images.filter((img, i) => {
      if (i !== index) {
        return this.images[i];
      }
    });
    this.imageUrls = this.imageUrls.filter((img, i) => {
      if (i !== index) {
        return this.images[i];
      }
    });
    this.sumSize();
    this.checkIsFormReadyToSubmit();
  }

  deleteFile() {
    this.jsonDataFile = null;
    this.dataFile = null;
    this.sumSize();
    this.checkIsFormReadyToSubmit();
    this.f.json.reset();
  }

  public sumSize() {
    this.size = 0;
    this.images.forEach(photo => {
      this.size = this.size + photo.size;
    });
    if (this.jsonDataFile && this.jsonDataFile.size) {
      this.size = this.size + this.jsonDataFile.size;
    }
  }

  newProjectButtonClickHandler() {
    this.isOldProjects = !this.isOldProjects;
  }

  dataURItoFile(dataURI) {
    const arr = dataURI.split(',');
    const mime = arr[0].match(/:(.*?);/)[1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);

    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }

    return new File([u8arr], 'preview.png', { type: mime });
  }

  public onYesClick(): void {
    const formData = new FormData();
    if (this.jsonDataFile && this.jsonDataFile.name && this.jsonDataFile.data) {
      formData.append('jsonData', this.dataFile);
    }
    for (let i = 0; i < this.imageUrls.length; i++) {
      formData.append('uploads', this.imageUrls[i]);
    }
    if (this.isVideo) {
      const previewFile = this.dataURItoFile(this.previewImage.src);
      formData.append('preview', previewFile);
    }
    let jsonFileName;
    if (this.jsonDataFile) {
      jsonFileName = this.jsonDataFile.name;
    }
    this.http
      .uploadNewCase(
        formData,
        this.myForm.value.name,
        this.myForm.value.projectControl,
        this.isVideo,
        jsonFileName
      )
      .subscribe(response => {
        if (response) {
          this.isUploadInProgress = true;
        }
        if (response && response.status === 'loaded') {
          this.isUploadInProgress = false;
          this.dialogRef.close({ response });
        }
      });
  }

  public onNoClick(): void {
    this.dialogRef.close(false);
  }

  ngOnDestroy(): void {
    this.subscriptionPool.forEach(sub => sub.unsubscribe());
  }
}
