import { HttpClient } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { IonicPageModule } from 'ionic-angular';
import { createTranslateLoader } from '../offers/offers.module';
import { ArchitectListPage } from './architect-list';

@NgModule({
  declarations: [
    ArchitectListPage,
  ],
  imports: [
    IonicPageModule.forChild(ArchitectListPage),
    TranslateModule.forRoot({
      loader: {
          provide: TranslateLoader,
          useFactory: createTranslateLoader,
          deps: [HttpClient]
      }
  })
  ],
})
export class ArchitectListPageModule {}
