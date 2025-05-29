import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar } from '@ionic/angular/standalone';
import { Course, Semester, Syllabus } from 'interface';
import { UserService } from '../services/user.service';
import {IonicModule} from '@ionic/angular'

// important foir image pdf to image
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-student-syllabus',
  templateUrl: './student-syllabus.page.html',
  styleUrls: ['./student-syllabus.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class StudentSyllabusPage implements OnInit {

  syllabusList: Syllabus[] = [];
  courses: Course[] = [];
  semesters: Semester[] = [];
  selectedSemesterId: number = 0;
  constructor(private us: UserService,private sanitizer: DomSanitizer) {}


  // async loadData() {
  //   this.syllabusList = await this.us.syllabus_get_all();
  //   this.courses = await this.us.course_all();
  //   this.semesters = await this.us.semester_all();
  // }

  
  async ngOnInit() {
    await this.loadData();
    if (this.semesters.length > 0) {
      this.selectedSemesterId = this.semesters[0].id;
    }
  }

  async loadData() {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const courseId = user.course_id || 0;

    const allSyllabus = await this.us.syllabus_get_all();
    this.courses = await this.us.course_all();
    this.semesters = await this.us.semester_all();

    this.syllabusList = allSyllabus.filter((s: { course_id: any; }) => s.course_id === courseId);
  }

  getSyllabusBySemester(semId: number): Syllabus[] {
    return this.syllabusList.filter(s => s.semester_id === semId);
  }
  

  getCourseName(courseId: number): string {
    const course = this.courses.find(c => c.id === courseId);
    return course?.course_name ?? 'N/A';
  }

  getSemesterName(semesterId: number): string {
    const semester = this.semesters.find(s => s.id === semesterId);
    return semester?.semester_name ?? 'N/A';
  }

  isPDF(filePath: string): boolean {
    return filePath.toLowerCase().endsWith('.pdf');
  }

  isImage(filePath: string): boolean {
    return /\.(jpg|jpeg|png|gif)$/i.test(filePath);
  }
  getSafeUrl(filePath: string): SafeResourceUrl {
    return this.sanitizer.bypassSecurityTrustResourceUrl('http://localhost:3000/' + filePath);
  }
  
  
  
}

