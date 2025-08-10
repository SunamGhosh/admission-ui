import { Injectable } from '@angular/core';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class DepartmentMasterService {

  constructor(private api: ApiService) {}

  // Add department
  async addDepartment(dept: { department_name: string; department_shortname: string }) {
    return await this.api.post('/department/add', dept);
  }

  // Update department
  async updateDepartment(dept: {
    id: number;
    department_name: string;
    department_shortname: string;
    is_active: number;
  }) {
    return await this.api.post('/department/update', dept);
  }

  // Delete department (soft delete)
  async deleteDepartment(id: number) {
    return await this.api.post('/department/delete', { id });
  }

  // Get all departments
  async getAllDepartments(): Promise<any[]> {
    const response = await this.api.post('/department/getall', {});
    return response.ok ? response.data : [];
  }
}

