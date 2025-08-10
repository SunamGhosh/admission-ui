import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule, IonModal } from '@ionic/angular';
import { UserService } from '../services/user.service';
import { FacultyService } from '../services/faculty.service';
import { ApiService } from '../services/api.service';
import { InfrastructureService } from '../services/infrastructure.service';
import { TimetableService } from '../services/timetable.service';
import { Infrastructure } from 'interface';
import { GroupBySlotPipe} from '../group-by-slot-pipe/group-by-slot-pipe.page';

@Component({
  selector: 'app-admin-scheduling-timetable',
  templateUrl: './admin-scheduling-timetable.page.html',
  styleUrls: ['./admin-scheduling-timetable.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, GroupBySlotPipe]

})
export class AdminSchedulingTimetablePage implements OnInit {
  @ViewChild(IonModal) modal!: IonModal;

  sessionList: any[] = [];
  courseList: any[] = [];
  semesterList: any[] = [];
  subjectList: any[] = [];
  facultyListFull: any[] = [];
  facultyList: any[] = [];
  timetableList: any[] = [];
  loading = false;
  selectedSession = 0;
  selectedCourse = 0;
  selectedSemester = 0;
  selectedSubject = 0;
  selectedFaculty: string | null = null; // Store faculty_master_id as string
  selectedFacultyName: string = ''; // Store faculty name for display
  days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  slotData: any[] = [];
  infrastructureList: Infrastructure[] = [];
  groupedTimetable: any[] = [];
  searchFacultyId: number = 0;
  searchCourseId: number = 0;
  searchSemesterId: number = 0;
  searchStartDate: string = '';
  searchEndDate: string = '';

  // Modal-related properties
  editEntry: any = null;
  modalFacultyName: string = ''; // Faculty name for the modal

  constructor(
    private us: UserService,
    private fs: FacultyService,
    private api: ApiService,
    private infra: InfrastructureService,
    private ts: TimetableService
  ) {}

  async ngOnInit() {
    this.facultyListFull = await this.fs.getAllFaculty();
    this.facultyList = this.facultyListFull;
    this.sessionList = await this.us.session_all();
    this.courseList = await this.us.course_all();
    this.semesterList = await this.us.semester_all();
    this.subjectList = await this.us.subject_all();
    await this.loadTimetable();
    this.groupTimetableByDate();
    const infraRes = await this.infra.getAll();
    if (infraRes.ok) this.infrastructureList = infraRes.data!;
    this.initializeSlotData();
  }

  initializeSlotData() {
    this.slotData = this.days.map((day) => ({
      day,
      start_time: '',
      end_time: '',
      room_id: null,
      faculty_name: null, // Use faculty_name
      status: true,
      meeting_id: '',
      meeting_password: ''
    }));
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
          faculty_id: this.selectedFacultyName, // Use faculty_name
          day: slot.day,
          start_time: slot.start_time,
          end_time: slot.end_time,
          room_id: slot.room_id,
          is_active: 1
        };
        if (slot.room_id === 0) {
          payload.meeting_id = slot.meeting_id;
          payload.meeting_password = slot.meeting_password;
        }
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
    const r = this.infrastructureList.find(x => x.id === id);
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

  getFacultyName(faculty_id: any): string {
    return faculty_id || 'N/A'; // faculty_id is actually faculty_name
  }

  getSubjectName(id: number) {
    const s = this.subjectList.find((x) => x.id === id);
    return s ? s.subject_name : 'N/A';
  }

  async onSubjectChange(event: Event) {
    const target = event.target as HTMLSelectElement;
    const subjectId = Number(target.value);
    this.selectedSubject = subjectId;
    if (subjectId) {
      try {
        const facultyData = await this.getFacultyBySubject(subjectId);
        if (facultyData && facultyData.length > 0) {
          const faculty = facultyData[0];
          this.selectedFaculty = String(faculty.faculty_master_id);
          this.selectedFacultyName = faculty.faculty_name || 'N/A';
        } else {
          this.selectedFaculty = null;
          this.selectedFacultyName = 'No faculty assigned';
        }
      } catch (error) {
        console.error('Error fetching faculty for subject:', error);
        this.selectedFaculty = null;
        this.selectedFacultyName = 'Error fetching faculty';
      }
    } else {
      this.selectedFaculty = null;
      this.selectedFacultyName = '';
    }
  }

  async onModalSubjectChange(event: Event) {
    const target = event.target as HTMLSelectElement;
    const subjectId = Number(target.value);
    this.editEntry.subject_id = subjectId;
    if (subjectId) {
      try {
        const facultyData = await this.getFacultyBySubject(subjectId);
        if (facultyData && facultyData.length > 0) {
          const faculty = facultyData[0];
          this.modalFacultyName = faculty.faculty_name || 'N/A';
          this.editEntry.faculty_id = this.modalFacultyName; // Use faculty_name
        } else {
          this.modalFacultyName = 'No faculty assigned';
          this.editEntry.faculty_id = null;
        }
      } catch (error) {
        console.error('Error fetching faculty for subject:', error);
        this.modalFacultyName = 'Error fetching faculty';
        this.editEntry.faculty_id = null;
      }
    } else {
      this.modalFacultyName = '';
      this.editEntry.faculty_id = null;
    }
  }

  async getFacultyBySubject(subject_id: number): Promise<any[]> {
    const response = await this.api.post('/recognisation/by-subject', { subject_id });
    return response.ok ? response.data : [];
  }

groupTimetableByDate() {
  const dayGrouped: { [key: string]: any[] } = {};
  for (const item of this.timetableList) {
    const dayKey = `${item.day_label || item.day}`.trim(); // Group by day first
    if (!dayGrouped[dayKey]) dayGrouped[dayKey] = [];
    dayGrouped[dayKey].push(item);
  }

  // Further group by start_time and end_time within each day
  this.groupedTimetable = Object.entries(dayGrouped).map(([day, classes]) => {
    const timeGrouped: { [key: string]: any[] } = {};
    for (const cls of classes) {
      const timeKey = `${cls.start_time}-${cls.end_time}`.trim();
      if (!timeGrouped[timeKey]) timeGrouped[timeKey] = [];
      timeGrouped[timeKey].push(cls);
    }

    // Create time slots for this day
    const timeSlots = Object.entries(timeGrouped).map(([timeKey, classes]) => {
      const [start_time, end_time] = timeKey.split('-');
      return {
        start_time,
        end_time,
        classes
      };
    });

    console.log(`Day: ${day}, Time Slots:`, timeSlots); // Debug log
    return {
      day: day,
      date: null, // Not using date as per request
      classes: timeSlots // Time slots with merged classes for this day
    };
  });
}
  getCourseName(id: number): string {
    const c = this.courseList.find(x => x.id === id);
    return c ? c.course_name : 'N/A';
  }

  getSessionName(id: number): string {
    const s = this.sessionList.find(x => x.id === id);
    return s ? s.session_name : 'N/A';
  }

  getColor(subjectId: number): string {
    const colors = ['#fce4ec', '#e3f2fd', '#e8f5e9', '#fff3e0', '#f3e5f5', '#ede7f6', '#e0f2f1'];
    return colors[subjectId % colors.length];
  }

  async fetchTimetable() {
    this.loading = true;
    const payload: any = {
      faculty_id: this.searchFacultyId,
      course_id: this.searchCourseId,
      semester_id: this.searchSemesterId,
      start_date: this.searchStartDate,
      end_date: this.searchEndDate
    };
    Object.keys(payload).forEach(key => {
      if (!payload[key]) delete payload[key];
    });
    const res = await this.api.post('/timetable/getall', payload);
    this.timetableList = res.ok ? res.data : [];
    this.groupTimetableByDate();
    this.loading = false;
  }

  async openEditModal(entry: any) {
    this.editEntry = { ...entry }; // Copy entry
    this.modalFacultyName = this.editEntry.faculty_id || 'N/A'; // faculty_id is faculty_name
    await this.onModalSubjectChange({ target: { value: this.editEntry.subject_id } } as any); // Initialize faculty
    this.modal.present();
  }

  async updateTimetable() {
    if (!this.modalFacultyName) {
      alert('Please select a subject with an assigned faculty.');
      return;
    }
    if (this.editEntry.room_id !== 0) {
      delete this.editEntry.meeting_id;
      delete this.editEntry.meeting_password;
    }
    const payload = {
      ...this.editEntry,
      faculty_id: this.modalFacultyName // Use faculty_name
    };
    const res = await this.api.post('/timetable/update', payload);
    if (res.ok) {
      alert('Timetable updated successfully!');
      await this.loadTimetable();
      this.groupTimetableByDate();
      this.modal.dismiss();
    } else {
      alert('Failed to update timetable!');
    }
  }

  cancelModal() {
    this.modal.dismiss();
  }
}