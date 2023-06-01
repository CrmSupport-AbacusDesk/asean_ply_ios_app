import { HttpClient } from '@angular/common/http';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { DealerDetailPage } from './dealer-detail';
import { createTranslateLoader } from '../offers/offers.module';

@NgModule({
  declarations: [
    DealerDetailPage,
  ],
  imports: [
    IonicPageModule.forChild(DealerDetailPage),
    TranslateModule.forRoot({
      loader: {
          provide: TranslateLoader,
          useFactory: createTranslateLoader,
          deps: [HttpClient]
      }
  })
  ],
})
export class DealerDetailPageModule {}
