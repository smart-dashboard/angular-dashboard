import { Component, ViewChild, ElementRef, Input } from '@angular/core';
import { UploaderService } from '../../services/uploader.service';
import { IImage } from '../../interfaces/definitions';
import { Storage } from '../../services/storage';
import { HttpClient, HttpHeaders } from '@angular/common/http';
declare var require: any;
const uuid = require('uuid/v1');

@Component({
  selector: 'app-upload',
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.scss']
})
export class UploadComponent {
  public active = false;
  @Input('storage') public storage: Storage = null;
  @ViewChild('inputFile') fileuploader: ElementRef;
  @Input('Active') public set Active(value: boolean) {
    this.active = value;
  }
  public progressIsActive = false;
  public windowUploader = false;
  public progressPrecent: Number;

  constructor(
    private _ub: UploaderService,
    private http: HttpClient
  ) { }

  activeUploader() {
    this.active = this.active ? false : true;
  }

  public UploadToCloud (files) {
    console.warn('Now uploading to cloud: ', files);
  }
  uploader() {
    const files = this.fileuploader.nativeElement.files;
    this.uploadHandler(files);
  }

  // @todo check for lack of memory
  uploadHandler(files) {
    this.UploadToCloud(files);
    for (const _file of files) {
      this.progressPrecent = 0;
      this.progressIsActive = true;
      const file: File = _file;
      const img = new Image;
      let width = 0,
      height = 0;
      const reader: FileReader = new FileReader();
      reader.onloadend = (e) => {
        const formData = new FormData();
        // formData.append('file', reader.result);
        formData.append('filename', file.name);
        const headers = new HttpHeaders({ 'enctype': 'multipart/form-data' });
        this.http.post('http://localhost:1337/ngmedia/upload', formData, { headers: headers }).subscribe(
          (response) => {
            console.log(response);
          },
          (response) => {
            console.log(response);
          }
        );

        // img.src = reader.result;
        img.onload = () => {
          width = img.width;
          height = img.height;
          const item =  {
            id: uuid(),
            src: reader.result,
            name: file.name,
            size: file.size,
            type: file.type,
            width: width,
            height: height,
            createdAt: new Date(),
            updatedAt: new Date(),
            uploadedBy: 'Admin'
          } as IImage;
          this.storage.CreateItem(item);
        };
      };
      reader.readAsDataURL(file);
    }
  }

  eventHandler(e) {
    const ele = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - ele.left;
    const y = e.clientY - ele.top;
    switch (e.type) {
      case 'dragover':
        e.preventDefault();
      break;
      case 'dragenter':
        e.preventDefault();
        this.windowUploader = true;
      break;
      case 'dragleave':
        if (x >= ele.width || y >= ele.height || x < 0 || y < 0) {
          this.windowUploader = false;
        }
      break;
    }
  }

  setToFileUploader(e) {
    e.preventDefault();
    this.windowUploader = false;
    this.uploadHandler(e.dataTransfer.files);
  }
}
