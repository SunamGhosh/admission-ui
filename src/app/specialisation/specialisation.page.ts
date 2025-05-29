import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar } from '@ionic/angular/standalone';
import { IonicModule } from '@ionic/angular';  // Added IonicModule import
import { Course, Semester, Specialisation } from 'interface';
import { UserService } from '../services/user.service';
import { UtilsService } from '../services/utils.service';
@Component({
  selector: 'app-specialisation',
  templateUrl: './specialisation.page.html',
  styleUrls: ['./specialisation.page.scss'],
  standalone: true,
  imports: [ CommonModule, FormsModule,IonicModule]
})
export class SpecialisationPage implements OnInit {
  specialisation: Specialisation[] = []; // Array to hold all specialisations
  filteredspecialisation: Specialisation[] = []; // Array to hold filtered specialisations
  searchTerm: string = ''; // Search input value
  is_open: boolean = false; // Controls the modal visibility for adding
  is_open_edit: boolean = false; // Controls the modal visibility for editing

  // Initialize the new specialisation object
  newspecialisation: Specialisation = { specialisation_name: '' };
  selectedSpecialisation: Specialisation = { specialisation_name: '' }; // For updating a specialisation


  constructor(private us: UserService, private utils: UtilsService) {}

  ngOnInit() {
    this.loadAllspecialisation(); // Fetch all specialisations on initialization
    this.loading();
    this.loadings()
  }

  filter:any={
    course_id:0,
    semester_id:0,
    session_id:0,
    
  }
  // Load all specialisations from the server
  async loadAllspecialisation() {
    try {
      const response = await this.us.specialisation_all();
      if (response?.ok && Array.isArray(response?.data)) {
        this.specialisation = response.data;
        this.filteredspecialisation = [...this.specialisation]; // Initialize filtered list with all specialisations
        console.log('Loaded specialisations:', this.specialisation);
      } else {
        console.error('Unexpected response format:', response);
        this.specialisation = [];
        this.utils.toast('Failed to load specialisations. Please try again.');
      }
    } catch (error) {
      console.error('Error loading specialisations:', error);
      this.utils.toast('Error loading specialisations. Please check your network or try again.');
    }
  }
 
  selectedCourse: number | null = null;
  selectedSemester: number | null = null;
  
  // Function to filter specialisations based on search, course, and semester
  filterSpecialisation() {
    this.filteredspecialisation = this.specialisation.filter(specialisation => {
      const matchesSearch = this.searchTerm
        ? specialisation.specialisation_name?.toLowerCase().includes(this.searchTerm.toLowerCase())
        : true;
  
      const matchesCourse = this.selectedCourse
        ? specialisation.course_id === this.selectedCourse
        : true;
  
      const matchesSemester = this.selectedSemester
        ? specialisation.semester_id === this.selectedSemester
        : true;
  
      return matchesSearch && matchesCourse && matchesSemester;
    });
  }
  

  // Open the modal for adding a new specialisation
  is_modal_add_open() {
    this.newspecialisation = { specialisation_name: '' }; // Reset the form fields
    this.is_open = true; // Open the modal
  }

  // Add a new specialisation
  async addspecialisation() {
    // Validation: Check for empty or whitespace-only input
    if (!this.newspecialisation.specialisation_name || this.newspecialisation.specialisation_name.trim() === '') {
      this.utils.toast('Please fill in all required fields.');
      return;
    }

    try {
      const response = await this.us.addingss(this.newspecialisation);
      if (response?.ok) {
        this.utils.toast('Specialisation added successfully!');
        await this.loadAllspecialisation(); // Reload the specialisation list after adding
        this.resetForm(); // Reset form fields
        this.is_open = false; // Close the modal
      } else {
        this.utils.toast(` ${response?.msg || ' adding specialisation.'}`);
      }
    } catch (error) {
      console.error('Error adding specialisation:', error);
      this.utils.toast('Error adding specialisation. Please try again.');
    }
  }

  // Reset the form fields
  resetForm() {
    this.newspecialisation = { specialisation_name: '' };
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
 

  openUpdateModal(specialisation: Specialisation) {
    this.selectedSpecialisation = { ...specialisation }; // Clone the specialisation for editing
    this.is_open_edit = true; // Open the edit modal
  }


  async updateSpecialisation() {
    if (!this.selectedSpecialisation.specialisation_name!.trim()) {
      this.utils.toast('Please provide a valid specialisation name.');
      return;
    }

    try {
      const response = await this.us.updatespecialisation(this.selectedSpecialisation);
      if (response?.ok) {
        this.utils.toast('Specialisation updated successfully!');
        await this.loadAllspecialisation();
        this.is_open_edit = false;
      } else {
        this.utils.toast('update specialisation.');
        window.location.reload()
      }
    } catch (error) {
      this.utils.toast('An error occurred while updating the specialisation.');
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