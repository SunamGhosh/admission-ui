import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar } from '@ionic/angular/standalone';
import {IonicModule} from '@ionic/angular'
import { UserService } from '../services/user.service';
import { UtilsService } from '../services/utils.service';
import { Router, RouterModule } from '@angular/router';
import { ApiService } from '../services/api.service';
import { ApplyService } from '../services/apply.service';

@Component({
  selector: 'app-student-login',
  templateUrl: './student-login.page.html',
  styleUrls: ['./student-login.page.scss'],
  standalone: true,
  imports: [IonicModule ,CommonModule, FormsModule,RouterModule]
})
export class StudentLoginPage implements OnInit {

  email: string = "";
  password: string = "";
mobile: string = "";

  isStudent: boolean = false;

  constructor(
    private us: UserService,
    private ut: UtilsService,
    private rt: Router,
    private aps:ApplyService
  ) {}

  ngOnInit() {
    // Check user role on page load
    const user = JSON.parse(localStorage.getItem('user') || '{}');
  
  }

  async login() {
    if (!this.email || !this.password) {
      this.ut.toast("Please enter email and password");
      return;
    }
  
    await this.ut.show_loader("Authenticating...");
  
    let d = await this.us.authenticate(this.email, this.password);
  
    if (d.ok) {
      console.log("✅ Logged in user with course/semester:", JSON.stringify(d.data, null, 2));

      localStorage.setItem("user", JSON.stringify(d.data));            // 👈 Make sure `d.data` has course/semester
      localStorage.setItem("token", d.token);
      localStorage.setItem("role", "student");
      this.rt.navigate(['/dashboard']);
    }
  
    await this.ut.hide_loader();
  }
  
}