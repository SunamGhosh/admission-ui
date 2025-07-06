import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule, ToastController } from '@ionic/angular';
import { UserService } from '../services/user.service';
import { Course, Semester, Session, User, Module, Category, Subcategory, Template, Course_Student } from 'interface';
import { RouterModule } from '@angular/router';

interface UserWithSelection extends User {
  selected: boolean;
}

@Component({
  selector: 'app-general-modules',
  templateUrl: './genral-modules.page.html',
  styleUrls: ['./genral-modules.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule,RouterModule],
})
export class GeneralModulesPage implements OnInit {
  users: UserWithSelection[] = [];
  filteredUsers: UserWithSelection[] = [];
  selectedStudents: UserWithSelection[] = [];
  searchTerm: string = '';
  selectedCourse: string | null = null;
  selectedSemester: string | null = null;
  selectedSession: string | null = null;

  co: Course[] = [];
  cs: Course_Student[]=[]
  sem: Semester[] = [];
  st: Session[] = [];

  modules: Module[] = [];
  categories: Category[] = [];
  subcategories: Subcategory[] = [];
  templates: Template[] = [];
  selectedModuleId: number | null = null;
  selectedCategoryId: number | null = null;
  selectedSubcategoryId: number | null = null;
  selectedTemplate: Template | null = null;

  contactMother: boolean = false;
  contactStudent: boolean = false;
  contactFather: boolean = false;
  contactAll: boolean = false;

  selectAll: boolean = false;
  currentPage: number = 1;
  itemsPerPage: number = 12;
  characterCount: number = 0;
  totalContacts: number = 0;
  msg: string = '';

  isModalOpen: boolean = false; // Control modal visibility

  constructor(
    private us: UserService,
    private toastCtrl: ToastController,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.loadAllUsers();
    this.loaders();
    this.loadModules();
  }

  get selectedModuleName(): string {
    return this.modules.find(m => m.id === this.selectedModuleId)?.module_name || 'N/A';
  }

  get selectedCategoryName(): string {
    return this.categories.find(c => c.id === this.selectedCategoryId)?.category_name || 'N/A';
  }

  get selectedSubcategoryName(): string {
    if (this.selectedSubcategoryId === null) return 'N/A';
    const subcategory = this.subcategories.find(s => s.id === this.selectedSubcategoryId);
    return subcategory?.subcategory_name ?? 'N/A';
  }

  async loadAllUsers() {
    try {
      const response = await this.us.user_all();
      if (response.ok && Array.isArray(response.data)) {
        this.users = response.data.map((user: User) => ({ ...user, selected: false }));
        this.filteredUsers = [...this.users];
      } else {
        this.users = [];
        await this.showToast('No users found');
      }
    } catch (error) {
      console.error('Error loading users:', error);
      await this.showToast('Failed to load users');
    }
  }

  async loadModules() {
    try {
      const response = await this.us.getAllModules();
      if (response.ok && Array.isArray(response.data)) {
        this.modules = response.data;
      } else {
        this.modules = [];
        await this.showToast('No modules found');
      }
    } catch (error) {
      console.error('Error loading modules:', error);
      await this.showToast('Failed to load modules');
    }
  }

  async loadCategories() {
    this.categories = [];
    this.subcategories = [];
    this.templates = [];
    this.selectedCategoryId = null;
    this.selectedSubcategoryId = null;
    this.selectedTemplate = null;
    this.msg = '';
    if (this.selectedModuleId) {
      try {
        const response = await this.us.category_all(this.selectedModuleId);
        if (response && response.ok && Array.isArray(response.data)) {
          this.categories = response.data;
          if (this.categories.length === 0) {
            await this.showToast('No categories found for this module');
          }
        } else {
          this.categories = [];
          await this.showToast('No categories found');
        }
      } catch (error) {
        console.error('Error loading categories:', error);
        await this.showToast('Failed to load categories');
      }
    }
    this.cdr.detectChanges();
    this.updatePreview();
  }

  async loadSubcategories() {
    this.subcategories = [];
    this.templates = [];
    this.selectedSubcategoryId = null;
    this.selectedTemplate = null;
    this.msg = '';
    if (this.selectedCategoryId) {
      try {
        const response = await this.us.getSubcategoriesByCategory(this.selectedCategoryId);
        if (response.ok && Array.isArray(response.data)) {
          this.subcategories = response.data;
        } else {
          this.subcategories = [];
          await this.showToast('No subcategories found');
        }
      } catch (error) {
        console.error('Error loading subcategories:', error);
        await this.showToast('Failed to load subcategories');
      }
    }
    this.updatePreview();
  }

  async loadTemplates() {
    this.templates = [];
    this.selectedTemplate = null;
    this.msg = '';
    if (this.selectedSubcategoryId) {
      try {
        const response = await this.us.getTemplatesBySubcategory(this.selectedSubcategoryId);
        if (response.ok && Array.isArray(response.data)) {
          this.templates = response.data;
          if (this.templates.length > 0) {
            this.selectedTemplate = this.templates[0];
            this.msg = this.selectedTemplate.template_name;
          }
        } else {
          this.templates = [];
          await this.showToast('No templates found');
        }
      } catch (error) {
        console.error('Error loading templates:', error);
        await this.showToast('Failed to load templates');
      }
    }
    this.updatePreview();
  }

  async loaders() {
    try {
      const [courses, semesters, sessions] = await Promise.all([
        this.us.course_all(),
        this.us.semester_all(),
        this.us.session_all(),
      ]);
      this.co = courses || [];
      this.sem = semesters || [];
      this.st = sessions || [];
    } catch (error) {
      console.error('Error loading dropdown data:', error);
      await this.showToast('Failed to load dropdown data');
    }
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
    this.updatePreview();
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
      this.updatePreview();
    }
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.updatePreview();
    }
  }

  prevPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.updatePreview();
    }
  }
getCourseName(courseId: number): string {
  const course = this.co.find(c => c.id === courseId);
  return course?.course_name?.split('-')[0] ?? 'N/A';
}

  getCourseStudentName(courseId: number): string {
    const course = this.cs.find(c => c.id === courseId);
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
previewMessages: string[] = [];
  async updatePreview() {
  this.selectedStudents = this.filteredUsers.filter(user => user.selected);
  let previewText = '';

  if (this.selectedStudents.length === 0) {
    previewText = this.selectedTemplate?.template_name || `{course_id} has exam on {exam_date}`; // Align with sendWhatsApp
  } else {
    for (const student of this.selectedStudents) {
      let templateContent = this.selectedTemplate?.template_name || `{course_id} has exam on {exam_date}`;
      templateContent = templateContent
        .replace('{student_name}', `${student.first_name} ${student.last_name}`)
        .replace('{father_name}', student.father_name || '')
        .replace('{mother_name}', student.mother_name || '')
        .replace('{course_id}', this.getCourseName(student.course_id))
        .replace('{semester_id}', this.getSemesterName(student.semester_id))
        .replace('{exam_name}', 'Sample Exam')
        .replace('{exam_date}', '12.06.2025');

      previewText += templateContent + '\n\n';
    }
  }
  this.characterCount = previewText.length;
  this.msg = previewText;
  this.previewMessages = previewText.split('\n').filter(line => line.trim() !== '');
  this.updateTotalContacts();
}
  updateTotalContacts() {
    let count = 0;
    if (this.contactMother) count++;
    if (this.contactStudent) count++;
    if (this.contactFather) count++;
    if (this.contactAll) count = 3;
    this.totalContacts = count * this.selectedStudents.length;
  }

  async showPreview() {
    if (this.selectedStudents.length === 0) {
      await this.showToast('Please select at least one student.');
      return;
    }

    if (this.totalContacts === 0) {
      await this.showToast('Please select at least one contact type.');
      return;
    }

    if (!this.selectedTemplate) {
      await this.showToast('Please select a template.');
      return;
    }

    this.isModalOpen = true; // Open the modal
  }

  dismissModal() {
    this.isModalOpen = false; // Close the modal
  }

  onModalDismiss() {
    this.isModalOpen = false; // Ensure the modal state is updated when dismissed
  }

  async sendFromModal() {
    this.dismissModal(); // Close the modal
    await this.sendWhatsApp();
  }
async sendWhatsApp() {
  if (this.selectedStudents.length === 0) {
    await this.showToast('Please select at least one student.');
    return;
  }

  if (this.totalContacts === 0) {
    await this.showToast('Please select at least one contact type.');
    return;
  }

  if (!this.selectedTemplate) {
    await this.showToast('Please select a template.');
    return;
  }

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
    await this.showToast('Please select only one contact type or "All".');
    return;
  }

  try {
    for (const student of this.selectedStudents) {
      let messageTemplate = this.selectedTemplate.template_name || `{course_id} has exam on {exam_date}`; // Remove initial "Dear" from template
      const personalizedMessage = messageTemplate
        .replace('{student_name}', `${student.first_name} ${student.last_name}`)
        .replace('{father_name}', student.father_name || '')
        .replace('{mother_name}', student.mother_name || '')
        .replace('{course_id}', this.getCourseName(student.course_id))
        .replace('{semester_id}', this.getSemesterName(student.semester_id))
        // .replace('{exam_name}', 'Sample Exam') // Use actual exam name
        // .replace('{exam_date}', '12.06.2025'); // Use actual exam date

      const payload = {
        userIds: [student.id],
        message: personalizedMessage,
        recipient,
        exam_name: 'Sample Exam',
        exam_date: '12.06.2025'
      };

      const response = await this.us.post('/whatsapp/send-reminder', payload);

      if (!response.success) {
        console.error(`Failed to send to ${student.first_name}:`, response);
      }
    }

    await this.showToast('All reminders sent successfully!');
    this.msg = '';
  } catch (error) {
    console.error('Error sending reminders:', error);
    await this.showToast('Error occurred while sending.');
  }
}

  loadTemplateOnly() {
  this.msg = this.selectedTemplate?.template_name || '';
  this.previewMessages = this.msg.split('\n').filter(line => line.trim() !== '');
  this.characterCount = this.msg.length;
}


  async showToast(message: string) {
    const toast = await this.toastCtrl.create({
      message,
      duration: 2000,
      position: 'bottom',
    });
    await toast.present();
  }
}