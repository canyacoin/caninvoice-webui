import { Injectable } from '@angular/core';
import * as jsPDF from 'jspdf';

declare let document: any
declare let window: any

@Injectable()
export class PdfService {

  constructor() { }

  /**
   * [generate description]
   * code from https://www.codementor.io/amehjoseph/convert-html-css-content-to-a-sleek-multiple-page-pdf-file-using-jspdf-javascript-library-eyyz74hci
   */
  generate(){
    let margins = {
      top: 70,
      bottom: 40,
      left: 30,
      width: 550
    }

    let pdf = new jsPDF('p', 'pt', 'a4')

    // pdf.setFontSize(18)
    // pdf.canvas.height = 612;
    // pdf.canvas.width = 792;

    window.html2pdf(document.getElementById('pdf-content'), pdf, () => {
      pdf.save('invoice.pdf')
    });

    // pdf.fromHTML(document.getElementById('pdf-content'),
    //   margins.left, // x coord
    //   margins.top,
    //   {
    //     width: margins.width // max width of content on PDF
    //   }, function(dispose) {
    //     // headerFooterFormatting(pdf)
    //   },
    //   margins)

    // pdf.save('invoice.pdf')

  }

}
