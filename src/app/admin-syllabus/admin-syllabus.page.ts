import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar } from '@ionic/angular/standalone';
import { ApiService } from '../services/api.service';
import { UserService } from '../services/user.service';
import{IonicModule} from '@ionic/angular'
import { Course, Semester, Session, Syllabus } from 'interface';

@Component({
  selector: 'app-admin-syllabus',
  templateUrl: './admin-syllabus.page.html',
  styleUrls: ['./admin-syllabus.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class AdminSyllabusPage implements OnInit {
  selectedCourse: string | null = null;
  selectedSemester: string | null = null;
  selectedSession: string | null = null;
  file: File | null = null;
  filePreview: string | null = null;

  courses: Course[] = [];
  semesters: Semester[] = [];
  sessions: Session[] = [];

  constructor(private apiService: ApiService, private us: UserService) {}

  ngOnInit(){
    this.loadCourses();
    this.loadSemesters();
    this.loadSessions();
    this.loadSyllabus()
  }

  async loadCourses() {
    try {
      const response = await this.us.course_all();
      console.log("Courses response:", response); // ✅ Add this
      if (Array.isArray(response)) this.courses = response;
    } catch (error) {
      console.error('Error loading courses:', error);
    }
  }
  
  async loadSemesters() {
    try {
      const response = await this.us.semester_all();
      console.log("Semesters response:", response); // ✅ Add this
      if (Array.isArray(response)) this.semesters = response;
    } catch (error) {
      console.error('Error loading semesters:', error);
    }
  }
  

  /** 🔹 Load Sessions from API */
  async loadSessions() {
    try {
      const response = await this.us.session_all();
      console.log("Session API Response:", response);

      if (response && Array.isArray(response)) {
        this.sessions = response;
        console.log("✅ Sessions Loaded:", this.sessions);
      } else {
        console.error("❌ Error: No sessions found.");
      }
    } catch (error) {
      console.error("❌ Error loading sessions:", error);
    }
  }

  /** 📂 File Selection for Syllabus Upload */
  onFileSelect(event: any) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.file = input.files[0];
      this.filePreview = this.file.name;
      console.log("📁 Selected file:", this.file);
    } else {
      console.warn("⚠ No file selected.");
    }
  }

  /** 📤 Upload Syllabus File */
  async uploadSyllabus() {
    if (!this.file || !this.selectedSemester|| !this.selectedCourse  ) {
      alert("⚠ Please select course, semester, session, and file.");
      return;
    }

    try {
      const response = await this.us.uploadSyllabus( this.selectedSemester,this.selectedCourse, this.file);
      if (response.ok) {
        alert("✅ Syllabus uploaded successfully!");
        this.file = null;
        this.filePreview = null;
      } else {
        alert("❌ Error uploading syllabus.");
      }
    } catch (error) {
      console.error("❌ Upload error:", error);
      alert("Error uploading syllabus. Please try again.");
    }
  }




Syllabus:Syllabus[]=[]

 /** 🔹 Load Syllabus from API */
async loadSyllabus() {
  try {
    const response = await this.us.syllabus_get_all();
    console.log("Syll API Response:", response);

    if (response && Array.isArray(response)) {
      this.Syllabus = response; // ✅ FIXED: bind to correct array
      console.log("✅ Syllabus Loaded:", this.Syllabus);
    } else {
      console.error("❌ Error: No Syllabus found.");
    }
  } catch (error) {
    console.error("❌ Error loading syllabus:", error);
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


}



