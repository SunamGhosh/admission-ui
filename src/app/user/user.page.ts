import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';  // Added IonicModule import
import { IonContent, IonHeader, IonTitle, IonToolbar, IonButtons, IonBackButton, IonSearchbar, IonGrid, IonRow, IonCol, IonText } from '@ionic/angular';  // Explicit imports
import { UserService } from '../services/user.service';
import { trigger, state, style, transition, animate } from '@angular/animations';  // Import animation functions
import { UtilsService } from '../services/utils.service';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'; // Import BrowserAnimationsModule
import { Course, Semester, Session, State, User } from 'interface';
import { ApiService } from '../services/api.service';

import {  ImageCropperComponent} from 'ngx-image-cropper'; // Import ImageCropperModule
import { UniversityService } from '../services/university.service';
import { PinService } from '../services/pin.service';


@Component({
  selector: 'app-user',
  templateUrl: './user.page.html',
  styleUrls: ['./user.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule,ImageCropperComponent],  // Ensure IonicModule is included

})

export class UserPage implements OnInit {
[x: string]: any;

  sameAsTemporary: boolean = false;

  temporaryAddress = {
    house_no: '',
    locality: '',
    area: '',
    pin: '',
    state: 0,  // âœ… Add this property
    city: '',  // âœ… Add this property
  };

  permanentAddress = {
    house_no: '',
    locality: '',
    area: '',
    pin: '',
    state: 0,  // âœ… Add this property
    city: '',  // âœ… Add this property
  };

  copyAddress() {
    if (this.sameAsTemporary) {
      this.permanentAddress = { ...this.temporaryAddress }; // Copy values
    } else {
      this.permanentAddress = { house_no: '', locality: '', area: '', pin: '',state:0,city:'' }; // Reset values
    }
  }
  // when form click table will not be visible
  isAdmissionFormVisible: boolean = false; // Controls visibility of the form

  users: User[] = [];  // Array to hold all users
  filteredUsers: User[] = [];  // Array to hold filtered results based on search
  searchTerm: string = ''; 
  newUser: User = {};
  selectedUser: User ={} // Track the user being updated
// file part
  file: File | null = null;
  // userId: any = '';  // User ID to be input by the user
  imagePreview: string | null = null; // To store the image preview URL
  filePreview:string|null=null
  


  constructor(
    private us: UserService,
    private utils: UtilsService,
    private api:ApiService,        private universityService: UniversityService,private pincodeService: PinService
    
  ) { }

  ngOnInit() {
    this.fetchNextRollNo(),
    this.loadAllUsers();  // Fetch all users when the component is initialized
    this.loaders(),
    this.loader(),
    this.loading(),
    this.generateGrid(100); // Adjust the number as needed
    this.getNextId(); // Fetch next ID here
    this.loadUniversities()
    this.loadStates()
    this.pincode = this.selectedUser?.pin || this.newUser?.pin || this.temporaryAddress?.pin || '';
    // this.downloadStudentExcel()
    this.fetchPincodeData();
  }
  pincode: string = '';
  filter:any={
    course_id:0,
    semester_id:0,
    session_id:0,
    
  }

  is_open_edit:boolean=false;
  async is_modal_open(){
    this.selectedUser.first_name="",
    this.selectedUser.last_name=""
    this.is_open_edit=true
  }

  is_open: boolean=false;
  async is_modal_add_open(){
    this.newUser.first_name="",
    this.newUser.last_name=""
    this.is_open=true
  }
  async fetchNextRollNo() {
    try {
      const rollNo = await this.us.next_roll();
      this.newUser.roll_no = rollNo;
      this.selectedUser.roll_no = rollNo;
    } catch (error) {
      console.error("Error fetching next roll number:", error);
    }
  }
  misFilePath: string | null = null; // Add this property
  // ---------------------------------------------MIS-----------------------------------------------
  // async generateMISReport() {
  //   try {
  //     const payload = {
  //       session_id: this.filter.session_id,
  //       course_id: this.filter.course_id,
  //       roll_no: this.searchTerm, // Use search term if searching by Roll No.
  //     };
  
  //     const response = await this.api.post('/user/generate-mis', payload);
      
  //     if (response.data.ok)   // Check response.data.ok
  //       {
  //       this.utils.toast('MIS Report generated successfully!');
  //       this.misFilePath = response.data.filePath;  // Save file path for download

  //     } else {
  //       this.utils.toast('Failed to generate MIS report.');
  //     }
  //   } catch (error) {
  //     console.error('Error generating MIS:', error);
  //     this.utils.toast('Error generating MIS report.');
  //   }
  // }
  
  // async downloadMISReport() {
  //   if (!this.misFilePath) {
  //     this.utils.toast('Please generate the report first.');
  //     return;
  //   }
  
  //   const fileName = this.misFilePath.split('/').pop(); // Extract filename
  //   const downloadUrl = `https://admission-api-suyk.onrender.com/download-mis/${fileName}`; // Example

    
  //   window.open(downloadUrl, '_blank');
  // }
// ------------------------------------------------------------MIS TILL HERE-------------------------------  
  // Function to load all users from the service

  // async downloadExcel() {
  //   try {
  //     const blob = await this.us.downloadStudentExcel();
      
  //     const url = window.URL.createObjectURL(blob);
  //     const a = document.createElement('a');
  //     a.href = url;
  //     a.download = 'students.xlsx';
  //     document.body.appendChild(a);
  //     a.click();
  //     document.body.removeChild(a);
  //     window.URL.revokeObjectURL(url);
  //   } catch (error) {
  //     console.error('Error downloading Excel:', error);
  //   }
  // }
  
  // async downloadStudentExcel(): Promise<void> {
  //   try {
  //     // Retrieve token from local storage (modify this as per your auth flow)
  //     const token = localStorage.getItem("token");
  
  //     // API request to download the Excel file
  //     const response = await fetch("https://admission-api-suyk.onrender.com/user/students/excel", {
  //       method: "POST",
  //       headers: token ? { "Authorization": `Bearer ${token}` } : {}, // Include token if available
  //     });
  
  //     // Check if the response is successful
  //     if (!response.ok) {
  //       const errorText = await response.text(); // Retrieve error message if any
  //       throw new Error(`Failed to download Excel: ${errorText}`);
  //     }
  
  //     // Convert response to a Blob object
  //     const blob: Blob = await response.blob();
  
  //     // Create a URL for the blob
  //     const url = window.URL.createObjectURL(blob);
      
  //     // Create an anchor element for download
  //     const a = document.createElement("a");
  //     a.href = url;
  //     a.download = "students.xlsx"; // Set file name
  //     document.body.appendChild(a);
  //     a.click();
  
  //     // Cleanup: Remove the anchor and revoke the object URL
  //     document.body.removeChild(a);
  //     window.URL.revokeObjectURL(url);
  
  //   } catch (error) {
  //     console.error("Error downloading Excel:", error);
  //   }
  // }

  selectedCourse: string | null = null;  // Declare selectedCourse property
  selectedSemester: string | null = null; // Declare selectedSemester property
  selectedSession: string | null = null; // Declare selectedSemester property

  
  async downloadStudentExcel(): Promise<void> {
    try {
      const token = localStorage.getItem("token");
  
      // Get selected filters from dropdowns
      const selectedCourse = this.selectedCourse || null;
      const selectedSemester = this.selectedSemester || null;
      const selectedSession = this.selectedSession || null; // **Fix: Use correct session variable**
  
      // API request to download filtered Excel
      const response = await fetch("https://admission-api-suyk.onrender.com/user/students/excel", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { "Authorization": `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ course: selectedCourse, semester: selectedSemester, session: selectedSession }), // **Fixed session field**
      });
  
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to download Excel: ${errorText}`);
      }
  
      const blob: Blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `students_${selectedCourse || 'All'}_${selectedSemester || 'All'}_${selectedSession || 'All'}.xlsx`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error downloading Excel:", error);
    }
  }
  
  async loadAllUsers() {
    try {
      const response = await this.us.user_all();  // Assuming the service call fetches all users
      if (response.ok && Array.isArray(response.data)) {
        this.users = response.data;
        this.filteredUsers = [...this.users];  // Initialize filtered list with all users
        console.log('Loaded users:', this.users);
      } else {
        console.error('Unexpected response format:', response);
        this.users = [];  // Set an empty array if data is invalid
      }
    } catch (error) {
      console.error('Error loading users:', error);
      this.utils.toast('User Added Succesfully');
      this.users = [];  // Handle error gracefully
    }
  }
  filterUsers() {
    const searchTermLower = this.searchTerm?.toLowerCase() || ''; 
    const selectedCourseId = this.selectedCourse || null;
    const selectedSemesterId = this.selectedSemester || null;
    const selectedSessionId = this.selectedSession || null;
  
    this.filteredUsers = this.users.filter(user => {
      const course = this.co.find(c => c.id === user.course_id);
      const courseName = course ? course.course_name?.toLowerCase() : '';
  
      return (
        (user.first_name?.toLowerCase().includes(searchTermLower) ||  
        user.roll_no?.toString().includes(searchTermLower) ||  
        courseName?.includes(searchTermLower)) &&
        (selectedCourseId ? user.course_id == selectedCourseId : true) && 
        (selectedSemesterId ? user.semester_id == selectedSemesterId : true) &&
        (selectedSessionId ? user.session_id == selectedSessionId : true) // **Changed from `||` to `&&`**
      );
    });
  }
  // pagination part
  currentPage: number = 1;
itemsPerPage: number = 8; // Adjust as needed

get paginatedUsers(): User[] {
  const startIndex = (this.currentPage - 1) * this.itemsPerPage;
  const endIndex = startIndex + this.itemsPerPage;
  return this.filteredUsers.slice(startIndex, endIndex);
}

get totalPages(): number {
  return Math.ceil(this.filteredUsers.length / this.itemsPerPage);
}

goToPage(page: number): void {
  if (page >= 1 && page <= this.totalPages) {
    this.currentPage = page;
  }
}

nextPage(): void {
  if (this.currentPage < this.totalPages) {
    this.currentPage++;
  }
}

prevPage(): void {
  if (this.currentPage > 1) {
    this.currentPage--;
  }
}


  async addUser() {
    if (!this.newUser.first_name || !this.newUser.last_name || !this.newUser.email || !this.newUser.password) {
      this.utils.toast('Please fill in all required fields.');
      return;
    }

    try {
      const response = await this.us.add(this.newUser);  // Assuming addUser is defined in UserService
      if (response.ok) {
        this.utils.toast('User added successfully!');
        this.loadAllUsers();  // Reload the user list after adding
        this.resetForm();  // Reset form fields
      } else {
        this.utils.toast('User added.');
        window.location.reload(); // Full page reload
      }
    } catch (error) {
      console.error('Error adding user:', error);
      this.utils.toast('Error adding user. Please try again.');
    }
  }


  
  // Function to reset form fields
  resetForm() {
    this.newUser = {};
  }


  emailError: string = '';

  validateEmail() {
    const email = this.newUser.email || '';  // Avoids "undefined" error
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    
    console.log(email);
    
    if (!emailPattern.test(email)) {
      this.emailError = 'Invalid email format. Compulsory to use: @gmail.com';
    } else {
      this.emailError = '';
    }
  }

co:Course[]=[];
st:Session[]=[];

  
  async loading() {
    this.co = await this.us.course_all();
    console.log('Courses loaded:', this.co); // Log to check if courses are being set
  }
 
  
  
  se: Session[]=[];
  async loader(){
    this.st= await this.us.session_all()
  }

  

  sem: Semester[]=[];
  async loaders(){
    this.sem= await this.us.semester_all()
  }



  // update user part

  async editUser(user: User) {
    this.selectedUser = { ...user }; // Clone user to avoid directly modifying the list
    this.is_open_edit = true; // Open modal for editing
  }

  // Update user
  async updateUser() {
    if (!this.selectedUser) return;

    try {
      const response = await this.us.update(this.selectedUser); // Call update method in UserService
      if (response.ok) {
        this.utils.toast('User updated successfully!');
        this.loadAllUsers(); // Reload users after update
        this.is_open = false; // Close modal
        this.selectedUser; // Reset selection
      } else {
        this.utils.toast(' updating user.');
        window.location.reload(); // Full page reload
      }
    } catch (error) {
      console.error('Error updating user:', error);
      this.utils.toast('Error updating user. Please try again.');
    }
  }

  // Close modal without saving
  closeModal() {
    this.is_open = false;
    this.selectedUser ;
  }



// for 1to 10 11to 20

rows: number[][] = [];
  generateGrid(totalNumbers: number) {
    const numbers = Array.from({ length: totalNumbers }, (_, i) => i + 1);
    for (let i = 0; i < numbers.length; i += 10) {
      this.rows.push(numbers.slice(i, i + 10));
    }
  }
  

// mobile validationj
onnumber() {
  // Remove any non-numeric characters
  this.newUser.mobile = this.newUser.mobile.replace(/[^0-9]/g, '');
  
  // Limit to 10 digits
  if (this.newUser.mobile.length > 10) {
    this.newUser.mobile = this.newUser.mobile.slice(0, 10);
  }
}
// this is the function where only alphbaets will be typed not number
allowOnlyLetters(event: KeyboardEvent) {
  const allowedChars = /^[a-zA-Z ]$/;
  const inputChar = event.key;

  if (!allowedChars.test(inputChar)) {
    event.preventDefault(); // Stops number/special character input
  }
}


onnumber1() {
  // Remove any non-numeric characters
  this.newUser.mobile_two = this.newUser.mobile_two.replace(/[^0-9]/g, '');
  
  // Limit to 6 digits
  if (this.newUser.mobile_two.length > 10) {
    this.newUser.mobile = this.newUser.mobile_two.slice(0, 10);
  }
}

onnumberwhatsapp() {
  // Remove any non-numeric characters
  this.newUser.mobile_whatsapp = this.newUser.mobile_whatsapp.replace(/[^0-9]/g, '');
  
  // Limit to 6 digits
  if (this.newUser.mobile_whatsapp.length > 10) {
    this.newUser.mobile = this.newUser.mobile_whatsapp.slice(0, 10);
  }
}


onnumberfatherandmother() {
  // Remove any non-numeric characters
  this.newUser.father_phone = this.newUser.father_phone.replace(/[^0-9]/g, '');
  this.newUser.mother_phone = this.newUser.mother_phone.replace(/[^0-9]/g, '');

  
  // Limit to 6 digits
  if (this.newUser.father_phone.length > 10 || this.newUser.mother_phone.length > 10 ) {
    this.newUser.mobile = this.newUser.father_phone.slice(0, 10);
    this.newUser.mobile = this.newUser.mother_phone.slice(0, 10);

  }
}

onroll_no() {
  // Remove any non-numeric characters
  this.newUser.roll_no = this.newUser.roll_no.replace(/[^0-9]/g, '');
  
  
  // Limit to 6 digits
  if (this.newUser.roll_no.length > 5 ) {
    this.newUser.roll_no = this.newUser.roll_no.slice(0, 10);
    

  }
}



  
// TO SHOW ID

async getNextId() {
  try {
    const response = await this.api.post('/user/next-id', {}); // Call the API to get the next ID
    if (response.ok) {
      this.newUser.id = response.nextId; // Set the next ID in the form
    } else {
      console.error('Error fetching next ID:', response.msg);
      this.utils.toast('Failed to fetch the next ID.'); // Optional: Show a notification
    }
  } catch (error) {
    console.error('Error:', error);
    this.utils.toast('An error occurred while fetching the next ID.'); // Optional: Show a notification
  }
}




// file_part
onFileSelected(event: any) {
  const input = event.target as HTMLInputElement;
  if (input?.files?.[0]) {
    this.file = input.files[0]; // Store the selected file
    console.log('File selected:', this.file); // Debugging line

    const reader = new FileReader();
    reader.onload = (e: any) => {
      this.imagePreview = e.target.result; // Set the imagePreview with the file's data URL
    };
    reader.readAsDataURL(this.file);
  } else {
    console.warn('No file selected.');
  }
}

// Function to upload the file
async uploadFile() {
  console.log('User ID:', this.userId);  // Debugging line
  console.log('File:', this.file);       // Debugging line

  if (!this.file || !this.userId) {
    alert('Please select a file and provide a user ID.');
    return;
  }

  try {
    const response = await this.us.uploadFile(this.userId, this.file);
    alert('File uploaded successfully!');
    console.log('Response:', response);

    // Reset the preview and file after upload
    this.imagePreview = null;
    this.file = null;
  } catch (error) {
    alert('Error uploading file!');
    console.error('Error:', error);
  }
}



  // Getter and Setter for userId to sync with newUser.id
  get userId(): any {
    return this.newUser.id || 'Loading...';
  }

  set userId(value: any) {
    this.newUser.id = value;
  }

  // File selection for PDF upload
  onPdfSelect(event: any) {
    const input = event.target as HTMLInputElement;
    if (input?.files?.[0]) {
      this.file = input.files[0]; // Assign selected file
      this.filePreview = this.file.name; // Show file name preview
      console.log('Selected file:', this.file); // Debugging
    } else {
      console.warn('No file selected.');
    }
  }

  // PDF Upload Function
  async uploadPdf() {
    console.log('User ID:', this.userId); // Log user ID for debugging
    console.log('Selected File:', this.file); // Log the selected file

    // Validate inputs
    if (!this.file || !this.userId) {
      alert('Please select a file and provide a user ID.');
      return;
    }

    try {
      const response = await this.us.uploadpdf(this.userId, this.file);
      alert('PDF uploaded successfully!');
      console.log('Upload Response:', response);

      // Reset after successful upload
      this.file = null;
      this.filePreview = null;
    } catch (error) {
      alert('Error uploading file. Please try again.');
      console.error('Upload Error:', error);
    }
  }




// university fetch
selectedUniversity: {
  id: number;
  university_name: string;
  short_name: string;
  image: string;
  link: string;
} | null = null; // Holds the selected university


universities: {
  id: number;
  university_name: string;
  short_name: string;
  image: string;
  link: string;
}[] = [];

async loadUniversities() {
  try {
    const response = await this.universityService.getAll();
    console.log('Universities API Response:', response); // Debug response
    if (response.ok && Array.isArray(response.data)) {
      this.universities = response.data.map((u: any) => ({
        id: u.id,
        university_name: u.university_name,
        short_name: u.short_name,
        image: '../../assets/default_image.jpg', // Placeholder image
        link: `/course/${u.id}`, // Pass the actual ID in the link
      }));
     
    } else {
      console.error('Unexpected response format:', response);
      this.universities = []; // Handle invalid data
    }
  } catch (error) {
    console.error('Error loading universities:', error);
    this.universities = [];
  }
}

onUniversityChange(event: any) {
  this.selectedUniversity = event.detail.value; // Update selected university
  console.log('Selected University:', this.selectedUniversity);
}





// get coursename using id
getCourseName(courseId: number): string {
  const course = this.co.find(c => c.id === courseId);
  return course?.course_name ?? 'N/A'; // Use optional chaining and nullish coalescing
}




// get semester name by id
getsemesterName(semesterId: number): string {
  const semester = this.sem.find(s => s.id === semesterId);
  return semester?.semester_name ?? 'N/A'; // Use optional chaining and nullish coalescing
}






// Pincode Data
pincodeData: any[] = [];
localityList: string[] = [];
areaList: string[] = [];

async fetchPincodeData() {
  try {
    const response = await this.pincodeService.getPincodes();
    if (response.ok) {
      this.pincodeData = response.data;
      console.log("Pincode Data Loaded:", this.pincodeData); // âœ… Debugging
    } else {
      console.error("Failed to fetch pincode data from API.");
      this.pincodeData = [];
    }
  } catch (error) {
    console.error("Error fetching pincode data:", error);
    this.pincodeData = [];
  }
}

onPincodeChange() {
  // Sync values across multiple objects
  this.temporaryAddress.pin = this.pincode;
  this.newUser.pin = this.pincode;
  this.selectedUser.pin = this.pincode;

  // Fetch locality, area, state, and city
  if (this.pincode.length === 6) {
      const matchedEntries = this.pincodeData.filter(entry => entry.pin === this.pincode);

      if (matchedEntries.length > 0) {
          this.localityList = [...new Set(matchedEntries.map(entry => entry.locality || entry.location))];
          this.areaList = [...new Set(matchedEntries.map(entry => entry.area))];

          this.temporaryAddress.locality = this.localityList.length > 0 ? this.localityList[0] : '';
          this.newUser.locality = this.temporaryAddress.locality;
          this.selectedUser.locality = this.temporaryAddress.locality;

          this.temporaryAddress.area = this.areaList.length > 0 ? this.areaList[0] : '';
          this.newUser.area = this.temporaryAddress.area;
          this.selectedUser.area = this.temporaryAddress.area;

          this.temporaryAddress.state = matchedEntries[0]?.state || '';
          this.newUser.state = this.temporaryAddress.state;
          this.selectedUser.state = this.temporaryAddress.state;

      } else {
          this.resetAddressFields();
      }
  }
}

sta:State[]=[]
getStateName(stateId: number): string {
  console.log("Fetching state name for ID:", stateId);
  console.log("Available states:", this.sta);

  const state = this.sta.find(c => c.id === stateId);
  return state?.state_name ?? 'N/A'; // Use optional chaining and nullish coalescing
}
async loadStates() {
  try {
    const response = await this.us.state_all(); // Fetch from API
    if (response.ok) {
      this.sta = response.data;  // âœ… Store states in `sta`
      console.log("Loaded states:", this.sta);
    } else {
      console.error("Failed to load states");
    }
  } catch (error) {
    console.error("Error loading states:", error);
  }
}

resetAddressFields() {
  this.localityList = [];
  this.areaList = [];
  this.temporaryAddress.locality = '';
  this.temporaryAddress.area = '';

  this.temporaryAddress.city = '';
  this.newUser.locality = '';
  this.newUser.area = '';
}}
