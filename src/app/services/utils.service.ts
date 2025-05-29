import { Injectable } from '@angular/core';
import { LoadingController, ToastController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class UtilsService {

  constructor( private ts: ToastController,
    private lc: LoadingController
    ) { }
    
  
  async toast(msg: string){
    let t= await this.ts.create({
      message: msg,
      duration: 2000,
    });
    await t.present();
  }
  
  async show_loader(msg:string){
    const l = await this.lc.create({
      message:msg,
    })
    await l.present();
  }
  
  async hide_loader(){
    await this.lc.dismiss()
  }
  
  
}
