import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { HttpClient } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { createTranslateLoader } from '../offers/offers.module';
import { KarigarListPage } from './karigar-list';

@NgModule({
  declarations: [
    KarigarListPage,
  ],
  imports: [
    IonicPageModule.forChild(KarigarListPage),
    TranslateModule.forRoot({
      loader: {
          provide: TranslateLoader,
          useFactory: createTranslateLoader,
          deps: [HttpClient]
      }
  })
  ],
})
export class KarigarListPageModule {}
