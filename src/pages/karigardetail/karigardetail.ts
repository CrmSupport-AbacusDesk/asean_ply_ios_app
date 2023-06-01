import { KarigaraddPage } from './../karigaradd/karigaradd';
import { Component } from '@angular/core';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { TranslateService } from '@ngx-translate/core';
import { IonicPage, NavController, NavParams, Loading, ActionSheetController, AlertController } from 'ionic-angular';
import { ConstantProvider } from '../../providers/constant/constant';
import { DbserviceProvider } from '../../providers/dbservice/dbservice';

/**
 * Generated class for the KarigardetailPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-karigardetail',
  templateUrl: 'karigardetail.html',
})
export class KarigardetailPage {
  karigar_detail:any={};
  loading:Loading;
  karigar_id: any;
  uploadUrl:any="";

  constructor(public navCtrl: NavController, public navParams: NavParams,public alertCtrl:AlertController,public actionSheetController: ActionSheetController,public translate:TranslateService,private camera: Camera,public service:DbserviceProvider,public con:ConstantProvider) {
    this.karigar_id = this.navParams.get('id');
    this.uploadUrl = this.con.upload_url;

    
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad KarigardetailPage');
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

  cam:any="";
  gal:any="";
  cancl:any="";
  ok:any="";

  updateProfile()
  {
      this.karigar_detail.edit_profile= 'edit_profile';
      console.log(this.karigar_detail);
      
      this.navCtrl.push(KarigaraddPage,{'data':this.karigar_detail})
  }
  openeditprofile()
  {
      let actionsheet = this.actionSheetController.create({
          title:"Profile photo",
          cssClass: 'cs-actionsheet',
          
          buttons:[{
              cssClass: 'sheet-m',
              text: this.cam,
              icon:'camera',
              handler: () => {
                  this.takePhoto();
              }
          },
          {
              cssClass: 'sheet-m1',
              text: this.gal,
              icon:'image',
              handler: () => {
                  this.getImage();
              }
          },
          {
              cssClass: 'cs-cancel',
              text: this.cancl,
              role: 'cancel',
              handler: () => {
              }
          }]
      });
      actionsheet.present();
  }
  takePhoto()
  {
      console.log("i am in camera function");
      const options: CameraOptions = {
          quality: 70,
          destinationType: this.camera.DestinationType.DATA_URL,
          targetWidth : 500,
          targetHeight : 400,
          cameraDirection: 1,
          correctOrientation: true
      }
      
      console.log(options);
      this.camera.getPicture(options).then((imageData) => {
          this.karigar_detail.profile = 'data:image/jpeg;base64,' + imageData;
          console.log(this.karigar_detail.profile);
          if(this.karigar_detail.profile)
          {
              this.uploadImage(this.karigar_detail.profile);
          }
      }, (err) => {
      });
  }
  getImage() 
  {
      const options: CameraOptions = {
          quality: 70,
          destinationType: this.camera.DestinationType.DATA_URL,
          sourceType: this.camera.PictureSourceType.PHOTOLIBRARY,
          saveToPhotoAlbum:false
      }
      console.log(options);
      this.camera.getPicture(options).then((imageData) => {
          this.karigar_detail.profile = 'data:image/jpeg;base64,' + imageData;
          console.log(this.karigar_detail.profile);
          if(this.karigar_detail.profile)
          {
              this.uploadImage(this.karigar_detail.profile);
          }
      }, (err) => {
      });
  }
  uploadImage(profile)
  {
      console.log(profile);
      this.service.post_rqst( {'karigar_id': this.service.karigar_id,'profile':profile },'app_karigar/updateProfilePic')
      .subscribe((r) =>
      {
          console.log(r);
          this.showSuccess("Profile Photo Updated")   
      });
  }

  showSuccess(text)
    {
        this.translate.get("Success")
        .subscribe(resp=>{
            let alert = this.alertCtrl.create({
                title:resp+'!',
                subTitle: text,
                buttons: [this.ok]
            });
            alert.present();
        })
    }
}
