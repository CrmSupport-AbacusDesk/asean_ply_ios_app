import { HttpClient } from '@angular/common/http';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { KarigaraddPage } from './karigaradd';
import { createTranslateLoader } from '../offers/offers.module';

@NgModule({
  declarations: [
    KarigaraddPage,
  ],
  imports: [
    IonicPageModule.forChild(KarigaraddPage),
    TranslateModule.forRoot({
      loader: {
          provide: TranslateLoader,
          useFactory: createTranslateLoader,
          deps: [HttpClient]
      }
  })
  ],
})
export class KarigaraddPageModule {}
