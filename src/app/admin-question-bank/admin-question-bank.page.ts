import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar } from '@ionic/angular/standalone';
import { Course, Question_Bank, Semester } from 'interface';
import { ApiService } from '../services/api.service';
import { UserService } from '../services/user.service';
import {IonicModule} from '@ionic/angular'

@Component({
  selector: 'app-admin-question-bank',
  templateUrl: './admin-question-bank.page.html',
  styleUrls: ['./admin-question-bank.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class AdminQuestionBankPage implements OnInit {
  selectedCourse: string | null = null;
  selectedSemester: string | null = null;
  selectedSubject: string | null = null;

  file: File | null = null;
  filePreview: string | null = null;
  name: string = ''; // ✅ Title of the uploaded file
  courses: Course[] = [];
  semesters: Semester[] = [];
  questionBanks: Question_Bank[] = [];

  constructor(private api: ApiService, private us: UserService) {}

  ngOnInit() {
    this.loadCourses();
    this.loadSemesters();
    this.loadQuestionBanks();
    this.loadSubjects()
  }

  async loadCourses() {
    try {
      const response = await this.us.course_all();
      if (Array.isArray(response)) this.courses = response;
    } catch (error) {
      console.error("❌ Error loading courses:", error);
    }
  }

  async loadSemesters() {
    try {
      const response = await this.us.semester_all();
      if (Array.isArray(response)) this.semesters = response;
    } catch (error) {
      console.error("❌ Error loading semesters:", error);
    }
  }
  subjects: any[] = [];

// Load all subjects
async loadSubjects() {
  try {
    const response = await this.us.subject_all(); // Replace with your actual service method
    if (Array.isArray(response)) {
      this.subjects = response;
      console.log('Subjects loaded:', this.subjects);
    }
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
  }

  async uploadQuestionBank() {
    if (!this.selectedSemester || !this.selectedSubject || !this.selectedCourse|| !this.name.trim() || !this.file) {
      alert("⚠ Please fill all fields including file name and select a file.");
      return;
    }
  
    try {
      const response = await this.us.uploadQuestionBank(
        this.selectedSemester,
        this.selectedSubject,
        this.selectedCourse,
        this.name,
        this.file
      );
  
      if (response.ok) {
        alert("✅ Question Bank uploaded successfully!");
        this.name = '';
        this.file = null;
        this.filePreview = null;
        this.loadQuestionBanks();
      } else {
        alert("❌ Failed to upload.");
      }
    } catch (err) {
      console.error("Upload Error:", err);
      alert("❌ Error uploading file.");
    }
  }
  
  getSubjectName(subjectId: number): string {
    const subject = this.subjects.find(s => s.id === subjectId);
    return subject?.subject_name ?? 'N/A';
  }
  
  async loadQuestionBanks() {
    try {
      const response = await this.us.questionBank_get_all();
      if (Array.isArray(response)) {
        this.questionBanks = response;
        this.filterQuestionBanks();
      }
    } catch (error) {
      console.error("❌ Error fetching Question Banks:", error);
    }
  }
  

  getCourseName(id: number): string {
    const course = this.courses.find(c => c.id === id);
    return course?.course_name ?? "N/A";
  }

  getSemesterName(id: number): string {
    const semester = this.semesters.find(s => s.id === id);
    return semester?.semester_name ?? "N/A";
  }


  searchTerm: string = '';
filteredQuestionBanks: Question_Bank[] = [];
currentPage: number = 1;
pageSize: number = 5;
filterQuestionBanks() {
  const term = this.searchTerm.toLowerCase();
  this.filteredQuestionBanks = this.questionBanks.filter(qb =>
    qb.name?.toLowerCase().includes(term) ||
    qb.file_name.toLowerCase().includes(term) ||
    this.getCourseName(qb.course_id).toLowerCase().includes(term) ||
    this.getSemesterName(qb.semester_id).toLowerCase().includes(term) ||
    this.getSubjectName(qb.subject_id).toLowerCase().includes(term)
  );
  this.currentPage = 1;
}

paginatedQuestionBanks() {
  const start = (this.currentPage - 1) * this.pageSize;
  return this.filteredQuestionBanks.slice(start, start + this.pageSize);
}

nextPage() {
  if (this.currentPage * this.pageSize < this.filteredQuestionBanks.length) {
    this.currentPage++;
  }
}

prevPage() {
  if (this.currentPage > 1) {
    this.currentPage--;
  }
}

}


