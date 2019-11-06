import { Component, OnInit } from '@angular/core';
import { NavController, ModalController } from '@ionic/angular';
import { AuthenticateService } from '../services/authentication.service';

//Image picker
import { AngularFireStorage, AngularFireUploadTask } from '@angular/fire/storage';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { finalize, tap } from 'rxjs/operators';

export interface MyData {
  name: string;
  filepath: string;
  size: number;
}


@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.scss'],
})
export class DashboardPage implements OnInit {
  //Variables
   // Upload Task 
   task: AngularFireUploadTask;

   // Progress in percentage
   percentage: Observable<number>;
 
   // Snapshot of uploading file
   snapshot: Observable<any>;
 
   // Uploaded File URL
   UploadedFileURL: Observable<string>;
 
   //Uploaded Image List
   images: Observable<MyData[]>;
 
   //File details  
   fileName:string;
   fileSize:number;
 
   //Status check 
   isUploading:boolean;
   isUploaded:boolean;
 
   private imageCollection: AngularFirestoreCollection<MyData>;

   userEmail: string;
      //Variables end

    //Connecting to database
  constructor(
    private navCtrl: NavController,
    private authService: AuthenticateService,
    private storage: AngularFireStorage, 
    private database: AngularFirestore,
    //private UserID: string
  ) {
    this.isUploading = false;
    this.isUploaded = false;
    //UserID = this.authService.userDetails().uid;
    //Set collection where our documents/ images info will save
    this.imageCollection = database.collection<MyData>('tunnelFiles');
    this.images = this.imageCollection.doc('photos').collection<MyData>(this.authService.userDetails().uid).valueChanges();
  }
  //Runs every time page is opened
  //Auth the user
  ngOnInit(){
    
    if(this.authService.userDetails()){
      this.userEmail = this.authService.userDetails().email;
    }else{
      this.navCtrl.navigateBack('');
    }
  }
  //Logs out the user
  logout(){
    this.authService.logoutUser()
    .then(res => {
      console.log(res);
      this.navCtrl.navigateBack('');
    })
    .catch(error => {
      console.log(error);
    })
  }

  //file upload
  uploadFile(event: FileList) {
    

    // The File object
    const file = event.item(0)

    // Validation for Images Only
    if (file.type.split('/')[0] !== 'image') { 
     console.error('unsupported file type :( ')
     return;
    }

    this.isUploading = true;
    this.isUploaded = false;


    this.fileName = file.name;

    // The storage path

    const path = `tunnelFiles/${this.authService.userDetails().uid}/${new Date().getTime()}_hi${file.name}`;

    // Totally optional metadata
    const customMetadata = { app: 'Tunnel Img upload' };

    //File reference
    const fileRef = this.storage.ref(path);

    // The main task
    this.task = this.storage.upload(path, file, { customMetadata });

    // Get file progress percentage
    this.percentage = this.task.percentageChanges();
    this.snapshot = this.task.snapshotChanges().pipe(
      
      finalize(() => {
        // Get uploaded file storage path
        this.UploadedFileURL = fileRef.getDownloadURL();
        
        this.UploadedFileURL.subscribe(resp=>{
          this.addImagetoDB({
            name: file.name,
            filepath: resp,
            size: this.fileSize
          });
          this.isUploading = false;
          this.isUploaded = true;
        },error=>{
          console.error(error);
        })
      }),
      tap(snap => {
          this.fileSize = snap.totalBytes;
      })
    )
  }

  //Sends the file to Firebase
  addImagetoDB(image: MyData) {
    //Create an ID for document
    const id = this.database.createId();

    //Set document id with value in database
    this.imageCollection.doc('photos').collection(this.authService.userDetails().uid).doc(id).set(image).then(resp => {
      console.log(resp);
    }).catch(error => {
      console.log("error " + error);
    });
  }
}
