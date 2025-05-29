import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonGrid, IonRow, IonCol, IonText, IonButton, IonIcon, IonModal, IonButtons, IonItem, IonLabel } from '@ionic/angular/standalone';
import { Course, Elective, Semester } from 'interface';
import { UserService } from '../services/user.service';
import { UtilsService } from '../services/utils.service';
import { IonicModule } from '@ionic/angular';  // Added IonicModule import

@Component({
  selector: 'app-elective',
  templateUrl: './elective.page.html',
  styleUrls: ['./elective.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class ElectivePage implements OnInit {

  elective: Elective[] = [];  // Array to hold all electives
  filteredElective: Elective[] = [];  // Array to hold filtered results based on search
  searchTerm: string = '';  // Search term for filtering electives
  is_open_edit: boolean = false;  // Modal visibility flag for edit mode
  selectedElective: Elective = {};  // Selected elective data for editing
is_open:boolean=false
  // Initialize new elective object
  newpaper: Elective = { elective_paper: '' };
  lastInsertedId: number | null = null; // Stores the last inserted ID

  // Initialize the new elective object
 

  constructor(private us: UserService, private utils: UtilsService) {}

  ngOnInit() {
    this.loadAllElective(); // Fetch all electives on initialization
    this.loading();
    this.loadings()
  }

  filter:any={
    course_id:0,
    semester_id:0,
    session_id:0,
  }
  // Load all electives from the server
  async loadAllElective() {
    try {
      const response = await this.us.elective_all();
      if (response?.ok && Array.isArray(response?.data)) {
        this.elective = response.data;
        this.filteredElective = [...this.elective]; // Initialize filtered list with all electives
        console.log('Loaded electives:', this.elective);
      } else {
        console.error('Unexpected response format:', response);
        this.elective = [];
        this.utils.toast('Failed to load electives. Please try again.');
      }
    } catch (error) {
      console.error('Error loading electives:', error);
      this.utils.toast('Error loading electives. Please check your network or try again.');
    }
  }

  selectedCourse: number | null = null;
  selectedSemester: number | null = null;
  selectedSession: number | null = null;
  
  // Function to filter electives based on search, course, semester, and session
  filterElectives() {
    this.filteredElective = this.elective.filter(elective => {
      const matchesSearch = this.searchTerm
        ? elective.elective_paper?.toLowerCase().includes(this.searchTerm.toLowerCase())
        : true;
  
      const matchesCourse = this.selectedCourse
        ? elective.course_id === this.selectedCourse
        : true;
  
      const matchesSemester = this.selectedSemester
        ? elective.semester_id === this.selectedSemester
        : true;
  
     
  
      return matchesSearch && matchesCourse && matchesSemester ;
    });
  }

  // Open the modal for adding a new elective
  // is_modal_add_open() {
  //   this.newpaper = { elective_paper: '' }; // Reset the form fields
  //   this.is_open = true; // Open the modal
  // }

  // Add a new elective
  async addelective() {
    // Validation: Check for empty or whitespace-only input
    if (!this.newpaper.elective_paper || this.newpaper.elective_paper.trim() === '') {
      this.utils.toast('Please fill in all required fields.');
      return;
    }

    try {
      const response = await this.us.addings(this.newpaper);
      if (response?.ok) {
        this.utils.toast('Elective added successfully!');
        await this.loadAllElective(); // Reload the elective list after adding
        this.resetForm(); // Reset form fields
        this.is_open = false; // Close the modal
      } else {
        this.utils.toast(` ${response?.msg || ' add elective.'}`);
        window.location.reload()
      }
    } catch (error) {
      console.error(' adding elective:', error);
      this.utils.toast(' adding elective. Please try again.');
    }
  }

  // Reset the form fields
  resetForm() {
    this.newpaper = { elective_paper: '' };
  }




  co:Course[]=[];
   
    async loading() {
      this.co = await this.us.course_all();
      console.log('Courses loaded:', this.co); // Log to check if courses are being set
    }
   
  
    sem:Semester[]=[];
    async loadings() {
      this.sem= await this.us.semester_all();
      console.log('Courses loaded:', this.sem); // Log to check if courses are being set
    }




    openUpdateModal(elective: Elective) {
      this.selectedElective = { ...elective };  // Clone elective data to avoid direct mutation
      this.is_open_edit = true;  // Show the modal
    }
  
    // Close the update modal
    closeUpdateModal() {
      this.is_open_edit = false;  // Close the modal
      this.selectedElective = {};  // Reset the selected elective data
    }
  
    // Update the elective
    async updateElective() {
      // Validate the input (check if elective name is provided)
      if (!this.selectedElective.elective_paper || this.selectedElective.elective_paper.trim() === '') {
        this.utils.toast('Please provide a valid elective paper name.');
        return;
      }
  
      try {
        const response = await this.us.updateElective(this.selectedElective);  // Call the update service method
        if (response?.ok) {
          this.utils.toast('Elective updated successfully!');
          await this.loadAllElective();  // Reload the electives list after update
          this.closeUpdateModal();  // Close the modal after successful update
        } else {
          this.utils.toast(' update elective.');
          window.location.reload()
        }
      } catch (error) {
        console.error('Error updating elective:', error);
        this.utils.toast('An error occurred while updating the elective.');
      }
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

  }
