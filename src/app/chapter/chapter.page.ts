import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { Chapter, Course, Semester, Subject } from 'interface';
import { UserService } from '../services/user.service';
import { UtilsService } from '../services/utils.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-chapter',
  templateUrl: './chapter.page.html',
  styleUrls: ['./chapter.page.scss'],
  standalone: true,
  imports: [IonicModule, FormsModule,CommonModule],
})
export class ChapterPage implements OnInit {
  co: Course[] = [];
  sem: Semester[] = [];
  sub: Subject[] = [];
  chapter: Chapter[] = [];
  filteredChapter: Chapter[] = [];

  selectedCourse: number | null = null;
  selectedSemester: number | null = null;

  newChapter: Chapter = {
    chapter_name: '',
    chapter_no: '',
    subject_id: 0,
    semester_id: 0,
    course_id: 0
  };
openEdit: any;

  constructor(private us: UserService, private utils: UtilsService) {}

  async ngOnInit() {
    this.loadCourses();
    this.loadSemesters();
    this.co = await this.us.course_all();
    this.sem = await this.us.semester_all();
    this.sub = await this.us.subject_all();
    await this.loadAllChapters();
    
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
  

  async loadAllChapters() {
    try {
      const response = await this.us.getAllChapters();
      if (response.ok && Array.isArray(response.data)) {
        this.chapter = response.data;
        this.filteredChapter = [...this.chapter];
      } else {
        this.utils.toast('Failed to load chapters.');
      }
    } catch (error) {
      this.utils.toast('Error loading chapters.');
    }
  }

  filterChapters() {
    this.filteredChapter = this.chapter.filter(ch =>
      (!this.selectedCourse || ch.course_id === this.selectedCourse) &&
      (!this.selectedSemester || ch.semester_id === this.selectedSemester)
    );
  }

  async addChapter() {
    const { chapter_name, chapter_no, subject_id, semester_id, course_id } = this.newChapter;
    if (!chapter_name || !chapter_no || !subject_id || !semester_id || !course_id) {
      this.utils.toast('Please fill all required fields.');
      return;
    }

    try {
      const response = await this.us.addChapter(this.newChapter);
      if (response.ok) {
        this.utils.toast('Chapter added successfully!');
        this.newChapter = {
          chapter_name: '',
          chapter_no: '',
          subject_id: 0,
          semester_id: 0,
          course_id: 0
        };
        await this.loadAllChapters();
      } else {
        this.utils.toast(response.msg || 'Failed to add chapter');
      }
    } catch (error) {
      this.utils.toast('Error adding chapter.');
    }
  }

  getSubjectName(subjectId: number): string {
    return this.sub.find(s => s.id === subjectId)?.subject_name || 'N/A';
  }

   courses: Course[] = [];
  semesters: Semester[] = [];
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
