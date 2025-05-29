import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

import { UserService } from '../services/user.service';
import { UtilsService } from '../services/utils.service';
import { Country } from 'interface';
import { ApiService } from '../services/api.service';

@Component({
  selector: 'app-country',
  templateUrl: './country.page.html',
  styleUrls: ['./country.page.scss'],
  standalone: true,
  imports: [
    IonicModule, // Includes all necessary Ionic components
    CommonModule,
    FormsModule,
   
  ],
})
export class CountryPage implements OnInit {
  users: Country[] = []; // Array to store all country data
  filteredCountries: Country[] = []; // Stores searched countries
  countryData: Country[] = []; // Stores paginated data
  searchTerm: string = ''; // Search input value
  newCountry: Country = { country_name: '', country_shortname: '' }; // New country model



  page: number = 1; // Current Page
  pageSize: number = 10; // Number of records per page
  totalPages: number = 0; // Total number of pages


  constructor(
    private us: UserService, // Service to fetch user data
    private utils: UtilsService, // Utility service for displaying toasts and other utils
    private api:ApiService
  ) {}

  ngOnInit(): void {
    this.loadAllCountries(); // Load countries when the component is initialized
    this.getNextCountryId(); // Fetch the next country ID
    
  }

  /**
   * Fetches all countries from the server and handles the response.
   */
  async getNextCountryId() {
    try {
      const response = await this.api.post('/country/next-id', {});
      console.log("API Response:", response);

      if (response && response.ok && response.nextId) {
        this.newCountry.id = response.nextId; // Ensure ID is set
      } else {
        console.error('Error fetching next ID:', response?.msg || 'Invalid response');
        this.utils.toast('Failed to fetch the next ID.');
      }
    } catch (error) {
      console.error('Error:', error);
      this.utils.toast('An error occurred while fetching the next ID.');
    }
}


   /** Add a New Country */
   async addCountry() {
    if (!this.newCountry.country_name || !this.newCountry.country_shortname) {
      this.utils.toast('Country Name & Short Name are required');
      return;
    }

    try {
      const response = await this.us.addedCountry(this.newCountry);
      if (response.ok) {
        this.utils.toast('Country added successfully');
        this.newCountry = { country_name: '', country_shortname: '' }; // Reset form
        this.loadAllCountries(); // Refresh the country list
      } else {
        this.utils.toast('Failed to add country');
      }
    } catch (error) {
      console.error('Error adding country:', error);
      this.utils.toast('Error adding country');
    }
  }

// rc page part
async loadAllCountries() {
  try {
    const response = await this.us.country_all();
    if (response.ok && Array.isArray(response.data)) {
      this.users = response.data;
      this.filteredCountries = [...this.users];
      this.calculateTotalPages();
      this.updateCountryData();
    }
  } catch (error) {
    console.error('Error fetching countries:', error);
  }
}

/** Update displayed data based on page number */
updateCountryData() {
  const start = (this.page - 1) * this.pageSize;
  const end = start + this.pageSize;
  this.countryData = this.filteredCountries.slice(start, end);
}

/** Calculate total pages */
calculateTotalPages() {
  this.totalPages = Math.ceil(this.filteredCountries.length / this.pageSize);
}

/** Handle search and update pagination */
filterCountries() {
  this.filteredCountries = this.users.filter(user =>
    user.country_name?.toLowerCase().includes(this.searchTerm.toLowerCase())
  );
  this.page = 1; // Reset to first page after search
  this.calculateTotalPages();
  this.updateCountryData();
}

/** Next Page */
nextPage() {
  if (this.page < this.totalPages) {
    this.page++;
    this.updateCountryData();
  }
}

/** Previous Page */
prevPage() {
  if (this.page > 1) {
    this.page--;
    this.updateCountryData();
  }
}
}



