import { HttpClient } from '@angular/common/http';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ArchitectDetailPage } from './architect-detail';
import { createTranslateLoader } from '../offers/offers.module';

@NgModule({
  declarations: [
    ArchitectDetailPage,
  ],
  imports: [
      IonicPageModule.forChild(ArchitectDetailPage),
      TranslateModule.forRoot({
        loader: {
            provide: TranslateLoader,
            useFactory: createTranslateLoader,
            deps: [HttpClient]
        }
    })
  ],
})
export class ArchitectDetailPageModule {}
