import { Injectable } from '@angular/core';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class TimetableService {

  constructor(
    private api:ApiService
  ) { }

  // ────────────────────────────
  // 📌 1. Get ALL timetable rows
  // ────────────────────────────
  async getAll(): Promise<any[]> {
    const res = await this.api.post('/timetable/getall', {});
    return res.ok ? res.data : [];
  }

  // ────────────────────────────
  // 📌 2. Get ONE timetable row by id
  // ────────────────────────────
  async getById(id: number): Promise<any> {
    const res = await this.api.post('/timetable/getbyid', { id });
    return res.ok ? res.data[0] : null;
  }

  // ────────────────────────────
  // 📌 3. Add new timetable row
  // ────────────────────────────
  async add(entry: {
    session_id: number;
    course_id: number;
    semester_id: number;
    subject_id: number;
    faculty_id: number;
    day: string;
    date?: string;          // optional
    start_time: string;
    end_time: string;
    room_id?: number;
    meeting_id?: string;
    meeting_password?: string;
    event_name?: string;
    holiday?: string;
    is_active?: number;     // default = 1 on backend
  }) {
    return await this.api.post('/timetable/add', entry);
  }

  // ────────────────────────────
  // 📌 4. Update timetable row
  // ────────────────────────────
  async update(entry: {
    id: number;
    session_id: number;
    course_id: number;
    semester_id: number;
    subject_id: number;
    faculty_id: number;
    day: string;
    date?: string;
    start_time: string;
    end_time: string;
    room_id?: number;
    meeting_id?: string;
    meeting_password?: string;
    event_name?: string;
    holiday?: string;
    is_active?: number;
  }) {
    return await this.api.post('/timetable/update', entry);
  }

  // ────────────────────────────
  // 📌 5. Soft‑delete (set inactive)
  // ────────────────────────────
  async delete(id: number) {
    return await this.api.post('/timetable/delete', { id });
  }
}

