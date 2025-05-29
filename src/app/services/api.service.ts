import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment.prod';


@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor() { }
  async post(path: string,body:any){
    let res= await fetch(environment.api_url+path,{
      method: "POST",
      headers:{
        "Content-Type":"application/json",
      },
      body: JSON.stringify(body),
    });
    let data= await res.json();
    return data
  }




  async uploadFile(path: string, formData: FormData) {
    let res = await fetch(environment.api_url + path, {
      method: "POST",
      body: formData,  // No need for JSON headers when using FormData
    });
    let data = await res.json();
    return data;
  }
}




