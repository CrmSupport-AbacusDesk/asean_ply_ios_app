import { Camera, CameraOptions } from '@ionic-native/camera';
import { TranslateService } from '@ngx-translate/core';
import { ArchitectListPage } from './../architect-list/architect-list';
import { Component, ViewChild } from '@angular/core';
import { AlertController, IonicPage, NavController, NavParams, ActionSheetController, ToastController, LoadingController, ModalController, Content, Loading } from 'ionic-angular';
import { DbserviceProvider } from '../../providers/dbservice/dbservice';
import { ConstantProvider } from '../../providers/constant/constant';

/**
 * Generated class for the ArchitectAddPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-architect-add',
  templateUrl: 'architect-add.html',
})
export class ArchitectAddPage { 
  @ViewChild(Content) content: Content;
  data:any={};
  state_list:any=[];
  district_list:any=[];
  city_list:any=[];
  pincode_list:any=[];
  karigar_id:any='';
  loading:Loading;
  today_date:any;
  cam:any="";
  gal:any="";
  cancl:any="";
  ok:any="";
  upl_file:any="";
  save_succ:any="";
  uploadUrl:any="";


  constructor(public navCtrl: NavController, public navParams: NavParams,
    public alertCtrl:AlertController,
    public translate:TranslateService,
    public actionSheetController: ActionSheetController,
    private camera: Camera,
    public toastCtrl :ToastController,
    private loadingCtrl:LoadingController,
    public dbService:DbserviceProvider,
    public modalCtrl: ModalController,
    public con:ConstantProvider) {
        this.uploadUrl = this.con.upload_url;
        this.data.pan_image='';
        this.data.profile='';
        this.data.document_image='';
        this.data.document_image_back='';
        this.data.cheque_image='';
      this.getstatelist();
      this.today_date = new Date().toISOString().slice(0,10);
      if(navParams.data.data){
        this.data = navParams.data.data;
        this.data.karigar_edit_id = this.data.id

        // this.data.profile= this.data.profile;
        // this.data.document_image = this.data.document_image
        // this.data.document_image_back = this.data.document_image_back
        // this.data.cheque_image = this.data.cheque_image
        // this. getDealerList(this.state_name,this.district_name);
    }
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ArchitectAddPage');
    if (this.data.state) {
      this.getDistrictList(this.data.state);
  }
  this.translate.get("Camera")
  .subscribe(resp=>{
      this.cam = resp
  });
  
  this.translate.get("Gallery")
  .subscribe(resp=>{
      this.gal = resp
  });
  
  this.translate.get("Cancel")
  .subscribe(resp=>{
      this.cancl = resp
  });
  
  this.translate.get("OK")
  .subscribe(resp=>{
      this.ok = resp
  });
  
  this.translate.get("Upload File")
  .subscribe(resp=>{
      this.upl_file = resp
  });
  
  }

  
  getstatelist(){
    this.dbService.get_rqst('app_master/getStates').subscribe( r =>
        {
            console.log(r);
            this.state_list=r['states'];
            this.karigar_id=r['id'];
            console.log(this.state_list);
        });
    }
    getDistrictList(state_name)
    {
        console.log(state_name);
        this.dbService.post_rqst({'state_name':state_name},'app_master/getDistrict')
        .subscribe( (r) =>
        {
            console.log(r);
            this.district_list=r['districts'];
            console.log(this.state_list);
        });
    }
    
    getCityList(district_name)
    {
        console.log(district_name);
        this.dbService.post_rqst({'district_name':district_name},'app_master/getCity')
        .subscribe( (r) =>
        {
            console.log(r);
            this.city_list=r['cities'];
            this.pincode_list=r['pins'];
            console.log(this.pincode_list);
        });
    }
    
    getaddress(pincode)
    {
        if(this.data.pincode.length=='6')
        {
            this.dbService.post_rqst({'pincode':pincode},'app_karigar/getAddress')
            .subscribe( (result) =>
            {
                console.log(result);
                var address = result.address;
                if(address!= null)
                {
                    this.data.state = result.address.state_name;
                    this.getDistrictList(this.data.state)
                    this.data.district = result.address.district_name;
                    this.data.city = result.address.city;
                    console.log(this.data);
                    // this.getDealerList(this.data.state,this.data.district);
                }
            });
        }
        
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
                    console.log("Camera Clicked");
                    this.takePhoto();
                }
            },
            {
                cssClass: 'sheet-m1',
                text: this.gal,
                icon:'image',
                handler: () => {
                    console.log("Gallery Clicked");
                    this.getImage();
                }
            },
            {
                cssClass: 'cs-cancel',
                text: this.cancl,
                role: 'cancel',
                handler: () => {
                    console.log('Cancel clicked');
                }
            }
        ]
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
        this.data.profile = 'data:image/jpeg;base64,' + imageData;
        console.log(this.data.profile);
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
        this.data.profile = 'data:image/jpeg;base64,' + imageData;
        console.log(this.data.profile);
    }, (err) => {
    });
}

flag:boolean=true;  

onUploadChange(evt: any) {
    let actionsheet = this.actionSheetController.create({
        title:this.upl_file,
        cssClass: 'cs-actionsheet',
        buttons:[{
            cssClass: 'sheet-m',
            text: this.cam,
            icon:'camera',
            handler: () => {
                this.takeDocPhoto();
            }
        },
        {
            cssClass: 'sheet-m1',
            text: this.gal,
            icon:'image',
            handler: () => {
                this.getDocImage();
            }
        },
        {
            cssClass: 'cs-cancel',
            text: this.cancl,
            role: 'cancel',
            handler: () => {
                console.log('Cancel clicked');
            }
        }
    ]
});
actionsheet.present();
}
takeDocPhoto()
{
const options: CameraOptions = {
    quality: 70,
    destinationType: this.camera.DestinationType.DATA_URL,
    targetWidth : 500,
    targetHeight : 400
}

console.log(options);
this.camera.getPicture(options).then((imageData) => {
    this.flag=false;
    this.data.document_image = 'data:image/jpeg;base64,' + imageData;
    console.log(this.data.document_image);
}, (err) => {
});
}
getDocImage()
{
const options: CameraOptions = {
    quality: 70,
    destinationType: this.camera.DestinationType.DATA_URL,
    sourceType: this.camera.PictureSourceType.PHOTOLIBRARY,
    saveToPhotoAlbum:false
}
console.log(options);
this.camera.getPicture(options).then((imageData) => {
    this.flag=false;
    this.data.document_image = 'data:image/jpeg;base64,' + imageData;
    console.log(this.data.document_image);
}, (err) => {
});
}


onUploadBackChange(evt: any) {
let actionsheet = this.actionSheetController.create({
    title:this.upl_file,
    cssClass: 'cs-actionsheet',
    buttons:[{
        cssClass: 'sheet-m',
        text: this.cam,
        icon:'camera',
        handler: () => {
            this.backDocPhoto();
        }
    },
    {
        cssClass: 'sheet-m1',
        text: this.gal,
        icon:'image',
        handler: () => {
            this.backDocImage();
        }
    },
    {
        cssClass: 'cs-cancel',
        text: this.cancl,
        role: 'cancel',
        handler: () => {
        }
    }
]
});
actionsheet.present();
}
backDocPhoto()
{
const options: CameraOptions = {
    quality: 70,
    destinationType: this.camera.DestinationType.DATA_URL,
    targetWidth : 500,
    targetHeight : 400
}

console.log(options);
this.camera.getPicture(options).then((imageData) => {
    this.flag=false;
    this.data.document_image_back = 'data:image/jpeg;base64,' + imageData;
    console.log(this.data.document_image_back);
}, (err) => {
});
}
backDocImage()
{
const options: CameraOptions = {
    quality: 70,
    destinationType: this.camera.DestinationType.DATA_URL,
    sourceType: this.camera.PictureSourceType.PHOTOLIBRARY,
    saveToPhotoAlbum:false
}
console.log(options);
this.camera.getPicture(options).then((imageData) => {
    this.flag=false;
    this.data.document_image_back = 'data:image/jpeg;base64,' + imageData;
    console.log(this.data.document_image_back);
}, (err) => {
});
}

onUploadPane(evt: any) {
let actionsheet = this.actionSheetController.create({
    title:this.upl_file,
    cssClass: 'cs-actionsheet',
    buttons:[{
        cssClass: 'sheet-m',
        text: this.cam,
        icon:'camera',
        handler: () => {
            this.panPhoto();
        }
    },
    {
        cssClass: 'sheet-m1',
        text: this.gal,
        icon:'image',
        handler: () => {
            this.panImage();
        }
    },
    {
        cssClass: 'cs-cancel',
        text: this.cancl,
        role: 'cancel',
        handler: () => {
        }
    }
]
});
actionsheet.present();
}
panPhoto()
{
const options: CameraOptions = {
    quality: 70,
    destinationType: this.camera.DestinationType.DATA_URL,
    targetWidth : 500,
    targetHeight : 400
}

console.log(options);
this.camera.getPicture(options).then((imageData) => {
    this.flag=false;
    this.data.pan_image = 'data:image/jpeg;base64,' + imageData;
    console.log(this.data.pan_image);
}, (err) => {
});
}
panImage()
{
const options: CameraOptions = {
    quality: 70,
    destinationType: this.camera.DestinationType.DATA_URL,
    sourceType: this.camera.PictureSourceType.PHOTOLIBRARY,
    saveToPhotoAlbum:false
}
console.log(options);
this.camera.getPicture(options).then((imageData) => {
    this.flag=false;
    this.data.pan_image = 'data:image/jpeg;base64,' + imageData;
    console.log(this.data.pan_image);
}, (err) => {
});
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

scrollUp()
{
    this.content.scrollToTop();
} 

caps_add(add:any)
{
    this.data.address = add.replace(/\b\w/g, l => l.toUpperCase());
}

MobileNumber(event: any) {
  const pattern = /[0-9]/;
  let inputChar = String.fromCharCode(event.charCode);
  if (event.keyCode != 8 && !pattern.test(inputChar)) {
      event.preventDefault();
  }
}

namecheck(event: any) 
{
    console.log("called");
    
    const pattern = /[A-Z\+\-\a-z ]/;
    let inputChar = String.fromCharCode(event.charCode);
    if (event.keyCode != 8 && !pattern.test(inputChar)) 
    {event.preventDefault(); }
}


presentToast2(msg) {
    console.log(msg);
    const toast = this.toastCtrl.create({
        message: msg,
        duration: 3000
    });
    toast.present();
}


account: any = {};
check_bank_account(account_no) {

    this.dbService.post_rqst({ 'account_no': account_no }, 'app_karigar/checkAccount')
        .subscribe((r) => {
            console.log(r);

            if (r.status == "exist") {
                this.presentToast2('Account no. already exist');
                return
            }
        });



}

presentToast() {
  const toast = this.toastCtrl.create({
      message: `${this.data.mobile_no} This mobile number has already been registered please use another number.`,
      duration: 3000,
  });
  toast.present();
}



id: any;
customer_details: any;

CheckCustomer(mobile)
{
  
  console.log(mobile);
  
  
  
  if(mobile.length == 10){
    this.dbService.post_rqst( {'mobile_no':mobile},'app_karigar/check_karigar')
    .subscribe( (r) =>
    {


      if(r.status == 'EXIST'){
        this.presentToast();
        return;
    }
      console.log(r,'check customer');
      this.customer_details = r.customer_details;
      this.id = r.customer_details.id;
      console.log(this.id,this.customer_details);
   
    });
  }
 
  
}
district_name: any;
state_name: any;
dealer_list:any=[];

// getDealerList(state,district)
// {
//     console.log(state);
//     console.log(district);        
//     this.district_name=this.data.district;
//     console.log(this.district_name);
//     this.state_name=this.data.state;
//     console.log(this.state_name);
    


//     this.dbService.post_rqst({'district':this.district_name,'state':this.state_name},'app_karigar/dealerList')
//     .subscribe( (r) =>
//     {
//         console.log(r);
//         this.dealer_list=r['karigars'];
//         console.log(this.dealer_list);
//     });
// }

branch_list : any=[];
AllBranch(){
    this.dbService.post_rqst({},'app_master/get_branch_name').subscribe( r =>
        {
            console.log(r);
            this.branch_list=r['branch_name'];
            console.log(this.branch_list);
        });
    }

getDealerList(branch_name)
{
    console.log(branch_name);
    this.dbService.post_rqst({'branch_name':branch_name},'app_karigar/dealerList')
    .subscribe( (r) =>
    {
        console.log(r);
        this.dealer_list=r['karigars'];
        console.log(this.dealer_list);
    });
}
scan_tips()
{
  this.CheckCustomer('');
}


presentToast1(msg) {
    console.log(msg);
    const toast = this.toastCtrl.create({
        message: msg,
        duration: 3000
    });
    toast.present();
}

showAlert(text)
{
  let alert = this.alertCtrl.create({
    title:'Alert!',
    cssClass:'action-close',
    subTitle: text,
    buttons: [ {
      text: 'Scan again',
      handler: () => {
        this.scan_tips();
      }
    },
    {
      text: 'Okay',
      handler: () => {
        
      }
    }
  ]
});
alert.present();
}
    submit(id,customer_details)
    {
        console.log(id,customer_details);
        
        console.log('data');
        console.log(this.data);
this.data.sales_employee_id = this.dbService.karigar_id;
if(!this.data.karigar_edit_id){

    if (!this.data.profile) {
        this.presentToast1('Profile image required');
        return
    }
    
    if (this.data.document_type == 'Adharcard') {
        if (!this.data.document_image) {
            this.presentToast1('Aadhaar Card front image required');
            return
        }
        if (!this.data.document_image_back) {
            this.presentToast1('Aadhaar Card back image  required');
            return
        }
    }
    if (this.data.document_type == 'VoterCard') {
        if (!this.data.document_image) {
            this.presentToast1('VoterCard image required');
            return
        }
    }
    
    if (!this.data.cheque_image) {
        this.presentToast1('Cheque image required');
        return
    }
    if (!this.data.pan_image) {
        this.presentToast1('PanCard image required');
        return
    }
    }
// this.data.customer_id= this.id;
// this.data.customer_details=this.customer_details;
this.data.user_type = '2';


        this.presentLoading();
       
        console.log(this.data);
        this.dbService.post_rqst({'karigar':this.data},'app_karigar/addKarigar')
        .subscribe( (r) =>
        {
          this.loading.dismiss();

            console.log(r);
            if(r.status == 'EXIST'){
              this.presentToast();
              return;
            
            }
            
            this.navCtrl.popTo(ArchitectListPage);
           
        });
    }


    onUploadCheque(evt: any) {
        let actionsheet = this.actionSheetController.create({
            title: this.upl_file,
            cssClass: 'cs-actionsheet',
            buttons: [{
                cssClass: 'sheet-m',
                text: this.cam,
                icon: 'camera',
                handler: () => {
                    this.chequePhoto();
                }
            },
            {
                cssClass: 'sheet-m1',
                text: this.gal,
                icon: 'image',
                handler: () => {
                    this.chequeImage();
                }
            },
            {
                cssClass: 'cs-cancel',
                text: this.cancl,
                role: 'cancel',
                handler: () => {
                }
            }
            ]
        });
        actionsheet.present();
    }

    chequePhoto() {
        const options: CameraOptions = {
            quality: 70,
            destinationType: this.camera.DestinationType.DATA_URL,
            targetWidth: 500,
            targetHeight: 400
        }

        console.log(options);
        this.camera.getPicture(options).then((imageData) => {
            this.flag = false;
            this.data.cheque_image = 'data:image/jpeg;base64,' + imageData;
            console.log(this.data.cheque_image);
        }, (err) => {
        });
    }
    chequeImage() {
        const options: CameraOptions = {
            quality: 70,
            destinationType: this.camera.DestinationType.DATA_URL,
            sourceType: this.camera.PictureSourceType.PHOTOLIBRARY,
            saveToPhotoAlbum: false
        }
        console.log(options);
        this.camera.getPicture(options).then((imageData) => {
            this.flag = false;
            this.data.cheque_image = 'data:image/jpeg;base64,' + imageData;
            console.log(this.data.cheque_image);
        }, (err) => {
        });
    }

}
