import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { ApplyOnline, Course_Student } from 'interface';
import { ApplyService } from '../services/apply.service';
import { UtilsService } from '../services/utils.service';

@Component({
  selector: 'app-apply-online',
  templateUrl: './apply-online.page.html',
  styleUrls: ['./apply-online.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class ApplyOnlinePage implements OnInit {
  users: ApplyOnline[] = [];
  filteredUsers: ApplyOnline[] = [];
  searchTerm: string = '';
  agentSearchTerm: string = '';
  co: Course_Student[] = [];

  constructor(
    private aps: ApplyService,
    private utils: UtilsService
  ) {}

  async ngOnInit() {
    await this.loadAllUsers();
    await this.loadCourses();
  }

 async loadAllUsers() {
  try {
    const response = await this.aps.online_all();
    if (response.ok && Array.isArray(response.data)) {
      this.users = response.data;
      this.filteredUsers = [...this.users];
      console.log('Loaded users:', this.users);
    } else {
      console.error('Unexpected response format:', response);
      this.users = [];
    }
  } catch (error) {
    console.error('Error loading users:', error);
    this.utils.toast('Failed to load users');
    this.users = [];
  }
}

  filterUsers() {
    const search = this.searchTerm.toLowerCase();
    const agentSearch = this.agentSearchTerm.toLowerCase();

    this.filteredUsers = this.users.filter(user => {
      const matchesStudent = search
        ? (user.full_name?.toLowerCase().includes(search) || user.email?.toLowerCase().includes(search))
        : true;
      const matchesAgent = agentSearch
        ? user.agent_name?.toLowerCase().includes(agentSearch)
        : true;
      return matchesStudent && matchesAgent;
    });
  }

 getCourseName(courseId: number): string {
  const course = this.co.find(c => c.id === courseId);
  return course?.course_name ?? 'N/A'; // Use optional chaining and nullish coalescing
}

  async loadCourses() {
    try {
      const response = await this.aps.applycourse_all();
      if (response.ok && Array.isArray(response.courses)) {
        this.co = response.courses;
        console.log('Courses loaded:', this.co);
      } else {
        console.error('Unexpected response format:', response);
        this.co = [];
      }
    } catch (error) {
      console.error('Error loading courses:', error);
      this.co = [];
    }
  }

  async sendReminder(user: ApplyOnline) {
    if (!user?.id) {
      this.utils.toast('Invalid user ID.');
      return;
    }

    try {
      const response = await this.aps.checkIncompleteFieldsAndRemind(user.id);
      if (response.ok) {
        this.utils.toast(`Reminder sent to ${user.full_name || user.first_name}`);
        console.log('Reminder sent response:', response);
        // Refresh user data to update incomplete steps
        await this.loadAllUsers();
      } else {
        this.utils.toast('Reminder failed: ' + response.msg);
        console.warn('Reminder failed:', response);
      }
    } catch (error) {
      console.error('Error sending reminder:', error);
      this.utils.toast('Something went wrong while sending reminder.');
    }
  }
}