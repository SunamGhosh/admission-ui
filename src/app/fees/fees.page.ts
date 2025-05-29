import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar } from '@ionic/angular/standalone';
import { Router } from '@angular/router';
import { Common } from 'interface';
import {IonicModule} from '@ionic/angular'
@Component({
  selector: 'app-fees',
  templateUrl: './fees.page.html',
  styleUrls: ['./fees.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class FeesPage implements OnInit {

  user: Common | null = null; // Store user or admin data
   isAdminLoggedIn: boolean = false; // Flag to differentiate roles
 
   constructor(private router: Router) {}
 
   ngOnInit() {
     // Retrieve user or admin data from local storage
     const userData = localStorage.getItem('user');
     const adminData = localStorage.getItem('admin');
 
     if (userData) {
       this.user = JSON.parse(userData) as Common;
       this.isAdminLoggedIn = false; // It's a regular user
     } else if (adminData) {
       this.user = JSON.parse(adminData) as Common;
       this.isAdminLoggedIn = true; // It's an admin
     }
 
     console.log('Logged-in User/Admin:', this.user); // Debugging purposes
   }
 
   // Logout method to clear user/admin data and redirect to login
   logout() {
     localStorage.removeItem('user'); // Clear user data
     localStorage.removeItem('admin'); // Clear admin data
     localStorage.removeItem('token'); // Clear token if stored
     localStorage.clear()
     this.router.navigate(['/login']); // Redirect to login page
   }

  

}
