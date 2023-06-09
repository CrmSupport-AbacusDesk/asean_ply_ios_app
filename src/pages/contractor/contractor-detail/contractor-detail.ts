import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { IonicPage, Loading, LoadingController, NavController, NavParams } from 'ionic-angular';
import { DbserviceProvider } from '../../../providers/dbservice/dbservice';

/**
* Generated class for the ContractorDetailPage page.
*
* See https://ionicframework.com/docs/components/#navigation for more info on
* Ionic pages and navigation.
*/

@IonicPage()
@Component({
  selector: 'page-contractor-detail',
  templateUrl: 'contractor-detail.html',
})
export class ContractorDetailPage {
  id:any
  conDetail:any = {};
  loading:Loading;
  user_type: any;
  constructor(public navCtrl: NavController, public navParams: NavParams, public dbService:DbserviceProvider, public loadingCtrl:LoadingController, public translate:TranslateService) {
    this.user_type=this.navParams.get("user_type");
    
 
  }
  
  ionViewDidLoad() {
    this.id = this.navParams.get('id');
    this.presentLoading();
    this.contractorDetail();
  }
  
  
  presentLoading() 
  {
    this.translate.get("Please wait...")
    .subscribe(resp=>{
      this.loading = this.loadingCtrl.create({
        content: resp,
        dismissOnPageChange: false
      });
      this.loading.present();
    })
  }
  
  
  contractorDetail(){
    this.dbService.post_rqst( {'id':this.id}, 'app_karigar/get_contractor_request_detail').subscribe( r =>
      {
        this.loading.dismiss();
        this.conDetail = r.request_detail[0];
      });
    }
  }
  