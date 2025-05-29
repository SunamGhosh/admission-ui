import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { UserService } from '../services/user.service';
import { Router, RouterModule } from '@angular/router';
import { UtilsService } from '../services/utils.service';
import { AdminService } from '../services/admin.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule,RouterModule]
})
export class LoginPage implements OnInit {
 
  passwordVisible: boolean = false; // Toggle password visibility

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

  let d = await this.us.officeauthenticate(this.email, this.password);
  if (!d.ok) {
    this.ut.toast(d.msg);
  } else {
    localStorage.setItem("user", JSON.stringify(d.data));
    localStorage.setItem("token", d.token);
    localStorage.setItem("role", "office"); // Set office role

    this.rt.navigate(['/user-university']);
  }

  await this.ut.hide_loader();
}

// password part of eye open 
togglePasswordVisibility() {
  this.passwordVisible = !this.passwordVisible;
}

  }


