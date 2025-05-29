import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonCardContent, IonItem, IonLabel, IonButton } from '@ionic/angular/standalone';
import { Course, Semester, Session, User } from 'interface';
import { UserService } from '../services/user.service';
import { UtilsService } from '../services/utils.service';
import {IonicModule} from '@ionic/angular'
import { ApiService } from '../services/api.service';
import { UniversityService } from '../services/university.service';

@Component({
  selector: 'app-quickadmission',
  templateUrl: './quickadmission.page.html',
  styleUrls: ['./quickadmission.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class QuickadmissionPage implements OnInit {
   users: User[] = [];  // Array to hold all users
    filteredUsers: User[] = [];  // Array to hold filtered results based on search
    searchTerm: string = ''; 
    newUser: User = {};

  constructor(
    private us:UserService,
    private utils:UtilsService,
    private api:ApiService,
    private universityService: UniversityService
  ) { }

  ngOnInit() {
    this.loader();
    this.loaders();
    this.loading();
    this.getNextId();
    this.loadUniversities()
    this.fetchNextRollNo()
  }
  filter:any={
    course_id:0,
    semester_id:0,
    session_id:0,
  }


  async addUser() {
    if (!this.newUser.first_name || !this.newUser.last_name || !this.newUser.email || !this.newUser.password) {
      this.utils.toast('Please fill in all required fields.');
      return;
    }

    try {
      const response = await this.us.add(this.newUser);  // Assuming addUser is defined in UserService
      if (response.ok) {
        this.utils.toast('User added successfully!');
         // Reload the user list after adding
        this.resetForm();  // Reset form fields
      } else {
        this.utils.toast('User added.');
      }
    } catch (error) {
      console.error('Error adding user:', error);
      this.utils.toast('Error adding user. Please try again.');
    }
  }

  // Function to reset form fields
  resetForm() {
    this.newUser = {};
  }



  
  co:Course[]=[];
  st:Session[]=[];
  
    
    async loading() {
      this.co = await this.us.course_all();
      console.log('Courses loaded:', this.co); // Log to check if courses are being set
    }
   
    
    
    se: Session[]=[];
    async loader(){
      this.st= await this.us.session_all()
    }
  
    
  
    sem: Semester[]=[];
    async loaders(){
      this.sem= await this.us.semester_all()
    }
  


      
// TO SHOW ID

async getNextId() {
  try {
    const response = await this.api.post('/user/next-id', {}); // Call the API to get the next ID
    if (response.ok) {
      this.newUser.id = response.nextId; // Set the next ID in the form
    } else {
      console.error('Error fetching next ID:', response.msg);
      this.utils.toast('Failed to fetch the next ID.'); // Optional: Show a notification
    }
  } catch (error) {
    console.error('Error:', error);
    this.utils.toast('An error occurred while fetching the next ID.'); // Optional: Show a notification
  }
}





// university fetch
selectedUniversity: {
  id: number;
  university_name: string;
  short_name: string;
  image: string;
  link: string;
} | null = null; // Holds the selected university


universities: {
  id: number;
  university_name: string;
  short_name: string;
  image: string;
  link: string;
}[] = [];

async fetchNextRollNo() {
  try {
    const rollNo = await this.us.next_roll();
    this.newUser.roll_no = rollNo;
    
  } catch (error) {
    console.error("Error fetching next roll number:", error);
  }
}


async loadUniversities() {
  try {
    const response = await this.universityService.getAll();
    console.log('Universities API Response:', response); // Debug response
    if (response.ok && Array.isArray(response.data)) {
      this.universities = response.data.map((u: any) => ({
        id: u.id,
        university_name: u.university_name,
        short_name: u.short_name,
        image: '../../assets/default_image.jpg', // Placeholder image
        link: `/course/${u.id}`, // Pass the actual ID in the link
      }));
     // Corrected way to get university_id from localStorage
     let id = localStorage.getItem("university_id");
     console.log("Stored University ID:", id);
   } else {
     console.error('Unexpected response format:', response);
     this.universities = []; // Handle invalid data
   }
 } catch (error) {
   console.error('Error loading universities:', error);
   this.universities = [];
 }
}


emailError: string = '';

validateEmail() {
  const email = this.newUser.email || '';  // Avoids "undefined" error
  const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  
  console.log(email);
  
  if (!emailPattern.test(email)) {
    this.emailError = 'Invalid email format. Compulsory to use: @gmail.com';
  } else {
    this.emailError = '';
  }
}

async fetchUniversityData(id: string) {
  try {
    const response = await this.universityService.getById(id);

    if (response && response.ok && response.data) {
      this.selectedUniversity = response.data; // Assign fetched university
    } else {
      console.error('Failed to fetch university:', response?.msg || 'Unknown error');
      this.selectedUniversity = null;
    }
  } catch (error) {
    console.error('Error fetching university:', error);
    this.selectedUniversity = null;
  }
}

onUniversityChange(event: any) {
  const universityId = event.detail.value;
  this.selectedUniversity = this.universities.find(u => u.id === universityId) || null;
  localStorage.setItem("university_id", universityId);
}

}
