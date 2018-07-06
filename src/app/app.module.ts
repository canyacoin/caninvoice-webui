import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpModule } from '@angular/http';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { AppComponent } from './app.component';
import { DatePipe, CurrencyPipe } from '@angular/common';

import { AppRoutingModule } from './app-routing.module';
import { AuthGuard } from './auth.guard';

import { AngularFireModule } from 'angularfire2';
import { AngularFireDatabaseModule } from 'angularfire2/database';
// import { AngularFireAuthModule } from 'angularfire2/auth';
import { AngularFirestoreModule } from 'angularfire2/firestore';

import { EthService } from './eth.service';

import { NgxCurrencyModule } from 'ngx-currency';

import { environment } from '../environments/environment';

import { TopComponent } from './top/top.component';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { HomeComponent } from './home/home.component';
import { PageNotFoundComponent } from './pagenotfound/pagenotfound.component';
import { PdfService } from './@service/pdf.service';
import { IpfsService } from './@service/ipfs.service';
import { FileComponent } from './file/file.component';
import { FilesListComponent } from './files-list/files-list.component';
import { LocalStorageService } from './@service/local-storage.service';
import { CalcService } from './@service/calc.service';
import { CurrencyService } from './@service/currency.service';
import { InfoService } from './@service/info.service';
import { CurrencySelectionModalComponent } from './currency-selection-modal/currency-selection-modal.component';

import { CommonLibModule } from '@canyaio/common-lib';

@NgModule({
  declarations: [
    AppComponent,
    TopComponent,
    HeaderComponent,
    FooterComponent,
    HomeComponent,
    PageNotFoundComponent,
    FileComponent,
    FilesListComponent,
    CurrencySelectionModalComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpModule,
    ReactiveFormsModule,
    FormsModule,
    AppRoutingModule,
    AngularFireModule.initializeApp(environment.firebase), // imports firebase/app needed for everything
    AngularFireDatabaseModule, // imports firebase/database, only needed for database features
    // AngularFireAuthModule, // imports firebase/auth, only needed for auth features
    AngularFirestoreModule.enablePersistence(), // imports firebase/firestore, only needed for database features
    NgxCurrencyModule,
    CommonLibModule
  ],
  providers: [AuthGuard, DatePipe, CurrencyPipe, EthService, PdfService, IpfsService, LocalStorageService, CalcService, CurrencyService, InfoService],
  bootstrap: [AppComponent],
  entryComponents: [FileComponent]
})
export class AppModule { }
