import { DbserviceProvider } from './../../providers/dbservice/dbservice';
import { KarigardetailPage } from './../karigardetail/karigardetail';
import { KarigaraddPage } from './../karigaradd/karigaradd';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, Loading } from 'ionic-angular';

/**
 * Generated class for the KarigarListPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-karigar-list',
  templateUrl: 'karigar-list.html',
})
export class KarigarListPage {
  loading:Loading;
  filter:any = {};
  flag:any='';
  karigar_list: string = "Pending";
  karigars: any[];


  constructor(public navCtrl: NavController, public navParams: NavParams, public dbService:DbserviceProvider, public loadingCtrl:LoadingController,) {
    this.getKarigarList(this.karigar_list, '');

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad KarigarListPage');
  }


  presentLoading()
  {
    this.loading = this.loadingCtrl.create({
      content: "Please wait...",
      dismissOnPageChange: true
    });
    this.loading.present();
  }
  
  doRefresh(refresher)
  {
    this.getKarigarList(this.karigar_list, '');
    refresher.complete();
  }
  

  goOnDetailPage(id){
    this.navCtrl.push(KarigardetailPage,{'id':id})
  }

  onCancel(event){
    console.log(event);
    
  }

  getKarigarList(status, search)
  {
    this.flag=0;
    this.filter.limit = 0;
    this.filter.search = search;
    this.filter.status = status;
    
    
    
    this.dbService.post_rqst( {'filter':this.filter,'sales_employee_id' : this.dbService.karigar_id,'user_type':'1'}, 'app_karigar/karigarList').subscribe(response =>
      {
        console.log(response);
        this.karigars = response.karigars;
       console.log(this.karigars);
       this.loading.dismiss();

      });
    }
    
    loadData(infiniteScroll)
    {
      
      this.filter.limit=this.karigars.length;

      this.dbService.post_rqst({'filter' : this.filter  ,'sales_employee_id' : this.dbService.karigar_id,'user_type':'1'},'app_karigar/karigarList').subscribe( r =>
        {
          
          let resData = r.karigars;

          if(resData =='')
          {
            this.flag=1;
          }
          else
          {
            setTimeout(()=>{
              this.karigars=this.karigars.concat(resData);
              console.log(this.karigars);
              infiniteScroll.complete();
            },1000);
          }
        });
      }

     

  goOnCustomerAdd(){
    this.navCtrl.push(KarigaraddPage)
  }

}
