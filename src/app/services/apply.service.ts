import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { ApplyOnline } from 'interface';

@Injectable({
  providedIn: 'root'
})
export class ApplyService {

  constructor(private api:ApiService) { }


  async addingapply(aon: ApplyOnline) {
    console.log("Submitting Application Data:", JSON.stringify(aon));
  
    try {
        let response = await fetch("http://localhost:3000/apply/add", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(aon)
        });
  
        let data = await response.json();
        console.log("Response from Backend:", data);
        return data;
    } catch (error) {
        console.error("Error in API Call:", error);
    }
  }
  

    async next_application_no() {
      let data = await this.api.post("/apply/application-no", {}); 
      console.log("API Response:", data); // ✅ Check API response
      return data.nextApplicationNo; // ✅ Correctly returning nextApplicationNo
  }
  
// ✅ New method to check incomplete fields and send WhatsApp reminder
  async checkIncompleteFieldsAndRemind(id: number) {
    try {
      const response = await fetch("http://localhost:3000/apply/check-incomplete-fields-and-remind", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ id })
      });

      const data = await response.json();
      console.log("Incomplete Check & WhatsApp Reminder Response:", data);
      return data;
    } catch (error) {
      console.error("Error checking incomplete fields:", error);
      return { ok: false, msg: "Failed to check or send reminder" };
    }
  }


  async authenticate(
    email: string,
   mobile: string) {
    let body = {
      email: email,
     mobile:mobile
    }
    let data = await this.api.post("/apply/authenticate", body)
    return data;

  };

  async applycourse_all(){
    let data= await this.api.post("/apply/course-getall",{})
    return data;
  }



  
  async online_all(){
    let data= await this.api.post("/apply/getall",{})
    return data;
  }
}
