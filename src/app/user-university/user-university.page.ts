import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { UniversityService } from '../services/university.service';
import { UtilsService } from '../services/utils.service';

@Component({
  selector: 'app-user-university',
  templateUrl: './user-university.page.html',
  styleUrls: ['./user-university.page.scss'],
  standalone: true,
  imports: [IonicModule,RouterModule, CommonModule, FormsModule]
})
export class UserUniversityPage implements OnInit {
 user: { first_name: string } | null = null; // Admin details
  universities: {
    id: number;
    university_name: string;
    short_name: string;
    image: string;
    link: string;
  }[] = [];
  showForm = false; // To toggle the add university form
  newUniversity = { university_name: '', short_name: '' }; // New university details

  constructor(
    private router: Router,
    private universityService: UniversityService,
    private cdr: ChangeDetectorRef,
    private utils: UtilsService
  ) {}

  ngOnInit() {
    // Load admin details from local storage
    const userData = localStorage.getItem('user');
    if (userData) {
      this.user = JSON.parse(userData);
    }

    // Load the list of universities
    this.loadUniversities();
  }

  toggleForm() {
    this.showForm = !this.showForm; // Toggle the form visibility
  }

  // Load all universities
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
          link: `/kolhan-university/${u.id}`, // Pass the actual ID in the link
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

  // Add a new university
  async addUniversity() {
    if (!this.newUniversity.university_name || !this.newUniversity.short_name) {
      alert('Please fill all the fields.');
      return;
    }

    try {
      const response = await this.universityService.add(
        this.newUniversity.university_name,
        this.newUniversity.short_name
      );

      if (response.ok) {
        alert('University added successfully!');
        this.newUniversity = { university_name: '', short_name: '' }; // Clear form
        this.loadUniversities(); // Refresh the list of universities
      } else {
        alert(response.msg || ' added university.');
      }
    } catch (error) {
      console.error('Error adding university:', error);
    }
  }

  // Navigate to the university details page
  viewUniversity(shortName: string) {
    this.router.navigate(['/university', shortName]); // Navigate using the short name
  }}
