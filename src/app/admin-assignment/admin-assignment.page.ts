import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar } from '@ionic/angular/standalone';
import { Course, Semester } from 'interface';
import { ApiService } from '../services/api.service';
import { UserService } from '../services/user.service';
import {IonicModule} from '@ionic/angular'
@Component({
  selector: 'app-admin-assignment',
  templateUrl: './admin-assignment.page.html',
  styleUrls: ['./admin-assignment.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class AdminAssignmentPage implements OnInit {

  selectedCourse: string | null = null;
  selectedSemester: string | null = null;
  selectedSubject: string | null = null;
  file: File | null = null;
  filePreview: string | null = null;
  name: string = ''; // <-- add this line

  courses: Course[] = [];
  semesters: Semester[] = [];
  subjects: any[] = [];
  assignments: any[] = [];

  constructor(private api: ApiService, private us: UserService) {}

  ngOnInit() {
    this.loadCourses();
    this.loadSemesters();
    this.loadSubjects();
    this.loadAssignments();
  }

 

  async loadSemesters() {
    try {
      const response = await this.us.semester_all();
      if (Array.isArray(response)) this.semesters = response;
    } catch (error) {
      console.error('Error loading semesters:', error);
    }
  }

  async loadSubjects() {
    try {
      const response = await this.us.subject_all();
      if (Array.isArray(response)) this.subjects = response;
    } catch (error) {
      console.error('Error loading subjects:', error);
    }
  }

  onFileSelect(event: any) {
    const input = event.target as HTMLInputElement;
    if (input.files?.length) {
      this.file = input.files[0];
      this.filePreview = this.file.name;
    }
  }async uploadAssignment() {
    // Validate input fields
    if (!this.file || !this.selectedSemester || !this.selectedSubject || !this.selectedCourse || !this.name?.trim()) {
      alert('⚠ Please fill all fields including the assignment name, and choose a file.');
      return;
    }
  
    try {
      // Call the service to upload assignment
      const res = await this.us.uploadAssignment(
        this.selectedSemester,
        this.selectedSubject,
        this.selectedCourse,
        this.name,
        this.file
      );
  
      // Handle response
      if (res.ok) {
        alert('✅ Assignment uploaded successfully!');
        
        // Reset fields
        this.name = '';
        this.file = null;
        this.filePreview = null;
  
        // Reload assignment list
        this.loadAssignments();
      } else {
        alert('❌ Upload failed. Please try again.');
      }
    } catch (err) {
      console.error('🚨 Upload error:', err);
      alert('❌ Error uploading file. Please check your internet connection or try again later.');
    }
  }
  
  async loadAssignments() {
    try {
      const res = await this.us.assignment_get_all();
      if (Array.isArray(res)) {
        this.assignments = res;
        this.filterAssignments(); // filter based on current searchTerm
      }
    } catch (err) {
      console.error('Error loading assignments:', err);
    }
  }
  
 async loadCourses() {
    try {
      const response = await this.us.course_all();
      if (Array.isArray(response)) this.courses = response;
    } catch (error) {
      console.error('Error loading courses:', error);
    }
  }
  
  getCourseName(id: number): string {
    const course = this.courses.find(c => c.id == id);  // use == to ignore type issues
    if (!course) {
      console.warn('Course not found for id:', id);
      console.log('Available course IDs:', this.courses.map(c => c.id));
    }
    return course?.course_name ?? 'N/A';
  }
  getSemesterName(id: number): string {
    return this.semesters.find(s => s.id === id)?.semester_name ?? 'N/A';
  }

  getSubjectName(id: number): string {
    return this.subjects.find(s => s.id === id)?.subject_name ?? 'N/A';
  }




  searchTerm: string = '';
filteredAssignments: any[] = [];
currentPage: number = 1;
pageSize: number = 5; // You can adjust as needed
filterAssignments() {
  this.filteredAssignments = this.assignments.filter(a =>
    a.name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
    this.getCourseName(a.course_id).toLowerCase().includes(this.searchTerm.toLowerCase()) ||
    this.getSemesterName(a.semester_id).toLowerCase().includes(this.searchTerm.toLowerCase()) ||
    this.getSubjectName(a.subject_id).toLowerCase().includes(this.searchTerm.toLowerCase())
  );
  this.currentPage = 1;
}

paginatedAssignments() {
  const start = (this.currentPage - 1) * this.pageSize;
  return this.filteredAssignments.slice(start, start + this.pageSize);
}

nextPage() {
  if (this.currentPage * this.pageSize < this.filteredAssignments.length) {
    this.currentPage++;
  }
}

prevPage() {
  if (this.currentPage > 1) {
    this.currentPage--;
  }
}

}

