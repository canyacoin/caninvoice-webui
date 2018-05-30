import { Component, OnInit, ViewChild, ComponentFactory, ComponentRef, ComponentFactoryResolver, ViewContainerRef } from '@angular/core';
import { IpfsService } from '@service/ipfs.service';
import { InfoService } from '@service/info.service';
import { LocalStorageService } from '@service/local-storage.service';
import { FileComponent } from '../file/file.component';

declare var require: any;
declare var window: any;
declare var document: any;

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
    private ls: LocalStorageService,
    private info: InfoService,
    private resolver: ComponentFactoryResolver) {

    info.onRemoveFiles.subscribe(filesIndexes => {
      filesIndexes.forEach(index => {
        _.remove(this.fileComponents, comp => {
          if (comp.instance.ipfsHash == index) {
            comp.destroy();
          }

          return comp.instance.index == index;
        });
      });
    });

    ipfs.onFileAdded.subscribe(data => {
      this.hasNoFiles = false;
      this.listFile(data);
    });

    ipfs.onFileUpload.subscribe(data => {
      this.fileComponents[data.index].instance.pctg = data.pctg;
    });

    ipfs.onStreamEnd.subscribe(data => {
      this.fileComponents[data.index].instance.streamEnded = true;
    });

    ipfs.onFileUploadEnd.subscribe(({ ipfsFile, fileObj }) => {
      let fileComponent = this.fileComponents[fileObj.index].instance;

      let fileExists = this.ls.getCurrentInvoice().ipfsHash == ipfsFile.hash;
      if (fileExists) {
        this.fileComponents[fileObj.index].destroy();
        delete this.fileComponents[fileObj.index];
        return false;
      }

      fileComponent.ipfsHash = ipfsFile.hash;
      fileComponent.renderIpfsLink();
      fileComponent.isUploading = false;
      fileComponent.streamEnded = false;

      this.ls.updateCurrentInvoice({ipfsHash: ipfsFile.hash});
    });
  }

  ngOnInit(){}

  listFile(data) {
    const factory: ComponentFactory<any> = this.resolver.resolveComponentFactory(FileComponent);

    let file = this.container.createComponent(factory);

    file.instance.index = data.index;

    file.instance.name = data.name;

    file.instance.size = data.size;

    file.instance.pctg = '0%';

    this.fileComponents.push(file);
  }

}
