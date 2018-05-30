import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

@Injectable()
export class InfoService {

  onRemoveFiles: Subject<any> = new Subject<any>()

  selectedFiles: Array<any> = []

  constructor() { }

  removeFiles(filesIndexes){
    this.onRemoveFiles.next(filesIndexes);
    this.selectedFiles = [];
  }

}
