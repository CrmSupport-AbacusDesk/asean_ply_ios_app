import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, Loading } from 'ionic-angular';
import { DbserviceProvider } from '../../providers/dbservice/dbservice';
import { ArchitectAddPage } from '../architect-add/architect-add';
import { ArchitectDetailPage } from '../architect-detail/architect-detail';

/**
 * Generated class for the ArchitectListPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-architect-list',
  templateUrl: 'architect-list.html',
})
export class ArchitectListPage {
  loading:Loading;
  filter:any = {};
  flag:any='';
  Architect_list: string = "Pending";
  karigars: any[];
  constructor(public navCtrl: NavController, public navParams: NavParams, public dbService:DbserviceProvider, public loadingCtrl:LoadingController,) {
    this.getKarigarList(this.Architect_list, '');

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ArchitectListPage');
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
    this.getKarigarList(this.Architect_list, '');
    refresher.complete();
  }
  

  goOnDetailPage(id){
    this.navCtrl.push(ArchitectDetailPage,{'id':id})
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
    
    
    
    this.dbService.post_rqst( {'filter':this.filter,'sales_employee_id' : this.dbService.karigar_id,'user_type':'2'}, 'app_karigar/karigarList').subscribe(response =>
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

      this.dbService.post_rqst({'filter' : this.filter  ,'sales_employee_id' : this.dbService.karigar_id,'user_type':'2'},'app_karigar/karigarList').subscribe( r =>
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
    this.navCtrl.push(ArchitectAddPage)
  }

}
