import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar } from '@ionic/angular/standalone';
import { UserService } from '../services/user.service';
import { UtilsService } from '../services/utils.service';
import { Router, RouterModule } from '@angular/router';
import {IonicModule} from '@ionic/angular'

@Component({
  selector: 'app-agent-login',
  templateUrl: './agent-login.page.html',
  styleUrls: ['./agent-login.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule,RouterModule]
})
export class AgentLoginPage implements OnInit {

  constructor(private us:UserService,
    private ut:UtilsService,
    private rt:Router
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
  
    let d = await this.us.agentauthenticate(this.email, this.password);
    if (!d.ok) {
      this.ut.toast(d.msg);
    } else {
      localStorage.setItem('agent', JSON.stringify(d.data));
      localStorage.setItem('token', d.token);
      localStorage.setItem('role', 'agent'); // Save role
  
      this.rt.navigate(['/dashboard']);
    }
  
    await this.ut.hide_loader();
  }
  
    }
  

