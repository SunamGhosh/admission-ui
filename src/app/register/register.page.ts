import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar } from '@ionic/angular/standalone';
import{IonicModule} from '@ionic/angular'
import { ApplyOnline, Common, Course, Course_Student, Semester, Session, User } from 'interface';
import { UniversityService } from '../services/university.service';
import { ApiService } from '../services/api.service';
import { UtilsService } from '../services/utils.service';
import { UserService } from '../services/user.service';
import { RouterModule } from '@angular/router';
import { ApplyService } from '../services/apply.service';
import { NavController } from '@ionic/angular';
@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule,RouterModule]
})
export class RegisterPage implements OnInit {

   users: User[] = [];  // Array to hold all users
      filteredUsers: User[] = [];  // Array to hold filtered results based on search
      searchTerm: string = ''; 
      // newUser: ApplyOnline = {};
  
    constructor(
      private us:UserService,
      private utils:UtilsService,
      private api:ApiService,
      private universityService: UniversityService,
      private aps:ApplyService,private navCtrl: NavController
    ) { }
    courses: Course_Student[] = [];
    ngOnInit() {  // Retrieve user or admin data from local storage
      const userData = localStorage.getItem('user');
      const adminData = localStorage.getItem('admin');
      const agentData = localStorage.getItem('agent'); // Add this line
  
      if (userData) {
        this.user = JSON.parse(userData) as Common;
        this.isAdminLoggedIn = false; // It's a regular user
      } else if (adminData) {
        this.user = JSON.parse(adminData) as Common;
        this.isAdminLoggedIn = true; // It's an admin
      }  else if (agentData) { // Handle agent login
        let agent = JSON.parse(agentData);
        this.user = {
          first_name: agent.agent_name, // Map agent_name to first_name
          last_name: '', // Agents might not have last_name, so keep it empty
          email: agent.email,
          DOB: agent.DOB || 'N/A', // Handle missing DOB
          father_name: agent.father_name || 'N/A',
          mother_name: agent.mother_name || 'N/A',
          mobile: agent.mobile || agent.phone || 'N/A', // Handle different mobile fields
          role: 'agent' // ✅ Add role for agents
        }}
      console.log('Logged-in User/Admin:', this.user); // Debugging purposes
    
     
      this.loaders();
      this.loadCourses();
      this.getNextId();
      this.loadUniversities()
      this.fetchNextRollNo()
   
    }



    
       user: Common | null = null; // Store user or admin data
        isAdminLoggedIn: boolean = false; // Flag to differentiate roles
        isStudent: boolean = false;  // Add this flag for students
        role: string = ''; // ✅ ADD THIS PROPERT



        
    filter:any={
      course_id:0,
      semester_id:0,
      session_id:0,
    }

    newUser: ApplyOnline= {
      full_name: '',
      DOB: '',
      mobile: '',
      email: '',
      course_id: '',
      first_name: '',
      last_name: '',
      gender: '',
      blood_group: '',
      mobile_whatsapp: '',
      father_name: '',
      mother_name: '',
      father_phone: '',
      mother_phone: '',
      ten_marks: '',
      ten_passing_year: '',
      twelve_marks: '',
      twelve_passing_year: ''
    };
  
  
 
    async fetchNextRollNo() {
    try {
        console.log("Fetching next application number...");
        const applicationNo = await this.aps.next_application_no();
        console.log("Fetched application number:", applicationNo);
        this.newUser.application_no = applicationNo;
    } catch (error) {
        console.error("Error fetching next roll number:", error);
    }
}
// submitApplication() {
//   console.log("Submitting Application Data:", this.newUser);

//   // Ensure agent_name is properly assigned before submission
//   this.newUser.agent_name = this.user?.first_name + ' ' + this.user?.last_name;

//   if (!this.newUser.full_name || !this.newUser.DOB || !this.newUser.mobile) {
//     alert("Please fill all required fields!");
//     return;
//   }

//   this.aps.addingapply(this.newUser).then(response => {
//     console.log("Application submitted successfully", response);
//     this.utils.toast("Application submitted successfully");
//   }).catch(error => {
//     console.error("Error submitting application", error);
//   });
// }


  
    async loadCourses() {
      try {
        const response = await this.api.post('/apply/course-getall', {});
        
        // Ensure response.courses is an array
        if (response && Array.isArray(response.courses)) {
          this.courses = response.courses;
        } else {
          console.error('Invalid course data format:', response);
          this.courses = []; // Assign empty array to avoid errors
        }
    
      } catch (error) {
        console.error('Error fetching courses:', error);
        this.courses = []; // Ensure courses is always an array
      }
    }
     
      
    
      sem: Semester[]=[];
      async loaders(){
        this.sem= await this.us.semester_all()
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
  
  // async fetchNextRollNo() {
  //   try {
  //     const rollNo = await this.us.next_roll();
  //     this.newUser.roll_no = rollNo;
      
  //   } catch (error) {
  //     console.error("Error fetching next roll number:", error);
  //   }
  // }
  
  
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
       // Corrected way to get university_id from localStorage
       let id = localStorage.getItem("university_id");
       console.log("Stored University ID:", id);
     } else {
       console.error('Unexpected response format:', response);
       this.universities = []; // Handle invalid data
     }
   } catch (error) {
     console.error('Error loading universities:', error);
     this.universities = [];
   }
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
  
 

  currentStep: number = 1;  // Explicitly define type as number

  goToStep(step: number) {
    this.currentStep = step;
  }

  // nextStep() {
  //   if (this.currentStep < 4) {
  //     this.currentStep++;
  //   }
  // }

  // prevStep() {
  //   if (this.currentStep > 1) {
  //     this.currentStep--;
  //   }
  // }



  file: File | null = null;
  // userId: any = '';  // User ID to be input by the user
  imagePreview: string | null = null; // To store the image preview URL
  filePreview:string|null=null





//    // Getter and Setter for userId to sync with newUser.id
//    get userId(): any {
//     return this.newUser.id || 'Loading...';
//   }

//   set userId(value: any) {
//     this.newUser.id = value;
//   }

//   // File selection for PDF upload
//   onPdfSelect(event: any) {
//     const input = event.target as HTMLInputElement;
//     if (input?.files?.[0]) {
//       this.file = input.files[0]; // Assign selected file
//       this.filePreview = this.file.name; // Show file name preview
//       console.log('Selected file:', this.file); // Debugging
//     } else {
//       console.warn('No file selected.');
//     }
//   }

//   // PDF Upload Function
//   async uploadPdf() {
//     console.log('User ID:', this.userId); // Log user ID for debugging
//     console.log('Selected File:', this.file); // Log the selected file

//     // Validate inputs
//     if (!this.file || !this.userId) {
//       alert('Please select a file and provide a user ID.');
//       return;
//     }

//     try {
//       const response = await this.us.uploadpdf(this.userId, this.file);
//       alert('PDF uploaded successfully!');
//       console.log('Upload Response:', response);

//       // Reset after successful upload
//       this.file = null;
//       this.filePreview = null;
//     } catch (error) {
//       alert('Error uploading file. Please try again.');
//       console.error('Upload Error:', error);
//     }
//   }





// // to send whatsapp


  
// }

async sendWhatsAppReminder(userId: string, message: string, recipient: string = 'student') {
    try {
      const response = await this.api.post('/whatsapp/send-registration-reminder', { userId, message, recipient });
      console.log('WhatsApp reminder sent:', response);
      this.utils.toast('Notification sent via WhatsApp.');
    } catch (error) {
      console.error('Error sending WhatsApp reminder:', error);
      this.utils.toast('Failed to send WhatsApp notification.');
    }
  }

  async nextStep() {
    // Validate current step before proceeding
    let isValid = true;
    let errorMessage = '';

    if (this.currentStep === 1) {
      // Step 1 validation
      const requiredFields = [
        { field: this.newUser.full_name, name: 'Full Name' },
        { field: this.newUser.DOB, name: 'Date of Birth' },
        { field: this.newUser.mobile, name: 'Mobile Number' },
        { field: this.newUser.email, name: 'Email' },
        { field: this.newUser.course_id, name: 'Course' },
      ];

      const missingFields = requiredFields
        .filter((f) => !f.field)
        .map((f) => f.name);

      if (missingFields.length > 0) {
        isValid = false;
        errorMessage = `Please fill the following required fields in Step 1: ${missingFields.join(', ')}.`;
      } else if (this.emailError) {
        isValid = false;
        errorMessage = this.emailError;
      }
    } else if (this.currentStep === 2) {
      // Step 2 validation
      const requiredFields = [
        { field: this.newUser.first_name, name: 'First Name' },
        { field: this.newUser.last_name, name: 'Last Name' },
        { field: this.newUser.gender, name: 'Gender' },
        { field: this.newUser.mobile_whatsapp, name: 'WhatsApp Number' },
        { field: this.newUser.father_name, name: 'Father Name' },
        { field: this.newUser.mother_name, name: 'Mother Name' },
      ];

      const missingFields = requiredFields
        .filter((f) => !f.field)
        .map((f) => f.name);

      if (missingFields.length > 0) {
        isValid = false;
        errorMessage = `Please fill the following required fields in Step 2: ${missingFields.join(', ')}.`;
      }
    }

    if (!isValid) {
      // Show toast message
      this.utils.toast(errorMessage);

      // Send WhatsApp notification
      if (this.newUser.id && this.newUser.mobile_whatsapp) {
        const message = `Dear ${this.newUser.full_name || 'Student'}, ${errorMessage}`;
        await this.sendWhatsAppReminder(this.newUser.id, message, 'student');
      }
      return;
    }

    // Proceed to next step if validation passes
    if (this.currentStep < 3) {
      this.currentStep++;
    }
  }

  prevStep() {
    if (this.currentStep > 1) {
      this.currentStep--;
    }
  }

  async submitApplication() {
    console.log('Submitting Application Data:', this.newUser);

    this.newUser.agent_name = this.user?.first_name + ' ' + this.user?.last_name;

    if (!this.newUser.full_name || !this.newUser.DOB || !this.newUser.mobile) {
      this.utils.toast('Please fill all required fields!');
      return;
    }

    try {
      const response = await this.aps.addingapply(this.newUser);
      console.log('Application submitted successfully', response);
      this.utils.toast('Application submitted successfully');
    } catch (error) {
      console.error('Error submitting application', error);
      this.utils.toast('Error submitting application');
    }
  }

  get userId(): any {
    return this.newUser.id || 'Loading...';
  }

  set userId(value: any) {
    this.newUser.id = value;
  }

  onPdfSelect(event: any) {
    const input = event.target as HTMLInputElement;
    if (input?.files?.[0]) {
      this.file = input.files[0];
      this.filePreview = this.file.name;
      console.log('Selected file:', this.file);
    } else {
      console.warn('No file selected.');
    }
  }

  async uploadPdf() {
    console.log('User ID:', this.userId);
    console.log('Selected File:', this.file);

    if (!this.file || !this.userId) {
      alert('Please select a file and provide a user ID.');
      return;
    }

    try {
      const response = await this.us.uploadpdf(this.userId, this.file);
      alert('PDF uploaded successfully!');
      console.log('Upload Response:', response);
      this.file = null;
      this.filePreview = null;
    } catch (error) {
      alert('Error uploading file. Please try again.');
      console.error('Upload Error:', error);
    }
  }
}
