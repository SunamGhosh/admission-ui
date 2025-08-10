import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { FacultyService } from '../services/faculty.service';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-faculty-recognisation',
  templateUrl: './faculty-recognisation.page.html',
  styleUrls: ['./faculty-recognisation.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class FacultyRecognisationPage implements OnInit {
  /* 🔎 Master lists */
  sessionList: any[] = [];
  courseList: any[] = [];
  semesterList: any[] = [];
  subjectList: any[] = [];
  facultyList: any[] = [];

  /* 🗂 Existing recognisations */
  recognisationList: any[] = [];
  filteredRecognisationList: any[] = [];
  paginatedRecognisationList: any[] = [];
  loading = false;

  /* 🔍 Filter and add state */
  filterSession = 0;
  filterCourse = 0;
  filterSemester = 0;
  selectedSubject = 0;

  /* 💾 Pending changes */
  pendingAdditions: any[] = [];
  pendingUpdates: any[] = [];

  /* 📄 Pagination state */
  currentPage: number = 1;
  itemsPerPage: number = 4;
  totalPages: number = 1;
  pageNumbers: number[] = [];

  constructor(
    private us: UserService,
    private fs: FacultyService,
    private frs: FacultyService
  ) {}

  /* 🚀 Init */
  async ngOnInit() {
    this.sessionList = await this.us.session_all();
    this.courseList = await this.us.course_all();
    this.semesterList = await this.us.semester_all();
    this.subjectList = await this.us.subject_all();
    this.facultyList = await this.fs.getAllFaculty();

    await this.loadRecognisations();
    this.applyFilter();
  }

  /* 📚 Dependent dropdown: when course changes, filter subjects */
  async onCourseChange(courseId: number) {
    const allSubjects = await this.us.subject_all();
    this.subjectList = allSubjects.filter((s: any) => s.course_id === courseId);

    // 🔄 For each subject, find assigned faculty (from recognisationList)
    this.subjectList.forEach((subject: any) => {
      const assigned = this.recognisationList.find((rec: any) => rec.subject_id === subject.id);
      if (assigned) {
        const faculty = this.facultyList.find(f => f.faculty_master_id === assigned.faculty_id);
        subject.assignedFacultyName = faculty?.faculty_name || 'Assigned';
      } else {
        subject.assignedFacultyName = '';
      }
    });

    this.selectedSubject = 0;
    this.applyFilter();
  }

  /* 🔍 Apply filters to recognisation list and include all subjects */
  applyFilter() {
    // Start with all subjects that match the course filter
    let filteredSubjects = this.subjectList;
    if (this.filterCourse !== 0) {
      filteredSubjects = this.subjectList.filter((s: any) => s.course_id === this.filterCourse);
    }

    // Create rows for all subjects, merging with existing recognisations
    this.filteredRecognisationList = filteredSubjects.map((subject: any) => {
      const matchingRecognisation = this.recognisationList.find((rec: any) => 
        rec.subject_id === subject.id &&
        (this.filterSession === 0 || rec.session_id === this.filterSession) &&
        (this.filterCourse === 0 || rec.course_id === this.filterCourse) &&
        (this.filterSemester === 0 || rec.semester_id === this.filterSemester)
      );

      // Use pending additions if available
      const pendingAddition = this.pendingAdditions.find((p: any) => 
        p.subject_id === subject.id &&
        (this.filterSession === 0 || p.session_id === this.filterSession) &&
        (this.filterCourse === 0 || p.course_id === this.filterCourse) &&
        (this.filterSemester === 0 || p.semester_id === this.filterSemester)
      );

      return {
        id: matchingRecognisation?.id || 0,
        session_id: matchingRecognisation?.session_id || this.filterSession || this.sessionList[0]?.id || 0,
        course_id: matchingRecognisation?.course_id || this.filterCourse || subject.course_id,
        semester_id: matchingRecognisation?.semester_id || this.filterSemester || this.semesterList[0]?.id || 0,
        subject_id: subject.id,
        faculty_id: matchingRecognisation?.faculty_id || pendingAddition?.faculty_id || 0,
        selectedFaculty: pendingAddition?.faculty_id || 0
      };
    });

    // Include pending additions that don't match existing subjects
    this.pendingAdditions.forEach((addition: any) => {
      if (
        (this.filterSession === 0 || addition.session_id === this.filterSession) &&
        (this.filterCourse === 0 || addition.course_id === this.filterCourse) &&
        (this.filterSemester === 0 || addition.semester_id === this.filterSemester) &&
        !this.filteredRecognisationList.some((row: any) => row.subject_id === addition.subject_id)
      ) {
        this.filteredRecognisationList.push({
          id: 0,
          session_id: addition.session_id,
          course_id: addition.course_id,
          semester_id: addition.semester_id,
          subject_id: addition.subject_id,
          faculty_id: 0,
          selectedFaculty: addition.faculty_id
        });
      }
    });

    // Update pagination
    this.updatePagination();
  }

  /* 📄 Update pagination */
  updatePagination() {
    this.totalPages = Math.ceil(this.filteredRecognisationList.length / this.itemsPerPage);
    this.currentPage = Math.min(this.currentPage, this.totalPages || 1);
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.paginatedRecognisationList = this.filteredRecognisationList.slice(startIndex, endIndex);
    this.pageNumbers = Array.from({ length: this.totalPages }, (_, i) => i + 1);
  }

  /* 📄 Pagination controls */
  previousPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.updatePagination();
    }
  }

  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.updatePagination();
    }
  }

  goToPage(page: number) {
    this.currentPage = page;
    this.updatePagination();
  }

  /* 💾 Mark row for addition */
  markForAdd(row: any) {
    if (row.selectedFaculty) {
      const existing = this.pendingAdditions.find(p => 
        p.subject_id === row.subject_id && 
        p.session_id === row.session_id && 
        p.course_id === row.course_id && 
        p.semester_id === row.semester_id
      );
      if (existing) {
        existing.faculty_id = row.selectedFaculty;
      } else {
        this.pendingAdditions.push({
          session_id: row.session_id,
          course_id: row.course_id,
          semester_id: row.semester_id,
          subject_id: row.subject_id,
          faculty_id: row.selectedFaculty
        });
      }
    } else {
      this.pendingAdditions = this.pendingAdditions.filter(p => 
        p.subject_id !== row.subject_id || 
        p.session_id !== row.session_id || 
        p.course_id !== row.course_id || 
        p.semester_id !== row.semester_id
      );
    }
    this.applyFilter(); // Refresh to reflect pending changes
  }

  /* 💾 Mark row for update */
  markForUpdate(row: any) {
    const existing = this.pendingUpdates.find(p => p.id === row.id);
    if (existing) {
      existing.faculty_id = row.faculty_id;
    } else {
      this.pendingUpdates.push({
        id: row.id,
        session_id: row.session_id,
        course_id: row.course_id,
        semester_id: row.semester_id,
        subject_id: row.subject_id,
        faculty_id: row.faculty_id
      });
    }
  }

  /* 💾 Add new allocation from filter section */
  async addNewAllocation() {
    if (!(this.filterSession && this.filterCourse && this.filterSemester && this.selectedSubject)) {
      alert('Please select session, course, semester, and subject');
      return;
    }

    const existing = this.pendingAdditions.find(p => 
      p.session_id === this.filterSession &&
      p.course_id === this.filterCourse &&
      p.semester_id === this.filterSemester &&
      p.subject_id === this.selectedSubject
    );

    if (!existing && !this.recognisationList.find(r => 
      r.session_id === this.filterSession &&
      r.course_id === this.filterCourse &&
      r.semester_id === this.filterSemester &&
      r.subject_id === this.selectedSubject
    )) {
      this.pendingAdditions.push({
        session_id: this.filterSession,
        course_id: this.filterCourse,
        semester_id: this.filterSemester,
        subject_id: this.selectedSubject,
        faculty_id: 0 // Will be set in the table
      });
      this.applyFilter();
    } else {
      alert('This allocation is already pending or exists');
    }
  }

  /* 💾 Submit all pending changes */
  async submitChanges() {
    this.loading = true;

    // Process additions
    for (const addition of this.pendingAdditions) {
      if (addition.faculty_id) {
        const res = await this.frs.addFacultyRecognisation(addition);
        if (!res.ok) {
          alert(`Failed to add allocation for subject ${this.getSubjectName(addition.subject_id)}: ${res.error}`);
        }
      }
    }

    // Process updates
    for (const update of this.pendingUpdates) {
      const res = await this.frs.updateFacultyRecognisation(update);
      if (!res.ok) {
        alert(`Failed to update allocation for subject ${this.getSubjectName(update.subject_id)}: ${res.error}`);
      }
    }

    // Refresh and reset
    await this.loadRecognisations();
    this.applyFilter();
    this.pendingAdditions = [];
    this.pendingUpdates = [];
    this.loading = false;
    alert('Changes submitted successfully!');
  }

  /* 🗑 Delete */
  async delete(rowId: number) {
    if (confirm('Delete this record?')) {
      const res = await this.frs.deleteFacultyRecognisation(rowId);
      if (res.ok) {
        alert('Deleted!');
        await this.loadRecognisations();
        this.applyFilter();
      } else {
        alert('Delete failed!');
      }
    }
  }

  /* 🔄 Helpers */
  hasPendingChanges() {
    return this.pendingAdditions.some(a => a.faculty_id) || this.pendingUpdates.length > 0;
  }

  async loadRecognisations() {
    this.loading = true;
    this.recognisationList = await this.frs.getAllFacultyRecognisation();
    this.loading = false;
  }

  getById(arr: any[], id: number, key: string) {
    const o = arr.find(x => x.id === id || x.faculty_master_id === id);
    return o ? o[key] : 'N/A';
  }

  getSessionName = (id: number) => this.getById(this.sessionList, id, 'session_name');
  getCourseName = (id: number) => this.getById(this.courseList, id, 'course_name');
  getSemesterName = (id: number) => this.getById(this.semesterList, id, 'semester_name');
  getSubjectName = (id: number) => this.getById(this.subjectList, id, 'subject_name');
  getFacultyName = (id: number) => this.getById(this.facultyList, id, 'faculty_name');
}