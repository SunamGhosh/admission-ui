import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar } from '@ionic/angular/standalone';
import { IonicModule } from '@ionic/angular';  // Added IonicModule import
import { UtilsService } from '../services/utils.service';
import { UserService } from '../services/user.service';
import { Course, Session, User } from 'interface';

@Component({
  selector: 'app-university-registration',
  templateUrl: './university-registration.page.html',
  styleUrls: ['./university-registration.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class UniversityRegistrationPage implements OnInit {
 users: User[] = [];  // Array to hold all users
  filteredUsers: User[] = [];  // Array to hold filtered results based on search
  searchTerm: string = ''; 
  newUser: User = {};
  selectedUser: User ={} // Track the user being updated

  constructor(
    private utils:UtilsService,
    private us:UserService
  ) { }

  ngOnInit() {
    this.loadAllUsers();  // Fetch all users when the component is initialized
  }


  async loadAllUsers() {
    try {
      const response = await this.us.user_all();  // Assuming the service call fetches all users
      if (response.ok && Array.isArray(response.data)) {
        this.users = response.data;
        this.filteredUsers = [...this.users];  // Initialize filtered list with all users
        console.log('Loaded users:', this.users);
      } else {
        console.error('Unexpected response format:', response);
        this.users = [];  // Set an empty array if data is invalid
      }
    } catch (error) {
      console.error('Error loading users:', error);
      this.utils.toast('User Added Succesfully');
      this.users = [];  // Handle error gracefully
    }
  }



is_open_edit:boolean=false
is_open:boolean=false
  async editUser(user: User) {
    this.selectedUser = { ...user }; // Clone user to avoid directly modifying the list
    this.is_open_edit = true; // Open modal for editing
  }

  // Update user
  async updateUser() {
    if (!this.selectedUser) return;

    try {
      const response = await this.us.update(this.selectedUser); // Call update method in UserService
      if (response.ok) {
        this.utils.toast('User updated successfully!');
        this.loadAllUsers(); // Reload users after update
        this.is_open = false; // Close modal
        this.selectedUser; // Reset selection
      } else {
        this.utils.toast(' updating user.');
        window.location.reload(); // Full page reload
      }
    } catch (error) {
      console.error('Error updating user:', error);
      this.utils.toast('Error updating user. Please try again.');
    }
  }

  // Close modal without saving
  closeModal() {
    this.is_open = false;
    this.selectedUser ;
  }




  co:Course[]=[];
  st:Session[]=[];
  
  searchName: string = ''; 
  searchEmail: string = '';
  searchRoll: string = '';

    // Filtering function based on Name, Email, and Roll No.
  filterUsers() {
    const nameTerm = this.searchName.toLowerCase();
    const emailTerm = this.searchEmail.toLowerCase();
    const rollTerm = this.searchRoll.toLowerCase();

    this.filteredUsers = this.users.filter(user => {
      return (
        (!nameTerm || user.first_name?.toLowerCase().includes(nameTerm) || user.last_name?.toLowerCase().includes(nameTerm)) &&
        (!emailTerm || user.email?.toLowerCase().includes(emailTerm)) &&
        (!rollTerm || user.roll_no.toString().includes(rollTerm))
      );
    });
  }
}
  


