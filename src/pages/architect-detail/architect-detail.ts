import { ArchitectAddPage } from './../architect-add/architect-add';
import { Component } from '@angular/core';
import { IonicPage, Loading, NavController, NavParams } from 'ionic-angular';
import { ConstantProvider } from '../../providers/constant/constant';
import { DbserviceProvider } from '../../providers/dbservice/dbservice';

/**
 * Generated class for the ArchitectDetailPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-architect-detail',
  templateUrl: 'architect-detail.html',
})
export class ArchitectDetailPage { 
  karigar_detail:any={};
  loading:Loading;
  karigar_id: any;
  uploadUrl:any="";

  constructor(public navCtrl: NavController, public navParams: NavParams,public service:DbserviceProvider,public con:ConstantProvider) {
    this.karigar_id = this.navParams.get('id');
    this.uploadUrl = this.con.upload_url;


  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ArchitectDetailPage');

  }

  ionViewWillEnter()
  {
      this.getKarigarDetail();
  }

  updateProfile()
  {
      this.karigar_detail.edit_profile= 'edit_profile';
      console.log(this.karigar_detail);
      
      this.navCtrl.push(ArchitectAddPage,{'data':this.karigar_detail})
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
