import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { HttpClient } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { createTranslateLoader } from '../offers/offers.module';
import { DealerListPage } from './dealer-list';

@NgModule({
  declarations: [
    DealerListPage,
  ],
  imports: [
    IonicPageModule.forChild(DealerListPage),
    TranslateModule.forRoot({
      loader: {
          provide: TranslateLoader,
          useFactory: createTranslateLoader,
          deps: [HttpClient]
      }
  })
  ],
})
export class DealerListPageModule {}
