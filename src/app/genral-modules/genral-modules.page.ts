

// @Component({
//   selector: 'app-genral-modules',
//   templateUrl: './genral-modules.page.html',
//   styleUrls: ['./genral-modules.page.scss'],
//   standalone: true,
//   imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule]
// })
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { UserService } from '../services/user.service';
import { UtilsService } from '../services/utils.service';
import { ApiService } from '../services/api.service';
import { Course, Semester, Session, User } from 'interface';
import { ToastController } from '@ionic/angular';
import { AlertController } from '@ionic/angular';
import { RouterModule } from '@angular/router';
// Define a new type that extends User to include the selected property
interface UserWithSelection extends User {
  selected: boolean;
}
@Component({
  selector: 'app-general-modules',
  templateUrl: './genral-modules.page.html',
  styleUrls: ['./genral-modules.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule],
})



export class GeneralModulesPage implements OnInit {
users: UserWithSelection[] = [];
  filteredUsers: UserWithSelection[] = [];
  selectedStudents: UserWithSelection[] = []; // Track selected students
  searchTerm: string = '';
  selectedCourse: string | null = null;
  selectedSemester: string | null = null;
  selectedSession: string | null = null;

  co: Course[] = [];
  sem: Semester[] = [];
  st: Session[] = [];

  // Contact Checkboxes
  contactMother: boolean = false;
  contactStudent: boolean = false;
  contactFather: boolean = false;
  contactAll: boolean = false;

  // Table Checkbox
  selectAll: boolean = false;

  // Pagination
  currentPage: number = 1;
  itemsPerPage: number = 12;

  // Dynamic Info Box Values
  characterCount: number = 0;
  totalContacts: number = 0;
  msg: string = ''; // Initialize as empty string

  constructor(
    private us: UserService,
    private utils: UtilsService,
    private api: ApiService,
    private toastCtrl: ToastController,
    private alertCtrl: AlertController
  ) {}

  ngOnInit() {
    this.loadAllUsers();
    this.loaders();
    this.loader();
    this.loading();
  }

  async loadAllUsers() {
    try {
      const response = await this.us.user_all();
      if (response.ok && Array.isArray(response.data)) {
        this.users = response.data.map((user: User) => ({ ...user, selected: false }));
        this.filteredUsers = [...this.users];
      } else {
        this.users = [];
      }
    } catch (error) {
      console.error('Error loading users:', error);
      this.users = [];
    }
  }

  async loading() {
    this.co = await this.us.course_all();
  }

  async loader() {
    this.st = await this.us.session_all();
  }

  async loaders() {
    this.sem = await this.us.semester_all();
  }

  filterUsers() {
    const searchTermLower = this.searchTerm?.toLowerCase() || '';
    const selectedCourseId = this.selectedCourse || null;
    const selectedSemesterId = this.selectedSemester || null;
    const selectedSessionId = this.selectedSession || null;

    this.filteredUsers = this.users.filter(user => {
      const course = this.co.find(c => c.id === user.course_id);
      const courseName = course ? course.course_name?.toLowerCase() : '';

      return (
        (user.first_name?.toLowerCase().includes(searchTermLower) ||
          user.roll_no?.toString().includes(searchTermLower) ||
          courseName?.includes(searchTermLower)) &&
        (selectedCourseId ? user.course_id == selectedCourseId : true) &&
        (selectedSemesterId ? user.semester_id == selectedSemesterId : true) &&
        (selectedSessionId ? user.session_id == selectedSessionId : true)
      );
    });
    this.currentPage = 1;
    this.updatePreview(); // Update preview after filtering
  }

  get paginatedUsers(): UserWithSelection[] {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    return this.filteredUsers.slice(startIndex, endIndex);
  }

  get totalPages(): number {
    return Math.ceil(this.filteredUsers.length / this.itemsPerPage);
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.updatePreview(); // Update preview when changing pages
    }
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.updatePreview(); // Update preview when changing pages
    }
  }

  prevPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.updatePreview(); // Update preview when changing pages
    }
  }

  getCourseName(courseId: number): string {
    const course = this.co.find(c => c.id === courseId);
    return course?.course_name ?? 'N/A';
  }

  getSemesterName(semesterId: number): string {
    const semester = this.sem.find(s => s.id === semesterId);
    return semester?.semester_name ?? 'N/A';
  }

  toggleAllContacts() {
    this.contactMother = this.contactAll;
    this.contactStudent = this.contactAll;
    this.contactFather = this.contactAll;
    this.updateTotalContacts();
  }

  toggleSelectAll() {
    this.filteredUsers = this.filteredUsers.map(user => ({
      ...user,
      selected: this.selectAll,
    }));
    this.updatePreview();
  }

  async updatePreview() {
    // Update selected students list
    this.selectedStudents = this.filteredUsers.filter(user => user.selected);

    // Calculate character count based on the preview content
    let previewText = '';
    if (this.selectedStudents.length === 0) {
      previewText = `Dear {student_name}, {course_id}, {semester_id}\n\nThis is a reminder for your upcoming {exam_name} scheduled on {exam_date}. Please be prepared.\n\n*GIIT Admin*`;
    } else {
      for (const student of this.selectedStudents) {
        // Fetch exam details for the selected student
        let exam_name = 'N/A';
        let exam_date = 'N/A';
        // // try {
        // //   const examResponse = await this.api.get(`/exams/${student.id}`); // Uncommented and fixed
        // //   if (examResponse.ok) {
        // //     exam_name = examResponse.data.exam_name || 'N/A';
        // //     exam_date = examResponse.data.exam_date || 'N/A';
        // //     // Store fetched data in the student object for use in sendWhatsApp()
        // //     student.exam_name = exam_name;
        // //     student.exam_date = exam_date;
        // //   }
        // } catch (error) {
        //   console.error(`Error fetching exam details for user ${student.id}:`, error);
        // }

        const studentPreview = `Dear ${student.first_name} ${student.last_name}, Course: ${this.getCourseName(student.course_id)}, Semester: ${this.getSemesterName(student.semester_id)}\n\nThis is a reminder for your upcoming ${exam_name} scheduled on ${exam_date}. Please be prepared.\n\n*GIIT Admin*`;
        previewText += studentPreview + '\n\n';
      }
    }
    this.characterCount = previewText.length;

    // Update total contacts
    this.updateTotalContacts();
  }

  updateTotalContacts() {
    let count = 0;
    if (this.contactMother) count++;
    if (this.contactStudent) count++;
    if (this.contactFather) count++;
    if (this.contactAll) count = 3; // If "All" is checked, assume all contacts are selected
    this.totalContacts = count;
  }

  async sendWhatsApp() {
  if (this.selectedStudents.length === 0) {
    this.showToast('Please select at least one student.');
    return;
  }

  if (this.totalContacts === 0) {
    this.showToast('Please select at least one contact type.');
    return;
  }

  const userIds = this.selectedStudents.map(s => s.id);
  const message = this.msg.trim() || `Dear Student, 
This is a reminder for your upcoming scheduled on Please be prepared.. - GIIT Admin`;

  let recipient = '';
  if (this.contactAll) {
    recipient = 'all';
  } else if (this.contactStudent && !this.contactMother && !this.contactFather) {
    recipient = 'student';
  } else if (this.contactMother && !this.contactStudent && !this.contactFather) {
    recipient = 'mother';
  } else if (this.contactFather && !this.contactStudent && !this.contactMother) {
    recipient = 'father';
  } else {
    this.showToast('Please select only one contact type or "All".');
    return;
  }

  try {
    const response = await this.api.post('/whatsapp/send-reminder', {
      userIds,
      message,
      recipient
    });

   if (response.success) {
  this.showToast('Reminder sent successfully!');
  this.msg = ''; // Clear message
} else {
  console.error('Failed to send reminder:', response);
  this.showToast('Failed to send reminder.');
}

  } catch (error) {
    console.error('Error sending reminder:', error);
    this.showToast('Error occurred while sending.');
  }
}


  async showToast(message: string) {
    const toast = await this.toastCtrl.create({
      message,
      duration: 2000,
      position: 'bottom',
    });
    await toast.present();
  }

  async downloadStudentExcel(): Promise<void> {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:3000/user/students/excel", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { "Authorization": `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          course: this.selectedCourse || null,
          semester: this.selectedSemester || null,
          session: this.selectedSession || null,
        }),
      });

      if (!response.ok) {
        throw new Error(`Failed to download Excel: ${await response.text()}`);
      }

      const blob: Blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `students_${this.selectedCourse || 'All'}_${this.selectedSemester || 'All'}_${this.selectedSession || 'All'}.xlsx`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error downloading Excel:", error);
    }
  }

  logout() {
    localStorage.removeItem("token");
    window.location.href = "/login";
  }
}