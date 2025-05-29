import { Injectable } from '@angular/core';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class AdminService {

  constructor(
    private api:ApiService
  ) { }

  async authenticate(
    email: string,
    password: string) {
    let body = {
      email: email,
      password: password
    }
    let data = await this.api.post("/admin/authenticate", body)
    return data;

  };

}
