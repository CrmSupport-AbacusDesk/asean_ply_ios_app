import { HttpClient } from '@angular/common/http';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { DealeraddPage } from './dealeradd';
import { createTranslateLoader } from '../offers/offers.module';

@NgModule({
  declarations: [
    DealeraddPage,
  ],
  imports: [
    IonicPageModule.forChild(DealeraddPage),
    TranslateModule.forRoot({
      loader: {
          provide: TranslateLoader,
          useFactory: createTranslateLoader,
          deps: [HttpClient]
      }
  })
  ],
})
export class DealeraddPageModule {}
