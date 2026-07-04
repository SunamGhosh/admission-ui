import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar } from '@ionic/angular/standalone';
import { IonicModule } from '@ionic/angular';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { Course, Semester } from 'interface';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-student-assignment',
  templateUrl: './student-assignment.page.html',
  styleUrls: ['./student-assignment.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class StudentAssignmentPage implements OnInit {
assignments: any[] = [];
  courses: Course[] = [];
  semesters: Semester[] = [];
  subjects: any[] = [];
  selectedSemesterId: number = 0;
  constructor(private us: UserService, private sanitizer: DomSanitizer) {}

  async ngOnInit() {
    await this.loadData();
    if (this.semesters.length > 0) {
      this.selectedSemesterId = this.semesters[0].id;
    }
  }

  async loadData() {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const courseId = user.course_id || 0;

    const allAssignments = await this.us.assignment_get_all();
    this.courses = await this.us.course_all();
    this.semesters = await this.us.semester_all();
    this.subjects = await this.us.subject_all();

    this.assignments = allAssignments.filter((a: { course_id: any }) => a.course_id === courseId);
  }

  getFilteredAssignments(): any[] {
    return this.assignments.filter(a => a.semester_id === this.selectedSemesterId);
  }
  getCourseName(courseId: number): string {
    return this.courses.find(c => c.id === courseId)?.course_name ?? 'N/A';
  }

  getSemesterName(semesterId: number): string {
    return this.semesters.find(s => s.id === semesterId)?.semester_name ?? 'N/A';
  }

  getSubjectName(subjectId: number): string {
    return this.subjects.find(s => s.id === subjectId)?.subject_name ?? 'N/A';
  }

  isPDF(filePath: string): boolean {
    return filePath.toLowerCase().endsWith('.pdf');
  }

  isImage(filePath: string): boolean {
    return /\.(jpg|jpeg|png|gif)$/i.test(filePath);
  }

  getSafeUrl(filePath: string): SafeResourceUrl {
    return this.sanitizer.bypassSecurityTrustResourceUrl('https://admission-api-suyk.onrender.com/' + filePath);
  }
}

