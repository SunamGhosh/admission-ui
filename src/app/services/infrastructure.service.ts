import { Injectable } from '@angular/core';
import { Infrastructure } from 'interface';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class InfrastructureService {
constructor(private api: ApiService) {}

  async add(infra: Infrastructure) {
    const data = await this.api.post('/infrastructure/add', infra);
    return data;
  }

  async update(infra: Infrastructure) {
    const data = await this.api.post('/infrastructure/update', infra);
    return data;
  }

  async getAll(): Promise<{ ok: boolean; data?: Infrastructure[]; error?: string }> {
    try {
      const response = await this.api.post('/infrastructure/getall', {});
      if (!response || typeof response !== 'object') {
        throw new Error('Invalid server response');
      }

      if (response.ok && Array.isArray(response.data)) {
        return { ok: true, data: response.data as Infrastructure[] };
      } else {
        return { ok: false, error: response.error || 'Failed to fetch infrastructure' };
      }
    } catch (error: any) {
      return { ok: false, error: error.message || 'Unexpected error' };
    }
  }

  async getById(id: number): Promise<{ ok: boolean; data?: Infrastructure; error?: string }> {
    try {
      const response = await this.api.post('/infrastructure/get', { id });
      if (!response || typeof response !== 'object') {
        throw new Error('Invalid server response');
      }

      if (response.ok && Array.isArray(response.data) && response.data.length > 0) {
        return { ok: true, data: response.data[0] as Infrastructure };
      } else {
        return { ok: false, error: 'No record found' };
      }
    } catch (error: any) {
      return { ok: false, error: error.message || 'Unexpected error' };
    }
  }

  async delete(id: number): Promise<{ ok: boolean; msg?: string; error?: string }> {
    try {
      const response = await this.api.post('/infrastructure/delete', { id });
      return response;
    } catch (error: any) {
      return { ok: false, error: error.message || 'Delete failed' };
    }
  }
}

