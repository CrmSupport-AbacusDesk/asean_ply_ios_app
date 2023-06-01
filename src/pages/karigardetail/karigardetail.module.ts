import { HttpClient } from '@angular/common/http';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { KarigardetailPage } from './karigardetail';
import { createTranslateLoader } from '../offers/offers.module';

@NgModule({
  declarations: [
    KarigardetailPage,
  ],
  imports: [
    IonicPageModule.forChild(KarigardetailPage),
    TranslateModule.forRoot({
      loader: {
          provide: TranslateLoader,
          useFactory: createTranslateLoader,
          deps: [HttpClient]
      }
  })
  ],
})
export class KarigardetailPageModule {}
