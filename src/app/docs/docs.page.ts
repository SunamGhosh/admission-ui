import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar } from '@ionic/angular/standalone';
import { Course, Session, User } from 'interface';
import { UserService } from '../services/user.service';
import {IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';


@Component({
  selector: 'app-docs',
  templateUrl: './docs.page.html',
  styleUrls: ['./docs.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule,RouterModule]
})
export class DocsPage implements OnInit {
  users: User[] = [];  // List of users
  document: Document[] = [];  // List to hold documents
  selectedUserId: any = null;  // Selected user's ID (initially null)
  is_open_edit: boolean = false;  // For managing the modal open state
  selectedUserName: string = ''; // Name of the selected user

  documents: {
    id: number;
    file_name:string;
  file_path:string;
  updated_at:Date
}[]=[]

  constructor(private userService: UserService) { }

  ngOnInit() {
    this.loadUsers(); 
 
  }
  

   // Method to load all users using async/await
   async loadUsers() {
    try {
      const response = await this.userService.user_all();
      if (response && response.data) {
        this.users = response.data;
        this.filterUsers();  // 👈 this line is important
      } else {
        console.error('No users found in the response');
      }
    } catch (error) {
      console.error('Error loading users:', error);
    }
  }
  
 
  // / Load documents for the selected user
  async loadDocuments(userId: number) {
    this.selectedUserId = userId;
    console.log('Loading documents for user ID:', userId);
  
    try {
      const response = await this.userService.getUserDocuments(userId);
      console.log('API Response:', response);
  
      if (response && Array.isArray(response)) {
        this.documents = response; // Directly assign the documents array
      } else {
        console.warn('No documents found or failed to fetch documents');
        this.documents = []; // Clear documents if no data
      }
  
      console.log('Documents loaded:', this.documents);
    } catch (error) {
      console.error('Error loading documents:', error);
      this.documents = []; // Clear documents in case of an error
    }
  }
  
// Handle file download
downloadFile(filePath: string) {
  window.open(filePath, '_blank'); // Open the file in a new tab
}

  // Method to close the modal
  closeModal() {
    this.is_open_edit = false; // Close the modal
    this.documents = []; // Clear the documents array
  }


co:Course[]=[];
st:Session[]=[];

  filteredUsers: User[] = [];  // Array to hold filtered results based on search
  searchTerm: string = ''; 

 
  searchTermName: string = '';
  searchTermEmail: string = '';
  searchTermRollNo: string = '';
  currentPage: number = 1;
  itemsPerPage: number = 5; // Adjust per your UI need
  
  get paginatedUsers(): User[] {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    return this.filteredUsers.slice(start, start + this.itemsPerPage);
  }
  
  get totalPages(): number {
    return Math.ceil(this.filteredUsers.length / this.itemsPerPage);
  }
  
  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
    }
  }
  
  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
    }
  }
  
  prevPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
    }
  }
  
  filterUsers() {
    this.filteredUsers = this.users.filter(user => {
      const matchesName = this.searchTermName
        ? (user.first_name?.toLowerCase().includes(this.searchTermName.toLowerCase()) || 
           user.last_name?.toLowerCase().includes(this.searchTermName.toLowerCase()) || 
           false)
        : true;
  
      const matchesEmail = this.searchTermEmail
        ? user.email?.toLowerCase().includes(this.searchTermEmail.toLowerCase()) || false
        : true;
  
      const matchesRollNo = this.searchTermRollNo
        ? user.roll_no?.toString().includes(this.searchTermRollNo) || false
        : true;
  
      return matchesName && matchesEmail && matchesRollNo;
    });
  
    this.currentPage = 1; // Reset to page 1 after filtering
  }
  
}