import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { IonicPage, Loading, LoadingController, NavController, NavParams } from 'ionic-angular';
import { DbserviceProvider } from '../../../providers/dbservice/dbservice';
import { ContractorAddPage } from '../contractor-add/contractor-add';
import { ContractorDetailPage } from '../contractor-detail/contractor-detail';

/**
* Generated class for the ContractorListPage page.
*
* See https://ionicframework.com/docs/components/#navigation for more info on
* Ionic pages and navigation.
*/

@IonicPage()
@Component({
  selector: 'page-contractor-list',
  templateUrl: 'contractor-list.html',
})
export class ContractorListPage {
  data:any =[]; 
  employee_id:any;
  filter:any = {};
  filterType:any ={};
  flag:any='';
  all_count:any =0;
  pending_count : any = 0;
  approved_count : any = 0;
  reject_count : any = 0;
  loading:Loading;
  user_type: any;

  constructor(public navCtrl: NavController, public navParams: NavParams,public dbService:DbserviceProvider, public loadingCtrl:LoadingController,  public translate:TranslateService) {
    this.filter = this.dbService.get_filters();
    this.user_type=this.navParams.get("user_type");
    console.log(this.user_type);

    if(this.filter.status == undefined)
    {
      this.filter.status = 'All';
    }

  }
  
  ionViewDidLoad() {
    // this.presentLoading();
    this.contractorList();
  }
  ionViewWillEnter(){
    this.presentLoading();
    this.contractorList();
    // this.loadData('');
  }
  
  doRefresh (refresher)
  {
      this.contractorList();
      setTimeout(() => {
          refresher.complete();
      }, 1000);
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


  goOnContractorAdd(){
    this.navCtrl.push(ContractorAddPage,{'user_type':this.user_type});
  }

  goOnContractorDetail(id){
    this.navCtrl.push(ContractorDetailPage, {'id':id,'user_type':this.user_type});
  }
  
  
  contractorList(){
    this.filter.mode = 0;
    this.filter.limit = 0;
    this.dbService.post_rqst( {'contractor_id':this.dbService.karigar_id, 'filter': this.filter,'user_type':this.user_type}, 'app_karigar/get_contractor_request').subscribe( r =>
      {
        this.loading.dismiss();
        console.log(r.request_list);
        this.data = r.request_list;
        this.filter.mode = 1;
        this.all_count = r.all_count;
        this.pending_count = r.pending_count;
        this.approved_count = r.approved_count;
        this.reject_count = r.reject_count;
        // console.log(this.meetData);
      });
      
    }

    loadData(infiniteScroll)
    {
        console.log('loading');
        this.filter.limit=this.data.length;
        this.dbService.post_rqst({'filter' : this.filter,'contractor_id':this.dbService.karigar_id,},'app_karigar/get_contractor_request')
        .subscribe( (r) =>
        {
            console.log(r);
            if(r['request_list']=='')
            {
                this.flag=1;
            }
            else
            {
                setTimeout(()=>{
                    this.data=this.data.concat(r['request_list']);
                    console.log('Asyn operation has stop')
                    infiniteScroll.complete();
                },1000);
            }
        });
    }
    
  }
  