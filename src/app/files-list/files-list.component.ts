import { Component, OnInit, ViewChild, ComponentFactory, ComponentRef, ComponentFactoryResolver, ViewContainerRef } from '@angular/core';
import { IpfsService } from '@service/ipfs.service';
import { FileComponent } from '../file/file.component';

declare var require: any;
declare var window: any;
declare var document: any;

const filesize = require('filesize');
const _ = require('lodash');

@Component({
  selector: 'app-files-list',
  templateUrl: './files-list.component.html',
  styleUrls: ['./files-list.component.css']
})

export class FilesListComponent implements OnInit {

  @ViewChild("filesList", { read: ViewContainerRef }) container

  fileComponents: Array<any> = []

  hasNoFiles: boolean = false

  filesListAction: string

  constructor(
    private ipfs: IpfsService,
    private resolver: ComponentFactoryResolver) {

    ipfs.onFileAdded.subscribe(data => {
      this.hasNoFiles = false;
      this.listFile(data);
    });

    ipfs.onFileUpload.subscribe(data => {
      this.fileComponents[data.index].instance.pctg = data.pctg;
    });

    ipfs.onFileUploadEnd.subscribe(({ ipfsFile, fileObj }) => {
      let fileComponent = this.fileComponents[fileObj.index].instance;

      fileComponent.ipfsHash = ipfsFile.hash;
      fileComponent.renderIpfsLink();
      fileComponent.isUploading = false;
    });
  }

  ngOnInit(){}

  listFile(data) {
    const factory: ComponentFactory<any> = this.resolver.resolveComponentFactory(FileComponent);

    let file = this.container.createComponent(factory);

    file.instance.index = data.index;

    file.instance.name = data.name;

    file.instance.size = filesize(data.size);

    file.instance.pctg = '0%';

    this.fileComponents.push(file);
  }

}
