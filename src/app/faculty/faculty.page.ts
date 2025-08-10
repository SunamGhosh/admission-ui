import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {IonicModule} from '@ionic/angular'

import { FacultyService } from '../services/faculty.service';
import { DepartmentMasterService } from '../services/department-master.service';


@Component({
  selector: 'app-faculty',
  templateUrl: './faculty.page.html',
  styleUrls: ['./faculty.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    IonicModule
  ]
})
export class FacultyPage implements OnInit {
  facultyList: any[] = [];
  filteredFaculty: any[] = [];

  departmentList: any[] = [];

  searchTerm: string = '';
  currentPage = 1;
  itemsPerPage = 10;
  totalPages = 1;

  isEditing = false;

  faculty = {
    faculty_master_id: 0,
    faculty_id: 0,
    faculty_department_id: 0,
    faculty_name: '',
    faculty_shortname: '',
    faculty_email: '',
    faculty_password: '',
    faculty_aadhar: '',
    faculty_phone: '',
    faculty_address: '',
    is_active: 1
  };

  constructor(
    private facultyService: FacultyService,
    private departmentService: DepartmentMasterService
  ) {}

  async ngOnInit() {
    await this.loadDepartments();
    await this.loadFaculties();
    await this.getNextId()
  }

  async loadDepartments() {
    this.departmentList = await this.departmentService.getAllDepartments();
  }

  async loadFaculties() {
    this.facultyList = await this.facultyService.getAllFaculty();
    this.applyFilters();
  }

  applyFilters() {
    let filtered = this.facultyList;

    if (this.searchTerm.trim() !== '') {
      const term = this.searchTerm.toLowerCase();
      filtered = filtered.filter(f =>
        f.faculty_name.toLowerCase().includes(term) ||
        f.faculty_email.toLowerCase().includes(term) ||
        f.faculty_shortname.toLowerCase().includes(term) ||
        f.faculty_phone.toLowerCase().includes(term)
      );
    }

    this.totalPages = Math.ceil(filtered.length / this.itemsPerPage);
    this.filteredFaculty = filtered.slice(
      (this.currentPage - 1) * this.itemsPerPage,
      this.currentPage * this.itemsPerPage
    );
  }

  onSearchChange() {
    this.currentPage = 1;
    this.applyFilters();
  }

  changePage(delta: number) {
    this.currentPage += delta;
    if (this.currentPage < 1) this.currentPage = 1;
    if (this.currentPage > this.totalPages) this.currentPage = this.totalPages;
    this.applyFilters();
  }

  async saveFaculty() {
    if (!this.faculty.faculty_name || !this.faculty.faculty_email || !this.faculty.faculty_password) {
      alert('Name, email and password are required');
      return;
    }

    if (this.isEditing) {
      const res = await this.facultyService.updateFaculty(this.faculty);
      if (res.ok) alert('Updated successfully');
    } else {
      const res = await this.facultyService.addFaculty(this.faculty);
      if (res.ok) alert('Added successfully');
    }

    this.resetForm();
    await this.loadFaculties();
  }

  editFaculty(data: any) {
    this.faculty = { ...data };
    this.isEditing = true;
  }

  async deleteFaculty(id: number) {
    if (confirm('Are you sure to delete this faculty?')) {
      const res = await this.facultyService.deleteFaculty(id);
      if (res.ok) {
        alert('Deleted successfully');
        await this.loadFaculties();
      }
    }
  }
async getNextId() {
  try {
    const response = await this.facultyService.getNextFacultyId(); // Call the backend API
    if (response.ok) {
      this.faculty.faculty_master_id = response.nextId; // Set the ID before saving
    } else {
      console.error('Error fetching next faculty ID:', response.msg);
      alert('Failed to fetch next faculty ID.');
    }
  } catch (error) {
    console.error('Error:', error);
    alert('An error occurred while fetching the next faculty ID.');
  }
}

  resetForm() {
    this.faculty = {
      faculty_master_id: 0,
      faculty_id: 0,
      faculty_department_id: 0,
      faculty_name: '',
      faculty_shortname: '',
      faculty_email: '',
      faculty_password: '',
      faculty_aadhar: '',
      faculty_phone: '',
      faculty_address: '',
      is_active: 1
    };
    this.isEditing = false;
  }
}
