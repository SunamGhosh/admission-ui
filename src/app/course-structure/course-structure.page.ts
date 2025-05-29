import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonCard } from '@ionic/angular/standalone';
import {IonicModule} from '@ionic/angular'
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { Course, Semester } from 'interface';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-course-structure',
  templateUrl: './course-structure.page.html',
  styleUrls: ['./course-structure.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class CourseStructurePage implements OnInit {
  structureList: any[] = [];
  courses: Course[] = [];
  semesters: Semester[] = [];

  constructor(private us: UserService, private sanitizer: DomSanitizer) {}

  ngOnInit() {
    this.loadData();
  }

  async loadData() {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const courseId = user.course_id || 0;
    const semesterId = user.semester_id || 0;

    const allStructures = await this.us.courseStructure_get_all();
    this.courses = await this.us.course_all();
    this.semesters = await this.us.semester_all();

    this.structureList = allStructures.filter((s: any) =>
      s.course_id === courseId || s.semester_id === semesterId
    );
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


