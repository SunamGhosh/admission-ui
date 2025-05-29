import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar } from '@ionic/angular/standalone';
import { Course, Semester } from 'interface';
import { UserService } from '../services/user.service';
import {IonicModule} from '@ionic/angular'
@Component({
  selector: 'app-admin-course-structure',
  templateUrl: './admin-course-structure.page.html',
  styleUrls: ['./admin-course-structure.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class AdminCourseStructurePage implements OnInit {

  selectedCourse: string | null = null;
  selectedSemester: string | null = null;
  semesters: Semester[] = [];
  file: File | null = null;
  filePreview: string | null = null;

  courseStructure: any[] = [];

  constructor(private us: UserService) {}

  ngOnInit() {
    this.loadSemesters();
    this.loadCourses();
    this.loadCourseStructure();
  }

  async loadSemesters() {
    try {
      const response = await this.us.semester_all();
      this.semesters = response;
    } catch (error) {
      console.error("❌ Error loading semesters:", error);
    }
  }

  onFileSelect(event: any) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.file = input.files[0];
      this.filePreview = this.file.name;
    }
  }

  async uploadCourseStructure() {
    if (!this.file || !this.selectedSemester || !this.selectedCourse) {
      alert("⚠ Please select semester and file.");
      return;
    }

    try {
      const response = await this.us.uploadCourseStructure(this.selectedSemester,this.selectedCourse, this.file);
      if (response.ok) {
        alert("✅ Course Structure uploaded successfully!");
        this.file = null;
        this.filePreview = null;
        this.loadCourseStructure();
      } else {
        alert("❌ Error uploading course structure.");
      }
    } catch (error) {
      console.error("❌ Upload error:", error);
      alert("Error uploading course structure.");
    }
  }

  async loadCourseStructure() {
    try {
      const response = await this.us.courseStructure_get_all();
      this.courseStructure = response;
    } catch (error) {
      console.error("❌ Error loading course structure:", error);
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
 courses: Course[] = [];
  
  getCourseName(id: number): string {
    const course = this.courses.find(c => c.id == id);  // use == to ignore type issues
    if (!course) {
      console.warn('Course not found for id:', id);
      console.log('Available course IDs:', this.courses.map(c => c.id));
    }
    return course?.course_name ?? 'N/A';
  }
  getSemesterName(id: number): string {
    const semester = this.semesters.find(s => s.id === id);
    return semester?.semester_name ?? 'Unknown';
  }
}
