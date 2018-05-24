import { Injectable } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { IpfsService } from '@service/ipfs.service';
import { CalcService } from '@service/calc.service';
import { LocalStorageService } from '@service/local-storage.service';
import * as jsPDF from 'jspdf';

declare let document: any
declare let window: any

@Injectable()
export class PdfService {

  constructor(
    private ipfs: IpfsService,
    private ls: LocalStorageService,
    private calc: CalcService,
    private currency: CurrencyPipe) {}

  /**
   * [generate description]
   * code from https://www.codementor.io/amehjoseph/convert-html-css-content-to-a-sleek-multiple-page-pdf-file-using-jspdf-javascript-library-eyyz74hci
   */
  generate(){
    let invoice = this.ls.getCurrentInvoice();

    let pdf = new jsPDF('p', 'pt', 'letter')

    let head = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Invoice 001</title>
        <style>
          body {
            font-family: helvetica, sans-serif;
            font-weight: normal;
            font-size: 16px;
            color: #495057;
          }
          #invoice-wrapper {
            margin: 12pt 12pt 12pt 12pt;
            width: 560px;
          }
          h1 {
          }
          h5 {
            margin-bottom: 9px;
            font-weight: bold;
          }
          table {
            border-collapse: collapse;
            border-spacing: 0;
            width: 100%;
            height: 100%;
            margin: 0px;
            padding: 0px;
          }
          table.invoice td,
          table.invoice th {
            border: 1px solid whitesmoke;
            vertical-align: middle;
            text-align: center;
            padding: 7px;
          }
          table.invoice th {
            color: #000000;
          }
          .logo {
            max-width: 120px;
            height: auto;
          }
          .terms {
            text-align: center;
          }
          .terms p {
            font-size: 12px;
          }
          .bold {
            font-weight: bold !important;
            font-style: bold !important;
            color: #000000;
          }
          .text-left {
            text-align: left !important;
          }
          .text-center {
            text-align: center;
          }
        </style>
      </head>
    `

    let body = `<body>
              <div id="invoice-wrapper">
                <h1>Invoice #${invoice.id}</h1>
                <hr>
                <table>
                  <tbody>
                    <tr>
                      <td>
                        <h5 class="bold">To:</h5>
                        <p>${invoice.to}</p>
                      </td>
                      <td>
                        <img src="${invoice.logo}" class="logo"></img>
                        <p>${invoice.from}</p>
                      </td>
                    </tr>
                    <tr>
                      <td></td>
                      <td>
                        <h5 class="bold">Date:</h5>
                        <p>${invoice.date}</p>
                      </td>
                    </tr>
                  </tbody>
                </table>
                <table class="invoice">
                  <thead>
                    <tr class="bold">
                      <th class="text-left"><span class="bold">Item</span></th>
                      <th>Quantity</th>
                      <th>Rate</th>
                      <th>Amount</th>
                    </tr>
                  </thead>
                  <tbody>`

    invoice.items.forEach(item => {
      let tr = `<tr>
                  <td class="text-left">${item.title}</td>
                  <td>${item.quantity}</td>
                  <td>${this.currency.transform(item.rate)}</td>
                  <td>${this.currency.transform(item.rate * item.quantity)}</td>
                </tr>`
      body += tr
    })

    body += `<tr>
                      <td></td>
                      <td></td>
                      <td class="bold">Subtotal</td>
                      <td>${this.currency.transform(this.calc.getSum(invoice))}</td>
                    </tr>
                    <tr>
                      <td></td>
                      <td></td>
                      <td class="bold">Tax</td>
                      <td>${invoice.option.value.toString() + invoice.option.config.suffix}</td>
                    </tr>
                    <tr>
                      <td></td>
                      <td></td>
                      <td class="bold">Amount Paid</td>
                      <td>${this.currency.transform(invoice.paid)}</td>
                    </tr>
                    <tr>
                      <td></td>
                      <td></td>
                      <td class="bold">Balance Due</td>
                      <td>${this.currency.transform(this.calc.getTotal(invoice))}</td>
                    </tr>
                  </tbody>
                </table>
                <div class="terms">
                  <p>${invoice.terms}</p>
                </div>
              </div>
            </body>`

    let footer = `
      </html>
    `

    let html = head + body + footer;

    window.html2pdf(html, pdf, () => {
      // pdf.save('invoice.pdf')

      let reader = new FileReader();

      reader.onloadend = (file) => {
        this.ipfs.fileCount++;

        let fileObj = {
          index: this.ipfs.fileCount,
          name: `Invoice ${invoice.id}`,
          type: 'application/pdf',
          size: file.total,
          progress: 0,
        };

        this.ipfs.onFileAdded.next(fileObj);
        this.ipfs.queue(reader.result, fileObj);
      }

      reader.readAsArrayBuffer(pdf.output('blob'));
    });
  }
}
