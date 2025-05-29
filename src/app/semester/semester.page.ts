import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { 
  IonContent, 
  IonHeader, 
  IonTitle, 
  IonToolbar, 
  IonFooter, 
  IonList, 
  IonItem, 
  IonLabel, 
  IonSearchbar, IonGrid, IonRow, IonCol, IonButtons, IonBackButton, IonCard, IonCardHeader, IonCardTitle, IonCardContent } from '@ionic/angular/standalone';
import { UserService } from '../services/user.service';
import { UtilsService } from '../services/utils.service';

@Component({
  selector: 'app-semester',
  templateUrl: './semester.page.html',
  styleUrls: ['./semester.page.scss'],
  standalone: true,
  imports: [IonCardContent, IonCardTitle, IonCardHeader, IonCard, IonBackButton, IonButtons, IonCol, IonRow, IonGrid, IonSearchbar, IonLabel, IonItem, IonList, IonFooter, IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule]
})
export class SemesterPage implements OnInit {
  semesters: any[] = []; // Array to hold all semesters
  filteredSemesters: any[] = []; // Array to hold filtered semesters
  searchTerm: string = ''; // Search term for filtering semesters

  constructor(
    private us: UserService,
    private utils: UtilsService
  ) {}

  ngOnInit() {
    this.loadAllSemesters(); // Load semesters when the component initializes
  }

  async loadAllSemesters() {
    try {
      const response = await this.us.semester_all(); // Fetch all semesters from the service
      console.log('Response:', response); // Log the response to verify the structure
      if (Array.isArray(response)) { // Check if the response is an array directly
        this.semesters = response; // Set the semesters array directly to the response
        this.filteredSemesters = [...this.semesters]; // Initialize the filtered list with all semesters
        console.log('Semesters loaded:', this.semesters); // Log the loaded semesters
      } else {
        console.error('Unexpected response format:', response);
        this.semesters = [];
        this.filteredSemesters = [];
      }
    } catch (error) {
      console.error('Error loading semesters:', error); // Log any errors
      this.utils.toast('Error loading semesters. Please try again later.'); // Show an error message
      this.semesters = [];
      this.filteredSemesters = [];
    }
  }

  // Filter semesters based on search term
  filterSemesters() {
    if (!this.searchTerm.trim()) {
      this.filteredSemesters = [...this.semesters]; // If search term is empty, show all semesters
    } else {
      this.filteredSemesters = this.semesters.filter(semester =>
        semester.semester_name?.toLowerCase().includes(this.searchTerm.toLowerCase()) // Case-insensitive filtering
      );
    }
  }
}
