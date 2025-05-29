import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {IonicModule } from '@ionic/angular';
import { Semester, Session, User } from 'interface';

import { Course } from 'interface'; // Ensure this interface is defined properly
import { UserService } from '../services/user.service';
import { UtilsService } from '../services/utils.service';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { UniversityService } from '../services/university.service';

@Component({
  selector: 'app-course',
  templateUrl: './course.page.html',
  styleUrls: ['./course.page.scss'],
  standalone: true,
  imports: [
    ReactiveFormsModule,
    IonicModule,
    CommonModule, 
    FormsModule,RouterModule
  ]
})
export class CoursePage implements OnInit {
  courses: Course[] = []; // Array to hold all courses
  filteredCourses: Course[] = []; // Array to hold filtered courses (optional)
    selectedCourse: Course ={} // Track the user being updated

  searchTerm: string = ''; // Search term for filtering courses
  newCourse: Course = { 
    course_name: '', 
    course_shortname: '', 
    course_start_session: '', 
    course_end_session: '', 
    course_current: false, 
    course_in_use: false,
    session_id: 0,      // Assign null or 0 to prevent syntax errors
    semester_id: 0
  };

  filter:any={
    course_id:0,
    semester_id:0,
    session_id:0,
    
  }
  isAddCourseModalOpen: boolean = false;
  isEditCourseModalOpen: boolean = false;
  constructor(
    private us: UserService, // Service to fetch data
    private utils: UtilsService, // Service for toast notifications
     private router: Router,
        private universityService: UniversityService,
         private activatedRoute: ActivatedRoute, // To get route parameters
           
  ) {}

  ngOnInit() {
    this.loadAllCourses(); // Load courses when the component initializes
    this.loadUniversities();
    this.loaders();
    this.loader();

    // university fetch
  // Retrieve the university id from the URL parameters
  const id = this.activatedRoute.snapshot.paramMap.get('id');

  if (id) {
    // Fetch the university data using the id
    this.fetchUniversityData(id);
  
  }
  }

  /**
   * Loads all courses from the UserService
   */
  async loadAllCourses() {
    try {
      // Fetch courses from the service
      const response = await this.us.course_all();
      console.log('API Response:', response); // Debug: Check raw response from the API

      if (response && Array.isArray(response)) {
        this.courses = response; // Assign fetched data to courses
        this.filteredCourses = [...this.courses]; // Initialize filtered courses
        console.log('Courses loaded:', this.courses); // Debug: Check the loaded courses
      } else {
        console.error('Unexpected response format:', response);
        this.courses = []; // Handle unexpected response format
        this.utils.toast('Failed to load courses. Please try again.');
      }
    } catch (error) {
      console.error('Error loading courses:', error);
      this.utils.toast('Error loading courses. Please try again later.');
      this.courses = []; // Gracefully handle errors
    }
  }

  selectedSession:Session={}
  selectedSemester:Semester={}

  /**
   * Filters courses based on the search term entered
   */
  filterCourses() {
    if (!this.searchTerm && !this.selectedSession && !this.selectedSemester) {
      // If no search term and no filters, show all courses
      this.filteredCourses = [...this.courses];
      return;
    }
  
    this.filteredCourses = this.courses.filter(course => {
      const matchesSearch = this.searchTerm
        ? course.course_name?.toLowerCase().includes(this.searchTerm.toLowerCase())
        : true;
  
      const matchesSession = this.selectedSession
        ? course.session_id === this.selectedSession
        : true;
  
      const matchesSemester = this.selectedSemester
        ? course.semester_id === this.selectedSemester
        : true;
  
      return matchesSearch && matchesSession && matchesSemester;
    });
  }
  
  

  async addCourse() {
    // Validate inputs
    if (!this.newCourse.course_name || 
        !this.newCourse.course_shortname) {
      this.utils.toast('Please fill in all the required fields.');
      return;
    }
  
    try {
      // Call the API method to add the course
      const response = await this.us.addedCourse(this.newCourse); // Assuming 'addCourse' is the method in CourseService
      if (response.ok) {
        this.utils.toast('Course added successfully!');
        this.loadAllCourses(); // Reload the course list after adding
        this.resetForm(); // Reset form fields
      } else {
        this.utils.toast(response.msg || 'Error adding course.');
      }
    } catch (error) {
      console.error('Error adding course:', error);
      this.utils.toast('Error adding course. Please try again.');
    }
  }
  isCourseModalOpen: boolean = false;
  // Function to toggle modal visibility
isCourseOpen() {
  this.isCourseModalOpen = !this.isCourseModalOpen;
}

  
  // Function to reset form fields
  resetForm() {
    this.newCourse = {
      course_name: '',
      course_shortname: '',
      course_start_session: '',
      course_end_session: '',
      course_current: false,
      course_in_use: false
    };
  }

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





  
  async loader(){
    this.st= await this.us.session_all()
  }

  

 
  async loaders(){
    this.sem= await this.us.semester_all()
  }


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



  is_open_edit: boolean = false; // State for edit modal
  selectedCourses: Partial<Course> = {}; // Selected course for editing
  
  /**
   * Open modal for adding a course.
   * This resets the selected course data for a fresh start.
   */
  async is_modal_open() {
    this.selectedCourse = {
      course_name: '',
      course_shortname: '',
    }; // Clear selected course fields
    this.is_open_edit = true; // Open the edit modal
  }
  
  /**
   * Open the modal for editing a specific course.
   * Clones the course to avoid directly modifying the list.
   */
  async openCourseModal(course: Course) {
    this.selectedCourse = { ...course }; // Clone the course for editing
    this.is_open_edit = true; // Open the edit modal
  }
  
  /**
   * Close both modals and reset selected course data.
   */
  closeCourseModal() {
    this.is_open_edit = false; // Close the edit modal
    this.selectedCourse = {}; // Reset selected course data
  }


   async editCourse(course:Course) {
      this.selectedCourse = { ...course }; // Clone user to avoid directly modifying the list
      this.is_open_edit = true; // Open modal for editing
    }
  
  /**
   * Update the selected course using the update service.
   */
  async updateCourse() {
    if (!this.selectedCourse || !this.selectedCourse.course_name || !this.selectedCourse.course_shortname) {
      this.utils.toast('Course name and short name are required.');
      return;
    }
  
    try {
      // Call the update service method
      const response = await this.us.updateCourse(this.selectedCourse);
  
      if (response?.ok) {
        this.utils.toast('Course updated successfully!');
        this.loadAllCourses(); // Reload the courses list
        this.is_open_edit = false; // Close the modal
        this.selectedCourse = {}; // Reset the selected course
      } else {
        this.utils.toast(response?.msg || 'Failed to update course.');
      }
    } catch (error) {
      console.error('Error updating course:', error);
      this.utils.toast('Error updating course. Please try again.');
    }
  }
  

  university: {
    university_name: string;
    short_name: string;
    start_year: string;
    end_year: string;
  } | null = null;



  

async fetchUniversityData(id: string) {
  try {
    // Call the service to get university data by ID
    const response = await this.universityService.getById(id);

    if (response && response.ok && response.data) {
      this.university = response.data; // Assign data to the university object
    } else {
      console.error('Failed to fetch university:', response?.msg || 'Unknown error');
      this.university = null; // Clear university object if fetch fails
    }
  } catch (error) {
    console.error('Error fetching university:', error);
    this.university = null; // Clear university object in case of error
  }
}



st:Session[]=[];

// get coursename using id
getSessionName(sessionId: number): string {
  const session = this.st.find(c => c.id === sessionId);
  return session?.session_name ?? 'N/A'; // Use optional chaining and nullish coalescing
}



sem: Semester[]=[];

// get semester name by id
getsemesterName(semesterId: number): string {
  const semester = this.sem.find(s => s.id === semesterId);
  return semester?.semester_name ?? 'N/A'; // Use optional chaining and nullish coalescing
}

}



