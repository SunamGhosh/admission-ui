import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar } from '@ionic/angular/standalone';
import {IonicModule} from '@ionic/angular'
import { UserService } from '../services/user.service';
import { ToastController } from '@ionic/angular';
import { AlertController } from '@ionic/angular';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { Common } from 'interface';
@Component({
  selector: 'app-whatsapp',
  templateUrl: './whatsapp.page.html',
  styleUrls: ['./whatsapp.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule,RouterModule]
})
export class WhatsappPage implements OnInit {

  msg: string = '';
  name: any;
  user: Common | null = null;
  isAdminLoggedIn: boolean = false;
  isStudent: boolean = false;
  role: string = '';
  isAdmin: boolean = false;

  constructor(
    private userService: UserService,
    private toastCtrl: ToastController,
    private alertCtrl: AlertController,
    private activatedRoute: ActivatedRoute
  ) {}

  ngOnInit() {
    this.loadUserRole();

    // If this component is also used with dynamic ID routes
    const id = this.activatedRoute.snapshot.paramMap.get('id');
    if (id) {
      this.fetchUniversityData(id);
    }
  }

  /**
   * Sends the WhatsApp reminder after validating the message.
   */
  async sendReminder() {
    if (!this.msg.trim()) {
      this.showToast('Please enter a message.');
      return;
    }

    try {
      await this.userService.sendExamReminder(this.msg);
      this.showToast('Reminder sent successfully!');
      this.msg = '';
    } catch (error) {
      this.showToast('Failed to send reminder.');
      console.error(error);
    }
  }

  /**
   * Replaces placeholders in the message to preview what the user will see.
   */
  getPreview(): string {
    return this.msg.replace(/{{name}}/gi, 'Sample User');
  }

  /**
   * Shows a toast message.
   */
  async showToast(message: string) {
    const toast = await this.toastCtrl.create({
      message,
      duration: 2000,
      position: 'bottom',
    });
    await toast.present();
  }

  /**
   * Loads role and user data from localStorage
   */
  loadUserRole() {
    const userData = localStorage.getItem('user');
    const adminData = localStorage.getItem('admin');
    const agentData = localStorage.getItem('agent');
    this.role = localStorage.getItem('role') || '';

    if (userData) {
      this.user = JSON.parse(userData) as Common;
      this.isAdminLoggedIn = false;
      this.isStudent = this.role === 'student';
      this.isAdmin = this.role === 'admin';
    } else if (adminData) {
      this.user = JSON.parse(adminData) as Common;
      this.isAdminLoggedIn = true;
      this.isStudent = this.user?.role === 'student';
      this.isAdmin = this.user?.role === 'admin';
    } else if (agentData) {
      const agent = JSON.parse(agentData);
      this.user = {
        first_name: agent.agent_name,
        last_name: '',
        email: agent.email,
        DOB: agent.DOB || 'N/A',
        father_name: agent.father_name || 'N/A',
        mother_name: agent.mother_name || 'N/A',
        mobile: agent.mobile || agent.phone || 'N/A',
        role: 'agent'
      };
      this.isAdminLoggedIn = false;
      this.isStudent = false;
      this.isAdmin = false;
    }

    console.log('Logged-in User/Admin:', this.user);
  }

  /**
   * (Optional) Fetch university data by ID (dummy placeholder).
   */
  fetchUniversityData(id: string) {
    console.log(`Fetch university data for ID: ${id}`);
    // Implement logic to fetch university data
  }

   logout() {
    localStorage.removeItem("token");
    window.location.href = "/login";
  }
}