import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams ,Loading, LoadingController, App} from 'ionic-angular';
import { PointDetailPage } from '../point-detail/point-detail';
import { DbserviceProvider } from '../../../providers/dbservice/dbservice';
import { Storage } from '@ionic/storage';
import { TranslateService } from '@ngx-translate/core';
import * as jwt_decode from "jwt-decode";


@IonicPage()
@Component({
  selector: 'page-point-list',
  templateUrl: 'point-list.html',
})
export class PointListPage {
  coupon_list:any=[];
  arhitect_points:any=[];

  karigar_point:any={};
  loading:Loading;
  filter:any={};
  last_scanned_date:any='';
  tokenInfo:any={};
  lang:any='';
  history: string = "scanned";
  welcomePoint_date:any;
  welcomePoint:any;
  ref_kar:any;
  ref_user:any=[];

  user_type: any;

  constructor(public navCtrl: NavController, public navParams: NavParams,public service:DbserviceProvider,public loadingCtrl:LoadingController,private app:App,public storage:Storage,public translate:TranslateService,public db:DbserviceProvider) {
    console.log(this.db);
    console.log(this.db.karigar_info.status);
    this.user_type=this.navParams.get("user_type");
    console.log(this.user_type);

    
  }
  
  ionViewDidLoad() {
    console.log('ionViewDidLoad PointListPage');
    this.presentLoading();
    this.get_user_lang();

    if(this.user_type == '1' || this.user_type == '2'){
      this.getCoupanHistory();

    }
    
    if(this.user_type == '3' || this.user_type == '4'){
      this.getPointHistory();


    }
  }
  
  doRefresh(refresher) 
  {
    console.log('Begin async operation', refresher);
    this.getCoupanHistory(); 
    refresher.complete();
  }

  doRefreshList(refresher) 
  {
    console.log('Begin async operation', refresher);
    this.getPointHistory(); 
    refresher.complete();
  }
  
  goOnPointDetailPage(id){
    this.navCtrl.push(PointDetailPage,{'id':id})
  }
  
  get_user_lang()
  {
    this.storage.get("token")
    .then(resp=>{
      this.tokenInfo = this.getDecodedAccessToken(resp );
      
      this.db.post_rqst({"login_id":this.tokenInfo.sub},"app_karigar/get_user_lang")
      .subscribe(resp=>{
        console.log(resp);
        this.lang = resp['language'];
        if(this.lang == "")
        {
          this.lang = "en";
        }
        this.translate.use(this.lang);
      })
    })
  }
  getDecodedAccessToken(token: string): any {
    try{
      return jwt_decode(token);
    }
    catch(Error){
      return null;
    }
  }
  
  total_balance_point:any=0;
  getCoupanHistory()
  {


    console.log('coupan');
    this.filter.limit=0;
    this.service.post_rqst( {'filter':this.filter,'karigar_id': this.service.karigar_id },'app_karigar/couponHistory').subscribe( r =>
      {
        console.log(r);
        this.loading.dismiss();
        this.coupon_list=r['coupon'];
        console.log(this.coupon_list);
        
        this.ref_kar=r['ref_kar'];
        // this.welcomePoint = r['welcome_points'].welcome_points_karigar;

        this.welcomePoint_date =  r['karigar'].balance_update

        this.karigar_point=r['karigar'];
        this.total_balance_point = parseInt( this.karigar_point.balance_point) + parseInt(this.karigar_point.referal_point_balance );
        console.log(this.total_balance_point);
        
      });
    }



    getPointHistory()
    {
      console.log('karigar');
      this.filter.limit=0;
      this.service.post_rqst( {'filter':this.filter,'karigar_id': this.service.karigar_id },'app_karigar/points_summry').subscribe( r =>
        {
          console.log(r);
          this.loading.dismiss();
          this.arhitect_points=r['arhitect_points'];
          this.ref_user=r['other_points'];
          console.log(this.ref_user);
          
          // this.welcomePoint = r['welcome_points'].welcome_points_karigar;
          // this.welcomePoint_date =  r['karigar'].balance_update
          this.karigar_point=r['karigar'];


          this.total_balance_point = parseInt( this.karigar_point.balance_point) + parseInt(this.karigar_point.referal_point_balance );
          console.log(this.total_balance_point);
          
        });
      }




    presentLoading() 
    {
      this.loading = this.loadingCtrl.create({
        content: "Please wait...",
        dismissOnPageChange: false
      });
      this.loading.present();
    }
    
    flag:any='';
    loadData(infiniteScroll)
    {
      console.log('loading');
      this.filter.limit=this.coupon_list.length;
      this.service.post_rqst( {'filter':this.filter,'karigar_id': this.service.karigar_id },'app_karigar/couponHistory').subscribe( r =>
        {
          console.log(r);
          if(r['coupon'] == '')
          { this.flag=1;}
          else
          {
            setTimeout(()=>{
              this.coupon_list=this.coupon_list.concat(r['coupon']);
              console.log('Asyn operation has stop')
              infiniteScroll.complete();
            },1000);
          }
        });
      }
      ionViewDidLeave()
      {
        let nav = this.app.getActiveNav();
        if(nav && nav.getActive()) 
        {
          let activeView = nav.getActive().name;
          let previuosView = '';
          if(nav.getPrevious() && nav.getPrevious().name)
          {
            previuosView = nav.getPrevious().name;
          }  
          console.log(previuosView); 
          console.log(activeView);  
          console.log('its leaving');
          if((activeView == 'HomePage' || activeView == 'GiftListPage' || activeView == 'TransactionPage' || activeView == 'ProfilePage' ||activeView =='MainHomePage') && (previuosView != 'HomePage' && previuosView != 'GiftListPage'  && previuosView != 'TransactionPage' && previuosView != 'ProfilePage' && previuosView != 'MainHomePage')) 
          {
            
            console.log(previuosView);
            this.navCtrl.popToRoot();
          }
        }
      }


      loadData1(infiniteScroll)
      {
        console.log('loading');
        this.filter.limit=this.arhitect_points.length;
        this.service.post_rqst( {'filter':this.filter,'karigar_id': this.service.karigar_id },'app_karigar/points_summry').subscribe( r =>
          {
            console.log(r);
            if(r['arhitect_points'] == '')
            { this.flag=1;}
            else
            {
              setTimeout(()=>{
                this.arhitect_points=this.arhitect_points.concat(r['arhitect_points']);
                console.log('Asyn operation has stop')
                infiniteScroll.complete();
              },1000);
            }
          });
        }


        loadData2(infiniteScroll)
        {
          console.log('loading');
          this.filter.limit=this.ref_user.length;
          this.service.post_rqst( {'filter':this.filter,'karigar_id': this.service.karigar_id },'app_karigar/points_summry').subscribe( r =>
            {
              console.log(r);
              if(r['other_points'] == '')
              { this.flag=1;}
              else
              {
                setTimeout(()=>{
                  this.ref_user=this.ref_user.concat(r['other_points']);
                  console.log('Asyn operation has stop')
                  infiniteScroll.complete();
                },1000);
              }
            });
          }
    }
    