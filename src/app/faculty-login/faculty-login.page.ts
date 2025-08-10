import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar } from '@ionic/angular/standalone';
import { FacultyService } from '../services/faculty.service';
import { Router } from '@angular/router';
import { AlertController, LoadingController,IonicModule } from '@ionic/angular';

@Component({
  selector: 'app-faculty-login',
  templateUrl: './faculty-login.page.html',
  styleUrls: ['./faculty-login.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class FacultyLoginPage {
  facultyEmail: string = '';
  facultyPassword: string = '';

  constructor(
    private facultyService: FacultyService,
    private router: Router,
    private alertCtrl: AlertController,
    private loadingCtrl: LoadingController
  ) {}

  async facultyLogin() {
    if (!this.facultyEmail || !this.facultyPassword) {
      this.showAlert('Please enter both email and password.');
      return;
    }

    const loading = await this.loadingCtrl.create({
      message: 'Authenticating...',
      spinner: 'crescent',
    });
    await loading.present();

    try {
      const result = await this.facultyService.authenticate(this.facultyEmail, this.facultyPassword);
      await loading.dismiss();

      if (result.ok && result.data) {
        // Store login info (optional)
        localStorage.setItem('faculty', JSON.stringify(result.data));

        // Navigate to faculty dashboard
        this.router.navigate(['/faculty-master/faculty-dashboard']);
      } else {
        this.showAlert(result.message || 'Invalid credentials.');
      }
    } catch (error) {
      await loading.dismiss();
      this.showAlert('Server error occurred. Please try again later.');
      console.error(error);
    }
  }

  async showAlert(message: string) {
    const alert = await this.alertCtrl.create({
      header: 'Login Failed',
      message,
      buttons: ['OK'],
    });
    await alert.present();
  }
}



