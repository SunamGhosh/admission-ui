import { Injectable } from '@angular/core';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class UniversityService {

  constructor(
    private api:ApiService
  ) { }


  
  async add(
    university_name: string,
    short_name: string,
   
  ) {
    let body = {
      university_name:university_name,
      short_name:short_name


    }

    let data = await this.api.post("/university/add", body);
    return data;
}


async getAll(){
  let data= await this.api.post("/university/getall",{})
  return data;
}

async getUniversityByShortName(shortName: string) {
  let data = await this.api.post(`/university/${shortName}`, {}); // Adjust the endpoint if necessary
  return data;
}


async getById(id: any) {
  try {
    // Prepare the request body
    let body = { id: id };

    // Send a POST request to the API
    let data = await this.api.post('/university/getById', body);

    // Return the response data
    return data;
  } catch (error) {
    console.error('Error fetching university by ID:', error);

    // Return a consistent error response
    return { ok: false, msg: 'Failed to fetch university data.' };
  }
}

}