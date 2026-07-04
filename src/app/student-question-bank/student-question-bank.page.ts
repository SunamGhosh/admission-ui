import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar } from '@ionic/angular/standalone';
import { IonicModule } from '@ionic/angular';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

import { Course, Semester, Question_Bank } from 'interface';
import { UserService } from '../services/user.service';
@Component({
  selector: 'app-student-question-bank',
  templateUrl: './student-question-bank.page.html',
  styleUrls: ['./student-question-bank.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class StudentQuestionBankPage implements OnInit {

  questionBanks: Question_Bank[] = [];
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

    const allQuestionBanks = await this.us.questionBank_get_all();
    this.courses = await this.us.course_all();
    this.semesters = await this.us.semester_all();
    this.subjects = await this.us.subject_all();

    this.questionBanks = allQuestionBanks.filter((q: any) => q.course_id === courseId);
  }

  getQuestionsBySemester(semId: number): Question_Bank[] {
    return this.questionBanks.filter(q => q.semester_id === semId);
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
