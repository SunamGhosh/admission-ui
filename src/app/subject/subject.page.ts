import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonButton, IonList, IonItem, IonLabel, IonModal, IonButtons } from '@ionic/angular';
import { Course, Elective, Semester, Session, Subject } from 'interface';
import { UserService } from '../services/user.service';
import { UtilsService } from '../services/utils.service';
import {IonicModule } from '@ionic/angular';
import { ApiService } from '../services/api.service';


@Component({
  selector: 'app-subject',
  templateUrl: './subject.page.html',
  styleUrls: ['./subject.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class SubjectPage implements OnInit {
  subjects: Subject[] = [];  // Array to hold all subjects
  filteredSubjects: Subject[] = [];  // Array to hold filtered subjects based on search
  searchTerm: string = ''; 
  newSubject: Subject = {  id: null, // To store the next ID,
   subject_name: '', subject_short_name: '' , 
   };  // Initialize new subject
  is_open: boolean = false;  // Flag to control modal visibility

  constructor(
    private us: UserService,
    private utils: UtilsService,
    private api:ApiService
  ) { }

  ngOnInit() {
    this.loadAllSubjects();  // Fetch all subjects when the component is initialized
    this.loadinge();
   this.loaders()
    this.loadinger();
    this.getNextId()
  }

  // Function to open modal and prepare for adding a new subject
  async is_modal_open() {
    this.newSubject.subject_name = '';
    this.newSubject.subject_short_name = '';
    this.is_open = true;
  }



  co:Course[]=[];
  st:Session[]=[];
  
    
    async loadinge() {
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
  
  

  // Function to load all subjects from the service
  async loadAllSubjects() {
    try {
      const response = await this.us.subject_all();
      console.log('API response:', response); // Log the response
      
      // Assuming response is an array directly
      if (Array.isArray(response)) {
        this.subjects = response;
        this.filteredSubjects = [...this.subjects];  // Initialize filtered list with all subjects
      } else {
        console.error('Unexpected response format:', response);
        this.subjects = [];  // Set an empty array if data is invalid
      }
    } catch (error) {
      console.error('Error loading subjects:', error);
      this.utils.toast('Error loading subjects.');
      this.subjects = [];  // Handle error gracefully
    }
  }

  selectedCourse: number | null = null;
selectedSemester: number | null = null;
selectedSession: number | null = null;

// Function to filter subjects based on search, course, semester, and session
filterSubjects() {
  this.filteredSubjects = this.subjects.filter(subject => {
    const matchesSearch = this.searchTerm
      ? subject.subject_name?.toLowerCase().includes(this.searchTerm.toLowerCase())
      : true;

    const matchesCourse = this.selectedCourse
      ? subject.course_id === this.selectedCourse
      : true;

    const matchesSemester = this.selectedSemester
      ? subject.semester_id === this.selectedSemester
      : true;

   

    return matchesSearch && matchesCourse && matchesSemester;
  });
}


  // Function to add a new subject
  async addSubject() {
    if (!this.newSubject.subject_name || !this.newSubject.subject_short_name) {
      this.utils.toast('Please fill in both subject name and short name.');
      return;
    }

    try {
      const response = await this.us.adding(this.newSubject);  // Assuming 'adding' is the method in UserService for adding subjects
      if (response.ok) {
        this.utils.toast('Subject added successfully!');
        this.loadAllSubjects();  // Reload the subject list after adding
        this.resetForm();  // Reset form fields
      } else {
        this.utils.toast(' adding subject.');
        window.location.reload()
      }
    } catch (error) {
      console.error('Error adding subject:', error);
      this.utils.toast('Error adding subject. Please try again.');
    }
  }

  // Function to reset form fields
  resetForm() {
    this.newSubject = { subject_name: '', subject_short_name: ''  };
  }

  filter:any={
    course_id:0,
  elective_id:0,
semester_id:0}
  // for course cdropdown 


el:Elective[]=[]
async loadinger() {
  this.el = await this.us.elective_all();
  console.log('Electives loaded into el:', this.el); 
}

  
 

// TO SHOW ID

async getNextId() {
  try {
    const response = await this.api.post('/subject/next-id', {}); // Call the API to get the next ID
    if (response.ok) {
      this.newSubject.id = response.nextId; // Set the next ID in the form
    } else {
      console.error('Error fetching next ID:', response.msg);
      this.utils.toast('Failed to fetch the next ID.'); // Optional: Show a notification
    }
  } catch (error) {
    console.error('Error:', error);
    this.utils.toast('An error occurred while fetching the next ID.'); // Optional: Show a notification
  }
}





getCourseName(courseId: number): string {
  const course = this.co.find(c => c.id === courseId);
  return course?.course_name ?? 'N/A'; // Use optional chaining and nullish coalescing
}




// get semester name by id
getsemesterName(semesterId: number): string {
  const semester = this.sem.find(s => s.id === semesterId);
  return semester?.semester_name ?? 'N/A'; // Use optional chaining and nullish coalescing
}

}
