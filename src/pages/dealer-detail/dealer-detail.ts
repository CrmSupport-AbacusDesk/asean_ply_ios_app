import { Component } from '@angular/core';
import { IonicPage, Loading, NavController, NavParams } from 'ionic-angular';
import { DbserviceProvider } from '../../providers/dbservice/dbservice';

/**
 * Generated class for the DealerDetailPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-dealer-detail',
  templateUrl: 'dealer-detail.html',
})
export class DealerDetailPage { 
  karigar_detail:any={};
  loading:Loading;
  karigar_id: any;
  constructor(public navCtrl: NavController, public navParams: NavParams,public service:DbserviceProvider) {
    this.karigar_id = this.navParams.get('id');

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad DealerDetailPage');
  }

  ionViewWillEnter()
  {
      this.getKarigarDetail();
  }
  getKarigarDetail()
  {
      console.log('karigar');
      
      this.service.post_rqst( {'karigar_id': this.karigar_id },'app_karigar/karigarDetail')
      .subscribe((r) =>
      {
          console.log(r);
          this.karigar_detail=r.karigar;
          console.log(this.karigar_detail);

          this.loading.dismiss();
      });
  }

}
