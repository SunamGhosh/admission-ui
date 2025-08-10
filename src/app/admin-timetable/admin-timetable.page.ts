import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { ApiService } from '../services/api.service';
import { UserService } from '../services/user.service';
import { FacultyService } from '../services/faculty.service';
import { Infrastructure } from 'interface';
import { InfrastructureService } from '../services/infrastructure.service';
import { TimetableService } from '../services/timetable.service';

@Component({
  selector: 'app-admin-timetable',
  templateUrl: './admin-timetable.page.html',
  styleUrls: ['./admin-timetable.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule],
})
export class AdminTimetablePage implements OnInit {
  sessionList: any[] = [];
  courseList: any[] = [];
  semesterList: any[] = [];
  subjectList: any[] = [];
  facultyListFull: any[] = [];
  facultyList: any[] = [];
  timetableList: any[] = [];
  infrastructureList: Infrastructure[] = [];
  loading = false;

  selectedSession = 0;
  selectedCourse = 0;
  selectedSemester = 0;
  selectedSubject = 0;
  selectedFaculty: string | null = null;
  selectedFacultyName: string = '';

  days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  slotData: any[] = [];

  constructor(
    private us: UserService,
    private fs: FacultyService,
    private api: ApiService,
    private infra: InfrastructureService,
    private ts: TimetableService
  ) {}

  async ngOnInit() {
    this.facultyListFull = await this.fs.getAllFaculty();
    this.facultyList = this.facultyListFull; // Default
    this.sessionList = await this.us.session_all();
    this.courseList = await this.us.course_all();
    this.semesterList = await this.us.semester_all();
    this.subjectList = await this.us.subject_all();
    const infraRes = await this.infra.getAll();
    if (infraRes.ok) this.infrastructureList = infraRes.data!;
    this.initializeSlotData();
    await this.loadTimetable();
  }

  initializeSlotData() {
    this.slotData = this.days.map((day) => ({
      day,
      start_time: '',
      end_time: '',
      room_id: null,
      faculty_name: null, // Changed from faculty_id to faculty_name
      status: true,
      meeting_id: '',
      meeting_password: '',
    }));
  }

  async onSubjectChange(event: any) {
    const subjectId = Number(event.target.value); // Ensure subjectId is a number
    this.selectedSubject = subjectId;

    if (subjectId) {
      try {
        // Fetch faculty data for the selected subject using the API
        const facultyData = await this.getFacultyBySubject(subjectId);
        console.log('Faculty data:', facultyData); // Debug: Check API response
        if (facultyData && facultyData.length > 0) {
          const faculty = facultyData[0]; // Assuming the API returns an array with at least one faculty
          this.selectedFaculty = String(faculty.faculty_master_id); // Keep for compatibility
          this.selectedFacultyName = faculty.faculty_name || 'N/A'; // Set faculty name for display and payload
          console.log('Selected faculty:', this.selectedFaculty, this.selectedFacultyName); // Debug
        } else {
          // No faculty found for the subject
          this.selectedFaculty = null;
          this.selectedFacultyName = 'No faculty assigned';
        }
      } catch (error) {
        console.error('Error fetching faculty for subject:', error);
        this.selectedFaculty = null;
        this.selectedFacultyName = 'Error fetching faculty';
      }
    } else {
      // Clear fields if no subject is selected
      this.selectedFaculty = null;
      this.selectedFacultyName = '';
    }
  }

  async getFacultyBySubject(subject_id: number): Promise<any[]> {
    const response = await this.api.post('/recognisation/by-subject', { subject_id });
    return response.ok ? response.data : [];
  }

  async submitTimetable() {
    if (!this.selectedFacultyName) {
      alert('Please select a subject with an assigned faculty.');
      return;
    }

    for (const slot of this.slotData) {
      if (slot.status && slot.start_time && slot.end_time && slot.room_id !== null) {
        const payload: any = {
          session_id: this.selectedSession,
          course_id: this.selectedCourse,
          semester_id: this.selectedSemester,
          subject_id: this.selectedSubject,
          faculty_id: this.selectedFacultyName, // Send faculty_name instead of faculty_id
          day: slot.day,
          start_time: slot.start_time,
          end_time: slot.end_time,
          room_id: slot.room_id,
          is_active: 1,
        };

        if (slot.room_id === 0) {
          payload.meeting_id = slot.meeting_id;
          payload.meeting_password = slot.meeting_password;
        }

        console.log('Submitting payload:', payload); // Debug: Check payload
        const res = await this.ts.add(payload);
        if (!res.ok) {
          alert('Failed to add timetable for ' + slot.day);
        }
      }
    }

    alert('Timetable added successfully!');
    this.initializeSlotData();
    await this.loadTimetable();
  }

  getRoomName(id: number) {
    const r = this.infrastructureList.find((x) => x.id === id);
    return r ? r.room_no : 'Online';
  }

  async loadTimetable() {
    this.loading = true;
    const res = await this.api.post('/timetable/getall', {});
    this.timetableList = res.ok ? res.data : [];
    this.loading = false;
  }

  async deleteRow(id: number) {
    if (confirm('Delete this timetable entry?')) {
      const res = await this.api.post('/timetable/delete', { id });
      if (res.ok) {
        alert('Deleted successfully!');
        await this.loadTimetable();
      } else {
        alert('Delete failed!');
      }
    }
  }

  getFacultyName(faculty_name: any) {
    // Return the faculty_name directly since it's stored as a string
    return faculty_name || 'N/A';
  }

  getSubjectName(id: number) {
    const s = this.subjectList.find((x) => x.id === id);
    return s ? s.subject_name : 'N/A';
  }
}