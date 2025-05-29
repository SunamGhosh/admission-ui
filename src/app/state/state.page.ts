import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonText, IonGrid, IonRow, IonCol, IonButtons, IonBackButton, IonButton, IonIcon, IonModal, IonFooter, IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonItem, IonLabel } from '@ionic/angular/standalone';
import { Country, State } from 'interface';
import { UserService } from '../services/user.service';
import { UtilsService } from '../services/utils.service';
import {IonicModule } from '@ionic/angular';
import { ApiService } from '../services/api.service';

@Component({
  selector: 'app-state',
  templateUrl: './state.page.html',
  styleUrls: ['./state.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class StatePage implements OnInit {

  countries: any[] = [];
  users: State[] = []; // Array to hold all states
  filteredUsers: State[] = []; // Array to hold filtered results
  searchTerm: string = ''; // Search input value
  newState: State = { id:null,state_name: '', state_shortname: '',country_id:'' }; // Initialize new state
  is_open: boolean = false; // Modal visibility state

  constructor(
    private us: UserService,
    private utils: UtilsService,private api:ApiService
  ) {}

  ngOnInit() {
    this.loadAllUsers(); // Fetch all states on initialization
    this.loadCountries()
    this.getNextStateId()
  }

  async getNextStateId() {
    try {
        const response = await this.api.post('/state/next-id', {});
        console.log("API Response:", response);
  
        if (response && response.ok && response.nextId) {
            this.newState = { ...this.newState, id: response.nextId }; // Ensuring immutability
        } else {
            console.error('Error fetching next ID:', response?.msg || 'Invalid response');
            this.utils.toast('Failed to fetch the next ID.');
        }
    } catch (error) {
        console.error('Error:', error);
        this.utils.toast('An error occurred while fetching the next ID.');
    }
  }
  

   co:Country[]=[];
   async loadCountries() {
    const response = await this.us.country_all();
    if (response?.ok) {
      this.countries = response.data; // Ensure you access .data
      console.log('Countries loaded:', this.countries);
    } else {
      console.error('Failed to load countries:', response);
    }
  }
  
  /**
   * Fetches all states and initializes user list
   */
  async loadAllUsers() {
    try {
      const response = await this.us.state_all(); // Service call to fetch all states
      if (response.ok && Array.isArray(response.data)) {
        this.users = response.data;
        this.filteredUsers = [...this.users]; // Initialize filtered list with all users
      } else {
        console.error('Unexpected response format:', response);
        this.users = [];
        this.utils.toast('Failed to load users.');
      }
    } catch (error) {
      console.error('Error loading users:', error);
      this.utils.toast('Error loading users.');
      this.users = [];
    }
  }

  /**
   * Filters users based on the search term
   */
  filterUsers() {
    const searchTermLower = this.searchTerm.toLowerCase();
    this.filteredUsers = this.users.filter(user =>
      user.state_name?.toLowerCase().includes(searchTermLower)
    );
  }

  /**
   * Opens the modal and resets form fields
   */
  openModal() {
    this.resetForm();
    this.is_open = true;
  }

  /**
   * Closes the modal
   */
  closeModal() {
    this.is_open = false;
  }

  /**
   * Handles form submission for adding a new state
   */
  async addState() {
    if (!this.newState.state_name || !this.newState.state_shortname) {
      this.utils.toast('Please fill in both state name and short name.');
      return;
    }

    try {
      const response = await this.us.addedState(this.newState); // Service call to add state
      if (response.ok) {
        this.utils.toast('State added successfully!');
        this.loadAllUsers(); // Reload the state list
        this.closeModal(); // Close the modal after adding
      } else {
        this.utils.toast('Error adding state.');
      }
    } catch (error) {
      console.error('Error adding state:', error);
      this.utils.toast('Error adding state. Please try again.');
    }
  }

  /**
   * Resets the form fields
   */
  resetForm() {
    this.newState = { state_name: '', state_shortname: '',country_id:'' };
  }






  getCountryName(countryId: number): string {
    const country = this.countries.find(c => c.id === countryId);
    return country ? country.country_name : "N/A";
  }
  
}