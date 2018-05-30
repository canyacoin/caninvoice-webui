import { Injectable } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { IpfsService } from '@service/ipfs.service';
import { CalcService } from '@service/calc.service';
import { CurrencyService } from '@service/currency.service';
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
    private currency: CurrencyPipe,
    private currencyService: CurrencyService) {}

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
            font-size: 12px;
            color: #6c757d;
          }
          #invoice-wrapper {
            margin: 12pt 12pt 12pt 12pt;
            width: 560px;
          }
          h1 {
            font-size: 24px;
          }
          h5 {
            margin-bottom: 9px;
            font-weight: bold;
            font-size: 12px;
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
            margin-bottom: 42px;
            text-align: center;
          }
          .terms p {
            font-size: 12px;
          }
          .plug {
            text-align: center;
          }
          .bold {
            font-weight: bold !important;
            font-style: bold !important;
          }
          .text-left {
            text-align: left !important;
          }
          .text-center {
            text-align: center;
          }
          .mb {
            margin-bottom: 12pt;
          }
          .black {
            color: #000000;
          }
        </style>
      </head>
    `

    let body = `<body>
              <div id="invoice-wrapper">
                <h1 class="black">Invoice #${invoice.id}</h1>
                <hr>
                <table class="mb">
                  <tbody>
                    <tr>
                      <td colspan="1">
                        <h5 class="bold black">To:</h5>
                        <p>${invoice.to}</p>
                      </td>
                      <td colspan="1">
                        <img src="${invoice.logo}" class="logo"></img>
                      </td>
                    </tr>
                    <tr>
                      <td colspan="1">
                        <h5 class="bold black">Date:</h5>
                        <p>${invoice.date}</p>
                      </td>
                      <td colspan="1">
                        <h5 class="bold black">From:</h5>
                        <p>${invoice.from}</p>
                      </td>
                    </tr>
                  </tbody>
                </table>
                <table class="invoice mb">
                  <thead>
                    <tr class="bold black">
                      <th class="text-left"><span class="bold black">Item</span></th>
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
                  <td>${this.currency.transform(item.rate, this.currencyService.code, 'code')}</td>
                  <td>${this.currency.transform(item.rate * item.quantity, this.currencyService.code, 'code')}</td>
                </tr>`
      body += tr
    })

    body += `<tr>
                      <td></td>
                      <td></td>
                      <td class="bold black">Subtotal</td>
                      <td>${this.currency.transform(this.calc.getSum(invoice), this.currencyService.code, 'code')}</td>
                    </tr>
                    <tr>
                      <td></td>
                      <td></td>
                      <td class="bold black">Tax</td>
                      <td>${invoice.option.value.toString() + invoice.option.config.suffix}</td>
                    </tr>
                    <tr>
                      <td></td>
                      <td></td>
                      <td class="bold black">Amount Paid</td>
                      <td>${this.currency.transform(invoice.paid, this.currencyService.code, 'code')}</td>
                    </tr>
                    <tr>
                      <td></td>
                      <td></td>
                      <td class="bold black">Balance Due</td>
                      <td>${this.currency.transform(this.calc.getTotal(invoice), this.currencyService.code, 'code')}</td>
                    </tr>
                  </tbody>
                </table>
                <div class="terms">
                  <h5 class="bold black">Terms</h5>
                  <p>${invoice.terms}</p>
                </div>
                <div class="plug">
                  <small>Make invoices for free at <a href="https://caninvoice.io">caninvoice.io</a></small>
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
