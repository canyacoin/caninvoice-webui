import { Injectable } from '@angular/core';
import * as jsPDF from 'jspdf';

declare let document: any
declare let window: any
// declare let require: any

// const pdf = require('html-pdf');

@Injectable()
export class PdfService {

  constructor() { }

  /**
   * [generate description]
   * code from https://www.codementor.io/amehjoseph/convert-html-css-content-to-a-sleek-multiple-page-pdf-file-using-jspdf-javascript-library-eyyz74hci
   */
  generate(){
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
            width: 180px;
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
                <h1>Invoice #001</h1>
                <hr>
                <table>
                  <tbody>
                    <tr>
                      <td>
                        <h5 class="bold">To:</h5>
                        <p>Vitalik But. Level 1 520 Bourke St Melbourne, VIC Australia</p>
                      </td>
                      <td>
                        <img src="assets/img/logo-media.png" class="logo"></img>
                        <p>Vitalik But. Level 1 520 Bourke St Melbourne, VIC Australia</p>
                      </td>
                    </tr>
                    <tr>
                      <td></td>
                      <td>
                        <h5 class="bold">Date:</h5>
                        <p>05/22/2018</p>
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
                  <tbody>
                    <tr>
                      <td class="text-left">Custom logo + style guide</td>
                      <td>1</td>
                      <td>$200.00</td>
                      <td>$200.00</td>
                    </tr>
                    <tr>
                      <td></td>
                      <td></td>
                      <td class="bold">Subtotal</td>
                      <td>$200.00</td>
                    </tr>
                    <tr>
                      <td></td>
                      <td></td>
                      <td class="bold">Tax</td>
                      <td>0%</td>
                    </tr>
                    <tr>
                      <td></td>
                      <td></td>
                      <td class="bold">Amount Paid</td>
                      <td>$0.00</td>
                    </tr>
                    <tr>
                      <td></td>
                      <td></td>
                      <td class="bold">Balance Due</td>
                      <td>$200.00</td>
                    </tr>
                  </tbody>
                </table>
                <div class="terms">
                  <p>Terms: To be paid in CanYaCoin 7 days from date of invoice, late payments will incur a 20% extra charge. ETH address: 0x24b2e8C86Cc5a378b184b64728dB1A8484D844eC.</p>
                </div>
              </div>
            </body>
                `

    let footer = `
      </html>
    `

    let html = head + body + footer;

    window.html2pdf(html, pdf, () => {
      pdf.save('invoice.pdf')
    });
  }

}
