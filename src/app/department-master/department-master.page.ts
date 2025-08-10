import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {IonicModule} from '@ionic/angular'
import { DepartmentMasterService } from '../services/department-master.service';


@Component({
  selector: 'app-department-master',
  templateUrl: './department-master.page.html',
  styleUrls: ['./department-master.page.scss'],
  standalone: true,
  imports: [
   IonicModule,
    CommonModule,
    FormsModule
  ],
})
export class DepartmentMasterPage implements OnInit {
  departments: any[] = [];
  filteredDepartments: any[] = [];

  currentPage = 1;
  itemsPerPage = 10;
  totalPages = 1;

  searchTerm: string = '';

  newDepartment = {
    id: 0,
    department_name: '',
    department_shortname: '',
    is_active: 1,
  };

  isEditing = false;

  constructor(private departmentService: DepartmentMasterService) {}

  async ngOnInit() {
    await this.loadDepartments();
  }

  async loadDepartments() {
    this.departments = await this.departmentService.getAllDepartments();
    this.applyFilters();
  }

  applyFilters() {
    let filtered = this.departments;

    if (this.searchTerm.trim() !== '') {
      const term = this.searchTerm.toLowerCase();
      filtered = filtered.filter(dept =>
        dept.department_name.toLowerCase().includes(term) ||
        dept.department_shortname.toLowerCase().includes(term)
      );
    }

    this.totalPages = Math.ceil(filtered.length / this.itemsPerPage);
    this.filteredDepartments = filtered.slice(
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

  async saveDepartment() {
    const { department_name, department_shortname } = this.newDepartment;

    if (!department_name || !department_shortname) {
      alert('Both name and short name are required.');
      return;
    }

    if (this.isEditing) {
      const updated = await this.departmentService.updateDepartment(this.newDepartment);
      if (updated.ok) alert('Updated successfully');
    } else {
      const added = await this.departmentService.addDepartment(this.newDepartment);
      if (added.ok) alert('Added successfully');
    }

    this.resetForm();
    await this.loadDepartments();
  }

  editDepartment(dept: any) {
    this.newDepartment = { ...dept };
    this.isEditing = true;
  }

  async deleteDepartment(id: number) {
    if (confirm('Are you sure you want to delete this department?')) {
      const deleted = await this.departmentService.deleteDepartment(id);
      if (deleted.ok) {
        alert('Deleted successfully');
        await this.loadDepartments();
      }
    }
  }

  resetForm() {
    this.newDepartment = {
      id: 0,
      department_name: '',
      department_shortname: '',
      is_active: 1,
    };
    this.isEditing = false;
  }
}
