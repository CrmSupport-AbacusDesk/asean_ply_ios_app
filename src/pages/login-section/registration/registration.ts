import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, ActionSheetController, LoadingController, Loading, ModalController, ToastController  } from 'ionic-angular';
// import { FileTransfer, } from '@ionic-native/file-transfer';
// import { TabsPage } from './../../../pages/tabs/tabs';
import { DbserviceProvider } from '../../../providers/dbservice/dbservice';
import { Camera, CameraOptions } from '@ionic-native/camera';
import {AboutusModalPage} from '../../aboutus-modal/aboutus-modal'
import { Storage } from '@ionic/storage';
import { Content } from 'ionic-angular';
import { TranslateService } from '@ngx-translate/core';
import { HomePage } from '../../home/home';
import { ProfilePage } from '../../profile/profile';
import { ConstantProvider } from '../../../providers/constant/constant';


@IonicPage()
@Component({
    selector: 'page-registration',
    templateUrl: 'registration.html',
})
export class RegistrationPage {
    @ViewChild(Content) content: Content;
    data:any={};
    state_list:any=[];
    district_list:any=[];
    city_list:any=[];
    pincode_list:any=[];
    selectedFile:any=[];
    file_name:any=[];
    karigar_id:any='';
    formData= new FormData();
    myphoto:any;
    profile_data:any='';
    loading:Loading;
    lang:any='en';
    today_date:any;
    whatsapp_mobile_no:any='';
    saveFlag:any = false;
    upload_url:any='';
    // defaultSelectedRadio = "data.user_type=1";
    
    
    constructor(public navCtrl: NavController, public toastCtrl: ToastController,public navParams: NavParams,public con:ConstantProvider, public service:DbserviceProvider,public alertCtrl:AlertController ,public actionSheetController: ActionSheetController,private camera: Camera,private loadingCtrl:LoadingController,public modalCtrl: ModalController,private storage:Storage,public translate:TranslateService) {
        this.upload_url = this.con.upload_url;
        if (!navParams.data.data) {	
            this.AllBranch();	
        }
        this.data.mobile_no = this.navParams.get('mobile_no');
        console.log(this.data.mobile_no);
        this.data.document_type='Adharcard';
        this.data.pan_image='';
        this.data.profile='';
        this.data.document_image='';
        this.data.document_image_back='';
        this.data.cheque_image='';
        this.data.security_cheque_image = '';
        
        
        this.getSalesemp_list();    
        
        this.data.user_type=1;
        this.getstatelist();
        this.today_date = new Date().toISOString().slice(0,10);
        console.log(navParams);
        
        if(navParams.data.data){
            this.data = navParams.data.data;
            console.log(this.data);
            
            this.dealer_nameData = this.data.partner;
            console.log(this.dealer_nameData);
            
            this.data.karigar_edit_id = this.data.id
            // this.data.profile= this.data.profile;
            // this.data.document_image = this.data.document_image
            // this.data.document_image_back = this.data.document_image_back
            // this.data.cheque_image = this.data.cheque_image
        }
        
        console.log(this.data.karigar_edit_id);
        
    }
    
    cam:any="";
    gal:any="";
    cancl:any="";
    ok:any="";
    upl_file:any="";
    save_succ:any="";
    ionViewDidLoad() {
        
        
        
        
        
        this.translate.setDefaultLang(this.lang);
        this.translate.use(this.lang);
        if (this.data.state) {
            this.getDistrictList(this.data.state);
        }
        console.log(this.data);
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
        
        this.translate.get("Registered Successfully")
        .subscribe(resp=>{
            this.save_succ = resp
        });
    }
    
    getstatelist(){
        this.service.get_rqst('app_master/getStates').subscribe( r =>
            {
                console.log(r);
                this.state_list=r['states'];
                this.karigar_id=r['id'];
                console.log(this.state_list);
                // this.getDealerList(this.data.state,this.data.district);

            });
        }
        getDistrictList(state_name)
        {
            console.log(state_name);
            this.service.post_rqst({'state_name':state_name},'app_master/getDistrict')
            .subscribe( (r) =>
            {
                console.log(r);
                this.district_list=r['districts'];
                console.log(this.state_list);
                // this.getDealerList(this.data.state,this.data.district);

            });
        }

        branch_name: any;
        dealer_list: any = [];	
        getDealerList2(branch_name) {	
            console.log(branch_name);	
            this.branch_name = branch_name;	
            console.log(this.district_name);	
            if (this.data.user_type != '3') {	
                this.service.post_rqst({ 'branch_name': this.branch_name }, 'app_karigar/dealerList')	
                    .subscribe((r) => {	
                        console.log(r);	
                        this.dealer_list = r['karigars'];	
                        console.log(this.dealer_list);	
                    });	
            }

        }
        
        getCityList(district_name)
        {
            console.log(district_name);
            this.service.post_rqst({'district_name':district_name},'app_master/getCity')
            .subscribe( (r) =>
            {
                console.log(r);
                this.city_list=r['cities'];
                this.pincode_list=r['pins'];
                console.log(this.pincode_list);
                // this.getDealerList(this.data.state,this.data.district);

            });
        }
        
        getaddress(pincode)
        {
            if(this.data.pincode.length=='6')
            {
                this.service.post_rqst({'pincode':pincode},'app_karigar/getAddress')
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
        
        scrollUp()
        {
            this.content.scrollToTop();
        } 
        
        presentToast(msg) {
            console.log(msg);
            const toast = this.toastCtrl.create({
                message: msg,
                duration: 3000
            });
            toast.present();
        }
        
        deleteItem(i)
        {
          this.dealer_nameData.splice(i,1);
          this.presentToast('Image delete successfully');
        }

        dealer_nameData:any =[];
        Data1:any={};


        addItem()
        {
            if(!this.Data1.partner_name){
                // this.showAlert("Don't take name more then number of partners");
                this.showAlert("Please Enter your partner name");

                return;
            }

            
          let val=JSON.parse(JSON.stringify(this.Data1));
          console.log(val);
          if( val.partner_name !=''  && this.Data1.no_of_partner!=''){
            this.dealer_nameData.push(val);
          }
         
          console.log(this.dealer_nameData);
          this.Data1.partner_name='';
          this.Data1.partner_document_image_front=''
          this.Data1.partner_pan_image=''
          this.Data1.partner_document_image_back=''
        }



        company_info:any;
        submit()
        {
            
            if(this.data.user_type == 1){
                
                if(!this.data.profile){
                    this.presentToast('Profile image required');
                    return
                }
                
            }
            if(this.data.document_type=='Adharcard'){
                if(!this.data.document_image){
                    this.presentToast('Aadhaar Card front image required');
                    return
                }
                if(!this.data.document_image_back){
                    this.presentToast('Aadhaar Card back image  required');
                    return
                }
            }
            if(this.data.document_type=='VoterCard'){
                if(!this.data.document_image){
                    this.presentToast('VoterCard image required');
                    return
                }
            }
            
            if(!this.data.cheque_image){
                this.presentToast('Cheque image required');
                return
            }
            if (!this.data.pan_image) {
                this.presentToast('PanCard image required');
                return
            }
            // this.data.image = this.image_data?this.image_data:[];
            this.data.partner = this.dealer_nameData;
           
            this.data.lang = this.lang;
            this.data.created_by='0';
            this.saveFlag = true;
            this.presentLoading();
            this.service.post_rqst( {'karigar': this.data },'app_karigar/addKarigar')
            .subscribe( (r) =>
            {
                console.log(r);
                this.loading.dismiss();
                this.karigar_id=r['id'];
                console.log(this.karigar_id);
                
                
                if(r['status'] == 'UPDATED')
                {
                    this.navCtrl.push(HomePage);
                }
                
                
                if(r['status']=="SUCCESS")
                {
                    this.showSuccess(this.save_succ+"!");
                    this.service.post_rqst({'mobile_no': this.data.mobile_no ,'mode' :'App'},'auth/login')
                    .subscribe( (r) =>
                    {
                        console.log(r);
                        if(r['status'] == 'NOT FOUND')
                        {
                            return;
                        } 
                        else if(r['status'] == 'ACCOUNT SUSPENDED')
                        {
                            this.translate.get("Your account has been suspended")
                            .subscribe(resp=>{
                                this.showAlert(resp);
                            })
                            return;
                        }
                        else if(r['status'] == 'SUCCESS')
                        {
                            this.storage.set('token',r['token']); 
                            this.service.karigar_id=r['user'].id;
                            this.service.karigar_status=r['user'].status;
                            console.log(this.service.karigar_id);
                            
                            if(r['user'].status !='Verified' && r['user'].user_type!=3)
                            {
                                let contactModal = this.modalCtrl.create(AboutusModalPage);
                                contactModal.present();
                                return;
                            }
                        }
                        // this.navCtrl.push(TabsPage);
                        this.navCtrl.push(HomePage);
                    });
                }
                else if(r['status']=="EXIST")
                {
                    this.translate.get("Already Registered")
                    .subscribe(resp=>{
                        this.showAlert(resp+"!");
                    })
                }
            });
        }
        namecheck(event: any) 
        {
            console.log("called");
            
            const pattern = /[A-Z\+\-\a-z ]/;
            let inputChar = String.fromCharCode(event.charCode);
            if (event.keyCode != 8 && !pattern.test(inputChar)) 
            {event.preventDefault(); }
        }
        


        sales_list:any = [];

        getSalesemp_list(){
            // this.userType =this.userType.sales_employee_id;
            this.service.get_rqst('app_karigar/salesEmployeeList')
            .subscribe(d => {  
                this.sales_list = d.karigars;
                
            });
        }


        
        district_name: any;
state_name: any;
// getDealerList(state,district)
// {
//     console.log(state);
//     console.log(district);        
//     this.district_name=this.data.district;
//     console.log(this.district_name);
//     this.state_name=this.data.state;
//     console.log(this.state_name);
//     this.service.post_rqst({'district':this.district_name,'state':this.state_name},'app_karigar/dealerList')
//     .subscribe( (r) =>
//     {
//         console.log(r);
//         this.dealer_list=r['karigars'];
//         console.log(this.dealer_list);
//     });
// }
        
        MobileNumber(event: any) {
            const pattern = /[0-9]/;
            let inputChar = String.fromCharCode(event.charCode);
            if (event.keyCode != 8 && !pattern.test(inputChar)) {
                event.preventDefault();
            }
        }
        
        caps_add(add:any)
        {
            this.data.address = add.replace(/\b\w/g, l => l.toUpperCase());
        }
        
        showSuccess(text)
        {
            this.translate.get("Success")
            .subscribe(resp=>{
                let alert = this.alertCtrl.create({
                    title:resp+'!',
                    cssClass:'action-close',
                    subTitle: text,
                    buttons: [this.ok]
                });
                alert.present();
            })
        }
        showAlert(text) 
        {
            this.translate.get("Alert")
            .subscribe(resp=>{
                let alert = this.alertCtrl.create({
                    title:resp+'!',
                    cssClass:'action-close',
                    subTitle: text,
                    buttons: [this.ok]
                });
                alert.present();
            })
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










onUploadChangeproprietorship(evt: any) {
    let actionsheet = this.actionSheetController.create({
        title:this.upl_file,
        cssClass: 'cs-actionsheet',
        buttons:[{
            cssClass: 'sheet-m',
            text: this.cam,
            icon:'camera',
            handler: () => {
                this.takeDocPhotoproship();
            }
        },
        {
            cssClass: 'sheet-m1',
            text: this.gal,
            icon:'image',
            handler: () => {
                this.getDocImageproship();
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
takeDocPhotoproship()
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
    this.data.company_image = 'data:image/jpeg;base64,' + imageData;
    console.log(this.data.company_image);
}, (err) => {
});
}
getDocImageproship()
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
    this.data.company_image = 'data:image/jpeg;base64,' + imageData;
    console.log(this.data.company_image);
}, (err) => {
});
}





    
onUploadChangepar_img(evt: any) {
    let actionsheet = this.actionSheetController.create({
        title:this.upl_file,
        cssClass: 'cs-actionsheet',
        buttons:[{
            cssClass: 'sheet-m',
            text: this.cam,
            icon:'camera',
            handler: () => {
                this.takeDocPhoto_par_img();
            }
        },
        {
            cssClass: 'sheet-m1',
            text: this.gal,
            icon:'image',
            handler: () => {
                this.getDocImage_par_img();
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
takeDocPhoto_par_img()
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
    this.Data1.partner_document_image_front = 'data:image/jpeg;base64,' + imageData;
    console.log(this.Data1.partner_document_image_front);
    // if(this.image)
    // {
    //   this.fileChange_partner(this.Data1.partner_document_image_front);
    // }
}, (err) => {
});
}
getDocImage_par_img()
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
    this.Data1.partner_document_image_front = 'data:image/jpeg;base64,' + imageData;
    console.log(this.Data1.partner_document_image_front);
}, (err) => {
});
}



branch_list: any = [];
AllBranch() {
    this.service.post_rqst({}, 'app_master/get_branch_name').subscribe(r => {
        console.log(r);
        this.branch_list = r['branch_name'];
        console.log(this.branch_list);
    });
}

    
onUploadChangepar_img2(evt: any) {
    let actionsheet = this.actionSheetController.create({
        title:this.upl_file,
        cssClass: 'cs-actionsheet',
        buttons:[{
            cssClass: 'sheet-m',
            text: this.cam,
            icon:'camera',
            handler: () => {
                this.takeDocPhoto_par_img2();
            }
        },
        {
            cssClass: 'sheet-m1',
            text: this.gal,
            icon:'image',
            handler: () => {
                this.getDocImage_par_img2();
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
takeDocPhoto_par_img2()
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
    this.Data1.partner_document_image_back = 'data:image/jpeg;base64,' + imageData;
    console.log(this.Data1.partner_document_image_back);
    // if(this.image)
    // {
    //   this.fileChange_partner(this.Data1.partner_document_image_back);
    // }
}, (err) => {
});
}
getDocImage_par_img2()
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
    this.Data1.partner_document_image_back = 'data:image/jpeg;base64,' + imageData;
    console.log(this.Data1.partner_document_image_back);
}, (err) => {
});
}









    
onUploadChangepar_img3(evt: any) {
    let actionsheet = this.actionSheetController.create({
        title:this.upl_file,
        cssClass: 'cs-actionsheet',
        buttons:[{
            cssClass: 'sheet-m',
            text: this.cam,
            icon:'camera',
            handler: () => {
                this.takeDocPhoto_par_img3();
            }
        },
        {
            cssClass: 'sheet-m1',
            text: this.gal,
            icon:'image',
            handler: () => {
                this.getDocImage_par_img3();
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
takeDocPhoto_par_img3()
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
    this.Data1.partner_pan_image = 'data:image/jpeg;base64,' + imageData;
    console.log(this.Data1.partner_pan_image);
    // if(this.image)
    // {
    //   this.fileChange_partner(this.Data1.partner_pan_image);
    // }
}, (err) => {
});
}
getDocImage_par_img3()
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
    this.Data1.partner_pan_image = 'data:image/jpeg;base64,' + imageData;
    console.log(this.Data1.partner_pan_image);
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

onUploadCheque(evt: any) {
    let actionsheet = this.actionSheetController.create({
        title:this.upl_file,
        cssClass: 'cs-actionsheet',
        buttons:[{
            cssClass: 'sheet-m',
            text: this.cam,
            icon:'camera',
            handler: () => {
                this.chequePhoto();
            }
        },
        {
            cssClass: 'sheet-m1',
            text: this.gal,
            icon:'image',
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

chequePhoto()
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
        this.data.cheque_image = 'data:image/jpeg;base64,' + imageData;
        console.log(this.data.cheque_image);
    }, (err) => {
    });
}
chequeImage()
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
        this.data.cheque_image = 'data:image/jpeg;base64,' + imageData;
        console.log(this.data.cheque_image);
    }, (err) => {
    });
}










onUploadCheque2(evt: any) {
    let actionsheet = this.actionSheetController.create({
        title:this.upl_file,
        cssClass: 'cs-actionsheet',
        buttons:[{
            cssClass: 'sheet-m',
            text: this.cam,
            icon:'camera',
            handler: () => {
                this.chequePhoto2();
            }
        },
        {
            cssClass: 'sheet-m1',
            text: this.gal,
            icon:'image',
            handler: () => {
                this.chequeImage2();
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

chequePhoto2()
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
        this.data.security_cheque_image = 'data:image/jpeg;base64,' + imageData;
        console.log(this.data.security_cheque_image);
    }, (err) => {
    });
}
chequeImage2()
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
        this.data.security_cheque_image = 'data:image/jpeg;base64,' + imageData;
        console.log(this.data.security_cheque_image);
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


captureMedia()
{
  this.captureImageVideo();
  //   if(this.videoId)
  //   {
  //     this.captureImageVideo();
  //   }
  //   else
  //   {

  
}


    
image_data:any=[];
                
                
fileChange(image)
{
  
  this.image_data.push({'image':image});
  console.log(this.image_data);
  this.image = '';
}

remove_image(i:any)
{
  this.image_data.splice(i,1);
}


captureImageVideo()
{
  let actionsheet = this.actionSheetController.create({
    title:"Complaint Media",
    cssClass: 'cs-actionsheet',
    
    buttons:[{
      cssClass: 'sheet-m',
      text: 'Camera',
      icon:'camera',
      handler: () => {
        console.log("Camera Clicked");
        
        this.takePhoto1();
      }
    },
    {
      cssClass: 'sheet-m1',
      text: 'Gallery',
      icon:'image',
      handler: () => {
        console.log("Gallery Clicked");
        this.getImage1();
      }
    },
    {
      cssClass: 'cs-cancel',
      text: 'Cancel',
      role: 'cancel',
      icon:'cancel',
      handler: () => {
        console.log('Cancel clicked');
      }
    }
  ]
});
actionsheet.present();
}



image:any;
takePhoto1()
{
console.log("i am in camera function");
const options: CameraOptions = {
  quality: 100,
  destinationType: this.camera.DestinationType.DATA_URL,
  targetWidth : 1000,
  targetHeight : 1000
}

console.log(options);
this.camera.getPicture(options).then((imageData) => {
  this.image = 'data:image/jpeg;base64,' + imageData;
//   this.image=  imageData;
//   this.image= imageData.substr(imageData.lastIndexOf('/') + 1);
  console.log(this.image);
  if(this.image)
  {
    this.fileChange(this.image);
  }
}, (err) => {
});
}
getImage1()
{
const options: CameraOptions = {
  quality: 70,
  destinationType: this.camera.DestinationType.DATA_URL,
  sourceType: this.camera.PictureSourceType.PHOTOLIBRARY,
  saveToPhotoAlbum:false
}
console.log(options);
this.camera.getPicture(options).then((imageData) => {
  this.image= 'data:image/jpeg;base64,' + imageData;
//   this.image=  imageData;
//   this.image= imageData.substr(imageData.lastIndexOf('/') + 1);
  console.log(this.image);
  if(this.image)
  {
    this.fileChange(this.image);
  }
}, (err) => {
});
}




account:any={};
check_bank_account(account_no)
{
    
    this.service.post_rqst({'account_no':account_no},'app_karigar/checkAccount')
    .subscribe( (r) =>
    {
        console.log(r);
        
        if(r.status== "exist"){
            this.presentToast('Account no. already exist');
            return
        }
    });
    
    
    
}






onUploadCompanyChange(evt: any) {
    let actionsheet = this.actionSheetController.create({
        title:this.upl_file,
        cssClass: 'cs-actionsheet',
        buttons:[{
            cssClass: 'sheet-m',
            text: this.cam,
            icon:'camera',
            handler: () => {
                this.CompanyPhoto();
            }
        },
        {
            cssClass: 'sheet-m1',
            text: this.gal,
            icon:'image',
            handler: () => {
                this.CompanyImage();
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
CompanyPhoto()
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
        this.data.company_image = 'data:image/jpeg;base64,' + imageData;
        console.log(this.data.company_image);
    }, (err) => {
    });
}
CompanyImage()
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
        this.data.company_image = 'data:image/jpeg;base64,' + imageData;
        console.log(this.data.company_image);
    }, (err) => {
    });
}

}
