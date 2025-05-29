import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { Agent, Country, Course, Elective, Module, Office, Session, Specialisation, State, Subject, User } from 'interface';

@Injectable({
  providedIn: 'root'
})
export class UserService {
 

  constructor(
    private api:ApiService
  ) { }

  // user.service.ts (add below your existing methods)
// template part
async addTemplate(template: {
  module_id: number,
  category_id: number,
  subcategory_id: number,
  template_shortname: string,
  template_name: string,
  variables?: string
}) {
  return await this.api.post("/template/add", template);
}
addTemplateVariable(data: { template_id: number, variable_key: string, variable_description: string }) {
  return this.api.post('/template/variable/add', data);
}

addTemplateUrl(data: { template_id: number, url_label: string, url_value: string }) {
  return this.api.post('/template/url/add', data);
}

getTemplateVariables(template_id: number) {
  return this.api.post('/template/variable/get', { template_id });
}

getTemplateUrls(template_id: number) {
  return this.api.post('/template/url/get', { template_id });
}

async getTemplates(module_id?: number) {
  const response = await this.api.post("/template/get", { module_id: module_id || null });
  return response.ok ? response.data : [];
}

async getSubcategoriesByCategory(category_id: number) {
  const response = await this.api.post("/subcategory/get_by_category", { category_id });
  return response.ok ? response.data : [];
}

async add_sub_category(subcategory: { id: number | null; category_id: number; subcategory_name: string }) {
  return await this.api.post("/subcategory/add", subcategory);
}

async update_sub_category(subcategory: { id: number | null; category_id: number; subcategory_name: string }) {
  return await this.api.post("/subcategory/update", subcategory);
}

async delete_sub_category(id: number) {
  return await this.api.post("/subcategory/delete", { id });
}
 async subcategory_all() {
  const response = await this.api.post("/subcategory/getall", {});
  return response.data; // Assuming you need only the data array
}


  async category_all() {
  const response = await this.api.post("/category/getall", {});
  return response.data; // Assuming you need only the data array
}

async add_category(category: { id: number | null; category_name: string; category_shortname: string }) {
  return await this.api.post("/category/add", category);
}

async update_category(category: { id: number | null; category_name: string; category_shortname: string }) {
  return await this.api.post("/category/update", category);
}


async delete_category(id: number) {
  const response = await this.api.post("/category/delete", { id });
  return response;
}

 async getAllTables(): Promise<any[]> {
    const response = await this.api.post("/tables/getall", {});
    return response.ok ? response.data : [];
  }

  async addTable(module_id: number, table: string): Promise<any> {
    return await this.api.post("/tables/add", { module_id, table });
  }


  async updateTable(id: number, module_id: number, table: string): Promise<any> {
    return await this.api.post("/tables/update", { id, module_id, table });
  }


  async removeTable(id: number): Promise<any> {
    return await this.api.post("/tables/remove", { id });
  }


  async getTablesByModule(module_id: number): Promise<any[]> {
    const response = await this.api.post("/tables/get_by_module", { module_id });
    return response.ok ? response.data : [];
  }

// ✔️ Update this to return full response object
async getAllModules(): Promise<{ ok: boolean, data: Module[] }> {
  const response = await this.api.post("/module/getall", {});
  return response;
}


 
  async addModule(module_name: string): Promise<any> {
    return await this.api.post("/module/add", { module_name });
  }

  
  async updateModule(id: number, module_name: string): Promise<any> {
    return await this.api.post("/module/update", { id, module_name });
  }

 
  async removeModule(id: number): Promise<any> {
    return await this.api.post("/module/remove", { id });
  }

async sendExamReminder(message: string) {
  const data = await this.api.post("/whatsapp/send-reminder", { message });
  return data;
}


  async next_roll() {
    let data = await this.api.post("/user/next-roll", {}); // Call the backend endpoint
    console.log('Next Roll No:', data); // Log response to check
    return data.nextRollNo; // Return only the roll number
}


  // /** ✅ Download Student Excel File */
  // async downloadStudentExcel() {
  //   const data = await this.api.post("/user/students/excel", {}); // No third argument
  //   return new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
  // }
  
  async downloadStudentExcel(): Promise<void> {
    try {
      // Retrieve token from local storage (modify this as per your auth flow)
      const token = localStorage.getItem("token");
  
      // API request to download the Excel file
      const response = await fetch("http://your-api-url/user/students/excel", {
        method: "POST",
        headers: token ? { "Authorization": `Bearer ${token}` } : {}, // Include token if available
      });
  
      // Check if the response is successful
      if (!response.ok) {
        const errorText = await response.text(); // Retrieve error message if any
        throw new Error(`Failed to download Excel: ${errorText}`);
      }
  
      // Convert response to a Blob object
      const blob: Blob = await response.blob();
  
      // Create a URL for the blob
      const url = window.URL.createObjectURL(blob);
      
      // Create an anchor element for download
      const a = document.createElement("a");
      a.href = url;
      a.download = "students.xlsx"; // Set file name
      document.body.appendChild(a);
      a.click();
  
      // Cleanup: Remove the anchor and revoke the object URL
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
  
    } catch (error) {
      console.error("Error downloading Excel:", error);
    }
  }
  
  async authenticate(email: string, password: string) {
    const body = { email, password };
    return await this.api.post("/user/authenticate", body);
  }
  
  base = "http://localhost:3000"; // change this to your server URL
  // async post(url: string, body: any) {
  //   try {
  //     const response = await fetch(this.base + url, {
  //       method: 'POST',
  //       headers: {
  //         'Content-Type': 'application/json'
  //       },
  //       body: JSON.stringify(body)
  //     });

  //     const data = await response.json();
  //     return data;
  //   } catch (error) {
  //     console.error("API Error:", error);
  //     return { ok: false, msg: "Something went wrong", error };
  //   }
  // }

  // async get(url: string) {
  //   try {
  //     const response = await fetch(this.base + url);
  //     const data = await response.json();
  //     return data;
  //   } catch (error) {
  //     console.error("API GET Error:", error);
  //     return { ok: false, msg: "Something went wrong", error };
  //   }
  // }


  async add(a:User){
    let data= await this.api.post("/user/add",a)
    return data;

  }

  async update(user:User){
    let data= await this.api.post("/user/update",user)
    return data;

  }
async whatsapp_user_all(): Promise<{ ok: boolean; data?: User[]; error?: string }> {
  try {
    console.log('Calling /whatsapp/getall');
    const response = await this.api.post("/whatsapp/getall", {});
    console.log('Raw response from /whatsapp/getall:', response);

    if (!response || typeof response !== 'object') {
      throw new Error('Invalid response from server');
    }

    if (response.ok && Array.isArray(response.data)) {
      // Log the user IDs to debug
      console.log('User IDs from /whatsapp/getall:', response.data.map((user: User) => user.id));
      return {
        ok: true,
        data: response.data as User[],
      };
    } else if (!response.ok) {
      return {
        ok: false,
        error: response.error || 'Failed to fetch users',
      };
    } else {
      throw new Error('Unexpected response format');
    }
  } catch (error: unknown) {
    console.error('Error in whatsapp_user_all:', error);
    const errorMessage = error instanceof Error ? error.message : String(error);
    return {
      ok: false,
      error: errorMessage || 'An error occurred while fetching users',
    };
  }

  }
  async user_all(){
    let data= await this.api.post("/user/getall",{})
    return data;
  }


  async course_all() {
    let data = await this.api.post("/course/getall", {});
    console.log('Course data:', data); // Log to check the response
    return data.data; // Ensure you're returning the `data` part of the response
  }
  async session_all() {
    let data = await this.api.post("/session/getall", {});
    console.log('Course data:', data); // Log to check the response
    return data.data; // Ensure you're returning the `data` part of the response
  }
  async semester_all() {
    let data = await this.api.post("/semester/getall", {});
    console.log('Course data:', data); // Log to check the response
    return data.data; // Ensure you're returning the `data` part of the response
  }


  async adding(s:Subject){
    let data= await this.api.post("/subject/add",s)
    return data;

  }

  async subject_all() {
    let data = await this.api.post("/subject/getall", {});
    console.log('Course data:', data); // Log to check the response
    return data.data; // Ensure you're returning the `data` part of the response
  }
  

  async syllabus_get_all() {
    let data = await this.api.post("/syllabus/getall", {});
    console.log('Course data:', data); // Log to check the response
    return data.data; // Ensure you're returning the `data` part of the response
  }
  

  async country_all(){
    let data= await this.api.post("/country/getall",{})
    return data;
  }

  async state_all(){
    let data= await this.api.post("/state/getall",{})
    return data;
  }

// Get all cities
async getAllCities() {
  let data = await this.api.post("/city/getall", {});
  return data;
}

// Get cities by state ID
async getCitiesByState(state_id: number) {
  let data = await this.api.post("/city/get_by_state", { state_id });
  return data;
}



async getStateByCountry(country_id: number) {
  let data = await this.api.post("/state/getByCountry", { country_id });
  return data;
}
// Add a new city
async addCity(state_id: number, city_name: string) {
  let data = await this.api.post("/city/add", { state_id, city_name });
  return data;
}



  async elective_all(){
    let data= await this.api.post("/elective/getall",{})
    return data;
  }

  async addings(e:Elective){
    let data= await this.api.post("/elective/add",e)
    return data;
  }



  async specialisation_all(){
    let data= await this.api.post("/specialisation/getall",{})
    return data;
  }


  
  async addingss(sp:Specialisation){
    let data= await this.api.post("/specialisation/add",sp)
    return data;
  }



  async addedState(s:State){
    let data= await this.api.post("/state/add",s)
    return data;

  }

  async addedCountry(c:Country){
    let data= await this.api.post("/country/add",c)
    return data;

  }


  async addedCourse(c:Course){
    let data= await this.api.post("/course/add",c)
    return data;

  }



  
  async addedSession(s:Session){
    let data= await this.api.post("/session/add",s)
    return data;

  }


  async updateSession(s:Session){
    let data= await this.api.post("/session/update",s)
    return data;

  }

  async updateCourse(c:Course){
    let data= await this.api.post("/course/update",c)
    return data;

  }



  async updateElective(elective:Elective){
    let data= await this.api.post("/elective/update",elective)
    return data;

  }



  async updatespecialisation(specialisation:Specialisation){
    let data= await this.api.post("/specialisation/update",specialisation)
    return data;

  }





 
   // Upload file method
   async uploadFile(userId: string, file: File) {
    const formData = new FormData();
    formData.append('file', file);       // Attach the file
    formData.append('userId', userId);   // Attach the user ID

    let data = await this.api.uploadFile("/user/upload", formData);  // Call the API to upload file
    return data;
  }


  // upload pdf
  async uploadpdf(userId: string, file: File) {
    const formData = new FormData();
    formData.append('file', file);       // Attach the file
    formData.append('userId', userId);   // Attach the user ID

    let data = await this.api.uploadFile("/user/uploadpdf", formData);  // Call the API to upload file
    return data;
  }


  // view docs
   // View documents - Fetching documents of a user by userId
   async getUserDocuments(userId: number) {
    let data = await this.api.post(`/user/docs/${userId}`, {});  // POST request to the API
    if (data && data.ok && Array.isArray(data.docs)) {
      return data.docs;  // Return the documents array from the response
    } else {
      throw new Error('No documents found or failed to fetch documents');
    }
  }







  // ---------------------------------------------office staff-----------------------------------------------------
  async addOffice(office:Office){
    let data= await this.api.post("/office/add",office)
    return data;

  }



  async officeauthenticate(
    email: string,
    password: string) {
    let body = {
      email: email,
      password: password
    }
    let data = await this.api.post("/office/authenticate", body)
    return data;

  };



  private baseUrl = 'http://localhost:3000'; // Replace with actual API URL

// ✅ GET method
async get(endpoint: string): Promise<any> {
  try {
    const response = await fetch(`${this.baseUrl}${endpoint}`);
    if (!response.ok) throw new Error(`GET request failed: ${response.statusText}`);
    return await response.json();
  } catch (error) {
    console.error('Error in GET:', error);
    return { ok: false, msg: 'Something went wrong', error };
  }
}

// ✅ POST method
async post(endpoint: string, data: any): Promise<any> {
  try {
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (!response.ok) throw new Error(`POST request failed: ${response.statusText}`);
    return await response.json();
  } catch (error) {
    console.error('Error in POST:', error);
    return { ok: false, msg: 'Something went wrong', error };
  }
}


// ---------------------------------AGENT PART----------------------------------------------

async AGENT_all(){
  let data= await this.api.post("/agent/getall",{})
  return data;
}


async addagent(agent:Agent){
  let data= await this.api.post("/agent/add",agent)
  return data;

}


async sub_AGENT_all(){
  let data= await this.api.post("/sub-agent/getall",{})
  return data;
}



async agentauthenticate(
  email: string,
  password: string) {
  let body = {
    email: email,
    password: password
  }
  let data = await this.api.post("/agent/authenticate", body)
  return data;

};



async uploadSyllabus(semesterId: string, courseId: string, file: File) {
  const formData = new FormData();
  formData.append('file', file);          // Attach the file
  formData.append('semester_id', semesterId);  // Attach Semester ID
  formData.append('course_id', courseId);      // Attach Course ID

  let data = await this.api.uploadFile('/syllabus/upload-syllabus', formData);  // API call
  return data;
}


// user.service.ts
async courseStructure_get_all() {
  let data = await this.api.post("/structure/getall", {});
  console.log('Course Structure data:', data);
  return data.data;
}

async uploadCourseStructure(semesterId: string,courseId:string, file: File) {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('semester_id', semesterId);
  formData.append('course_id', courseId);


  let data = await this.api.uploadFile('/structure/upload-course-structure', formData);
  return data;
}



// 🔹 Get All Question Banks
async questionBank_get_all() {
  let data = await this.api.post("/question/getall", {});
  console.log('Question Bank data:', data);
  return data.data;
}

// 🔹 Upload Question Bank
async uploadQuestionBank(semesterId: string, subjectId: string,courseId:string,name:string, file: File) {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('semester_id', semesterId);
  formData.append('subject_id', subjectId);
  formData.append('course_id',courseId);

  formData.append('name', name);  // ✅ Add assignment name here
  let data = await this.api.uploadFile('/question/upload-question-bank', formData);
  return data;
}

// 🔹 Get Question Bank by Subject
async getQuestionBankBySubject(subjectId: string) {
  let data = await this.api.post("/question/get-question-bank-by-subject", {
    subject_id: subjectId,
  });
  return data.data;
}




// 🔹 Get All University Questions
async universityQuestion_get_all() {
  let data = await this.api.post("/universityquestion/getall", {});
  console.log('University Question data:', data);
  return data.data;
}

// 🔹 Upload University Question
async uploadUniversityQuestion(semesterId: string, subjectId: string, courseId:string,name:string, file: File) {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('semester_id', semesterId);
  formData.append('subject_id', subjectId);
  formData.append('course_id', courseId);
  formData.append('name', name);  // ✅ Add assignment name here


  let data = await this.api.uploadFile('/universityquestion/upload-university-question', formData);
  return data;
}

// 🔹 Get University Questions by Subject
async getUniversityQuestionBySubject(subjectId: string) {
  let data = await this.api.post("/universityquestion/get-university-question-by-subject", {
    subject_id: subjectId,
  });
  return data.data;
}


// 🔹 Get All Assignments
async assignment_get_all() {
  let data = await this.api.post("/assignment/getall", {});
  console.log('Assignment data:', data);
  return data.data;
}

// 🔹 Upload Assignment
async uploadAssignment(semesterId: string, subjectId: string,courseId:string,name: string, file: File) {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('semester_id', semesterId);
  formData.append('subject_id', subjectId);
  formData.append('course_id', courseId);
  formData.append('name', name);  // ✅ Add assignment name here


  let data = await this.api.uploadFile('/assignment/upload-assignment', formData);
  return data;
}

// 🔹 Get Assignments by Subject
async getAssignmentBySubject(subjectId: string) {
  let data = await this.api.post("/assignment/get-assignment-by-subject", {
    subject_id: subjectId,
  });
  return data.data;
}
}