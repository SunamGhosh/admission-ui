import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonGrid, IonRow, IonCol, IonItem, IonLabel, IonButton } from '@ionic/angular/standalone';
import { Course, Semester } from 'interface';
import { ApiService } from '../services/api.service';
import { UserService } from '../services/user.service';
import{IonicModule} from '@ionic/angular'
@Component({
  selector: 'app-admin-university-questions',
  templateUrl: './admin-university-questions.page.html',
  styleUrls: ['./admin-university-questions.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class AdminUniversityQuestionsPage implements OnInit {

  
  selectedCourse: string | null = null;
  selectedSemester: string | null = null;
  selectedSubject: string | null = null;
  file: File | null = null;
  filePreview: string | null = null;

  courses: Course[] = [];
  semesters: Semester[] = [];
  subjects: any[] = [];
  universityQuestions: any[] = [];
  name: string = '';
  searchTerm: string = '';
  filteredQuestions: any[] = [];
  
  currentPage: number = 1;
  pageSize: number = 5;
  
  constructor(private api: ApiService, private us: UserService) {}

  ngOnInit() {
    this.loadCourses();
    this.loadSemesters();
    this.loadSubjects();
    this.loadUniversityQuestions();
  }

  async loadCourses() {
    try {
      const response = await this.us.course_all();
      if (Array.isArray(response)) this.courses = response;
    } catch (error) {
      console.error('Error loading courses:', error);
    }
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
  }

  async uploadUniversityQuestion() {
    if (!this.file || !this.selectedSemester || !this.selectedSubject || !this.selectedCourse || !this.name.trim()) {
      alert('⚠ Please fill all fields and select a file.');
      return;
    }

    try {
      const response = await this.us.uploadUniversityQuestion(
        this.selectedSemester,
        this.selectedSubject,
        this.selectedCourse,
        this.name,
        this.file
      );
      if (response.ok) {
        alert('✅ University Question uploaded successfully!');
        this.file = null;
        this.filePreview = null;
        this.name = '';
        this.loadUniversityQuestions();
      } else {
        alert('❌ Upload failed.');
      }
    } catch (err) {
      console.error('Upload error:', err);
      alert('Error uploading file.');
    }
  }

  async loadUniversityQuestions() {
    try {
      const response = await this.us.universityQuestion_get_all();
      if (Array.isArray(response)) {
        this.universityQuestions = response;
        this.filterQuestions();  // initialize filter
      }
    } catch (error) {
      console.error('Error loading university questions:', error);
    }
  }
  filterQuestions() {
    const term = this.searchTerm.trim().toLowerCase();
    this.filteredQuestions = this.universityQuestions.filter(q =>
      q.name.toLowerCase().includes(term)
    );
    this.currentPage = 1; // Reset to first page on new search
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

  paginatedQuestions(): any[] {
    const start = (this.currentPage - 1) * this.pageSize;
    return this.filteredQuestions.slice(start, start + this.pageSize);
  }
  
  nextPage() {
    if (this.currentPage * this.pageSize < this.filteredQuestions.length) {
      this.currentPage++;
    }
  }
  
  prevPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
    }
  }
  
}
