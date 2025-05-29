import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonButtons, IonBackButton } from '@ionic/angular/standalone';
import { ApplyOnline, Course_Student } from 'interface';
import { ApplyService } from '../services/apply.service';
import { UtilsService } from '../services/utils.service';

@Component({
  selector: 'app-agent-student-getall',
  templateUrl: './agent-student-getall.page.html',
  styleUrls: ['./agent-student-getall.page.scss'],
  standalone: true,
  imports: [IonBackButton, IonButtons, IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule]
})
export class AgentStudentGetallPage implements OnInit {

  


  constructor(
    private aps:ApplyService,
    private utils:UtilsService
  ) { }

  ngOnInit() {
    this.loadAllUsers()
    this.loadCourses()
  }
users: ApplyOnline[] = [];  // Array to hold all users
  filteredUsers: ApplyOnline[] = [];  // Array to hold filtered results based on search
  searchTerm: string = '';

  async loadAllUsers() {
    try {
      const response = await this.aps.online_all();  // Assuming the service call fetches all users
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



  co:Course_Student[]=[];

  
// get coursename using id
getCourseName(courseId: number): string {
  const course = this.co.find(c => c.id === courseId);
  return course?.course_name ?? 'N/A'; // Use optional chaining and nullish coalescing
}
async loadCourses() {
  try {
    const response = await this.aps.applycourse_all(); // Assuming this API fetches courses
    if (response.ok && Array.isArray(response.courses)) {  // ✅ Correct key
      this.co = response.courses;  // ✅ Assign the correct data
      console.log('Courses loaded:', this.co);
    } else {
      console.error('Unexpected response format:', response);
      this.co = [];
    }
  } catch (error) {
    console.error('Error loading courses:', error);
    this.co = [];
  }
}

}
