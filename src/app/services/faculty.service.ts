import { Injectable } from '@angular/core';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class FacultyService {
 constructor(private api: ApiService) {}

  // Add new faculty
  async addFaculty(faculty: {
    faculty_id: number;
    faculty_department_id: number;
    faculty_name: string;
    faculty_shortname: string;
    faculty_email: string;
    faculty_password: string;
    faculty_aadhar?: string;
    faculty_phone: string;
    faculty_address?: string;
  }) {
    return await this.api.post('/faculty/add', faculty);
  }

  // Update faculty
  async updateFaculty(faculty: {
    faculty_master_id: number;
    faculty_id: number;
    faculty_department_id: number;
    faculty_name: string;
    faculty_shortname: string;
    faculty_email: string;
    faculty_password: string;
    faculty_aadhar?: string;
    faculty_phone: string;
    faculty_address?: string;
    is_active: number;
  }) {
    return await this.api.post('/faculty/update', faculty);
  }

  // Delete faculty (soft delete)
  async deleteFaculty(faculty_master_id: number) {
    return await this.api.post('/faculty/delete', { faculty_master_id });
  }

  // Get all faculty records
  async getAllFaculty(): Promise<any[]> {
    const response = await this.api.post('/faculty/getall', {});
    return response.ok ? response.data : [];
  }
 
  async authenticate(email: string, password: string) {
    const body = { email, password };
    return await this.api.post("/faculty/login", body);
  }

  // faculty.service.ts
getNextFacultyId() {
  return this.api.post('/faculty/next-id', {});
}


//-----------------------------  faculty recognisation part----------------------------------
  async addFacultyRecognisation(data: {
    session_id: number;
    course_id: number;
    semester_id: number;
    subject_id: number;
    faculty_id: number;
  }) {
    return await this.api.post('/recognisation/add', data);
  }


  async updateFacultyRecognisation(data: {
    id: number;
    session_id: number;
    course_id: number;
    semester_id: number;
    subject_id: number;
    faculty_id: number;
  }) {
    return await this.api.post('/recognisation/update', data);
  }


  async deleteFacultyRecognisation(id: number) {
    return await this.api.post('/recognisation/delete', { id });
  }


  async getAllFacultyRecognisation(): Promise<any[]> {
    const response = await this.api.post('/recognisation/getall', {});
    return response.ok ? response.data : [];
  }


  async getFacultyBySubject(subject_id: number): Promise<any[]> {
    const response = await this.api.post('/recognisation/by-subject', { subject_id });
    return response.ok ? response.data : [];
  }
}

