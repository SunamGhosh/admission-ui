import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonCardContent } from '@ionic/angular/standalone';
import { UtilsService } from '../services/utils.service';
import { UserService } from '../services/user.service';
import { Router } from '@angular/router';
import { AdminService } from '../services/admin.service';
import { IonicModule } from '@ionic/angular';

@Component({
  selector: 'app-admin-login',
  templateUrl: './admin-login.page.html',
  styleUrls: ['./admin-login.page.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule,IonicModule]
})
export class AdminLoginPage implements OnInit {

  constructor(
     private ut: UtilsService,
        private us:UserService,
        private rt:Router,
        private ad:AdminService
  ) { }

  ngOnInit() {


  }


  email: string = ""
  password: string = ""
  async login() {
    if (!this.email || !this.password) {
      this.ut.toast("Please enter email and password");
      return;
    }
  
    await this.ut.show_loader("Authenticating...");
  
    let d = await this.ad.authenticate(this.email, this.password);
    if (!d.ok) {
      this.ut.toast(d.msg);
    } else {
      localStorage.setItem('admin', JSON.stringify(d.data));
      localStorage.setItem('token', d.token);
      localStorage.setItem('role', 'admin'); // Save role
  
      this.rt.navigate(['/university']);
    }
  
    await this.ut.hide_loader();
  }
  
    }
  


