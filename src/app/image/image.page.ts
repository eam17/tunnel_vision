import { Component, OnInit } from '@angular/core';
import { NavController, ModalController } from '@ionic/angular';
import { AuthenticateService } from '../services/authentication.service';

//Image picker
import { AngularFireStorage, AngularFireUploadTask } from '@angular/fire/storage';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { finalize, tap } from 'rxjs/operators';

//Canvas
import {ElementRef, Input, ViewChild } from '@angular/core';

import { ActivatedRoute } from '@angular/router';

import '@ionic/core';

import  './myscripts';


@Component({
  selector: 'app-image',
  templateUrl: './image.page.html',
  styleUrls: ['./image.page.scss'],
})
export class ImagePage implements OnInit {
      //Variables

  userEmail: string;

    //Canvas
  //'plug into' DOM canvas element using @ViewChild
  @ViewChild('canvas', {static: false}) canvasEl : ElementRef;
  //Reference Canvas object
   private _CANVAS  : any;
  // Reference the context for the Canvas element
   private _CONTEXT : any;

      //Variables end

  constructor(
    private navCtrl: NavController,
    private activatedRoute: ActivatedRoute,
    private authService: AuthenticateService,
    private storage: AngularFireStorage, 
    private database: AngularFirestore,
  ) {
   }

  //Auth the user
  ngOnInit() {
    
    this.activatedRoute.params.subscribe((params) => {
      console.log('Params: ', params);
      var idk = "https://cors-anywhere.herokuapp.com/" + params.data;
      this.testFunc(idk)
    });
    ;
    if(this.authService.userDetails()){
      this.userEmail = this.authService.userDetails().email;
    }else{
      this.navCtrl.navigateBack('');
    }
  }

  onClickFunction(event) {
    console.log('Event caught');
  } 

 

    /**
     * Detect if HTML5 Canvas is supported and, if so, configure the
     * canvas element accordingly
     *
     * @public
     * @method initialiseCanvas
     * @return {none}
     */
    ionViewDidEnter() : void
   {  console.log("init");
        this._CANVAS 		    = this.canvasEl.nativeElement;
        this._CANVAS.width  	= 500;
        this._CANVAS.height 	= 500;

        this.setupCanvas();
   }

   /**
     * Configure the Canvas element
     *
     * @public
     * @method setupCanvas
     * @return {none}
     */
    setupCanvas() : void
    {
       this._CONTEXT = this._CANVAS.getContext('2d');
       this._CONTEXT.clearRect(0, 0, this._CANVAS.width, this._CANVAS.height);
       this._CONTEXT.fillStyle = "#ff0000";
       this._CONTEXT.fillRect(0, 0, 400, 400);
       
    }

    /**
     * Create a circle using canvas drawing API
     *
     * @public
     * @method drawCircle
     * @return {none}
     */
   drawCircle() : void
   {
      this.clearCanvas();
      this._CONTEXT.beginPath();

      // x, y, radius, startAngle, endAngle
      this._CONTEXT.arc(this._CANVAS.width/2, this._CANVAS.height/2, 80, 0, 2 * Math.PI);
      this._CONTEXT.lineWidth   = 1;
      this._CONTEXT.strokeStyle = '#ffffff';
      this._CONTEXT.stroke();
   }

   /**
     * Reset the Canvas element/clear previous content
     *
     * @public
     * @method clearCanvas
     * @return {none}
     */
    clearCanvas() : void
    {
       this._CONTEXT.clearRect(0, 0, this._CANVAS.width, this._CANVAS.height);
       this.setupCanvas();
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

  testFunc(params)
  {
    
    let g = document.getElementById('grid'),
      gc = g.getContext('2d'),
      c = document.getElementById('cell'),
      cc = c.getContext('2d'),
      i = new Image();
        cc.scale(4, 4);
        i.addEventListener('load',()=>{
          gc.drawImage(i, 0, 0, 2000, 2000);
          for(let c = 250; c < 2000; c += 250){
              gc.moveTo(c, 0);
              gc.lineTo(c, 2000);
              gc.moveTo(0, c);
              gc.lineTo(2000, c);
          }
          gc.strokeStyle = 'black';
          gc.lineWidth = 5;
          gc.stroke();
          g.addEventListener('click', e=>{
              let rect = g.getBoundingClientRect(),
                  x = Math.floor((e.clientX - rect.left) / (rect.width / 8)),
                  y = Math.floor((e.clientY - rect.top) / (rect.height / 8));
              console.log(x + '-' + y);
              cc.putImageData(gc.getImageData(x * 250, y * 250, 250, 250), 0, 0);
              c.style.display = 'block';
          });
          c.addEventListener('click', e=>{
              c.style.display = 'none';
          })
      });
    i.crossOrigin="anonymous";
    i.src = params;
  }

  smallgrid(params)
  {
    
    let g = document.getElementById('grid'),
      gc = g.getContext('2d'),
      c = document.getElementById('cell'),
      cc = c.getContext('2d'),
      i = new Image();
        cc.scale(4, 4);
        i.addEventListener('load',()=>{
          gc.drawImage(i, 0, 0, 2000, 2000);
          for(let c = 250; c < 2000; c += 250){
              gc.moveTo(c, 0);
              gc.lineTo(c, 2000);
              gc.moveTo(0, c);
              gc.lineTo(2000, c);
          }
          gc.strokeStyle = 'black';
          gc.lineWidth = 5;
          gc.stroke();
          g.addEventListener('click', e=>{
              let rect = g.getBoundingClientRect(),
                  x = Math.floor((e.clientX - rect.left) / (rect.width / 8)),
                  y = Math.floor((e.clientY - rect.top) / (rect.height / 8));
              console.log(x + '-' + y);
              cc.putImageData(gc.getImageData(x * 250, y * 250, 250, 250), 0, 0);
              c.style.display = 'block';
          });
          c.addEventListener('click', e=>{
              c.style.display = 'none';
          })
      });
    i.crossOrigin="anonymous";
    i.src = params;
  }

  

}
