import { Component, Input, Output, EventEmitter } from '@angular/core';
import { PdfService } from '@service/pdf.service';

declare var window: any

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  title = 'app'

  self: AppComponent

  constructor(
    public pdf: PdfService) {

    this.self = this

  }

  onPrint(){
    window.print()
  }
}
