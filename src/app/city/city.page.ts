import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar } from '@ionic/angular/standalone';
import { ApiService } from '../services/api.service';
import{IonicModule} from '@ionic/angular'
@Component({
  selector: 'app-city',
  templateUrl: './city.page.html',
  styleUrls: ['./city.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class CityPage implements OnInit {
  countries: any[] = [];
  states: any[] = []; // Holds all states
  cities: any[] = []; // Holds cities for the selected state
  cityData: any[] = []; // Holds all cities for the table

  newCity = {
    id:null,
    country_id: null,
    state_id: '', // Selected state ID
    city_name: '' // New city name and page rc and page also
  };


  constructor(private api: ApiService) {}

  ngOnInit() {
    
    

    this.loadCountries(); // Load all countries on page load
    this.loadAllStates()
    this.loadAllCities();
    this.filteredCityData = [...this.cityData]; // Initialize filtered data
    this.getNextId()
  }

  allStates: any[] = []; // Store all states permanently
  async getNextId() {
    try {
      const response = await this.api.post('/city/next-id', {});
      if (response.ok) {
        this.newCity.id = response.nextId;
      } else {
        console.error('Error fetching next ID:', response.msg);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  }
async loadAllStates() {
  try {
    const response = await this.api.post("/state/getall", {}); // Fetch all states
    if (response.ok) {
      this.allStates = response.data; // Store all states
    }
  } catch (error) {
    console.error("Error fetching states:", error);
  }
}

// Updated getStateName() function to search in allStates instead of states



  async loadCountries() {
    try {
      const response = await this.api.post("/country/getall", {});
      if (response.ok) {
        this.countries = response.data;
      }
    } catch (error) {
      console.error("Error fetching countries:", error);
    }
  }

  // Load states when country is selected
  async getStateByCountry() {
    if (!this.newCity.country_id) return;
    
    try {
      const response = await this.api.post("/state/getByCountry", { country_id: this.newCity.country_id });
      if (response.ok) {
        this.states = response.data;
      }
    } catch (error) {
      console.error("Error fetching states:", error);
    }
  }


  page = 1;  // Current page
pageSize = 12 // Number of records per page
fullCityData = []; // All cities from API

async loadAllCities() {
  try {
    const response = await this.api.post("/city/getall", {});
    if (response.ok) {
      this.fullCityData = response.data;
      this.updateCityData(); // Load first page
    }
  } catch (error) {
    console.error("Error loading cities:", error);
  }
}

// Update the displayed cities based on the page number
updateCityData() {
  if (!this.fullCityData || this.fullCityData.length === 0) {
    this.cityData = [];
    return;
  }

  const start = (this.page - 1) * this.pageSize;
  const end = start + this.pageSize;

  // ✅ Ensure we always take from fullCityData
  this.cityData = [...this.fullCityData].slice(start, end);
}


// Go to next page
nextPage() {
  if ((this.page * this.pageSize) < this.fullCityData.length) {
    this.page++;
    this.updateCityData();
  }
}

// Go to previous page
prevPage() {
  if (this.page > 1) {
    this.page--;
    this.updateCityData();
  }
}
getTotalPages(): number {
  return Math.ceil(this.fullCityData.length / this.pageSize);
}


  // Get cities based on selected state
  async fetchCities(state_id: any) {
    this.cities = []; // Reset cities list
    this.newCity.city_name = ''; // Reset selected city

    if (!state_id) return;

    try {
      const response = await this.api.post("/city/get_by_state", { state_id });
      if (response.ok) {
        this.cities = response.data;
      } else {
        console.error("Failed to load cities");
      }
    } catch (error) {
      console.error("Error fetching cities:", error);
    }
  }

  // Add a new city
  async addCity() {
    if (!this.newCity.state_id || !this.newCity.city_name.trim()) {
      alert("Please select a state and enter a city name.");
      return;
    }

    try {
      const response = await this.api.post("/city/add", this.newCity);
      if (response.ok) {
        alert("City added successfully!");
        this.loadAllCities(); // Refresh table
        this.newCity.city_name = ''; // Reset input
      } else {
        alert("added city.");
        window.location.reload()
      }
    } catch (error) {
      console.error("Error adding city:", error);
    }
  }

// Updated getStateName() function to search in allStates instead of states
getStateName(stateId: number): string {
  const state = this.allStates.find(s => s.id === stateId);
  return state ? state.state_name : "N/A";
}





  searchText: string = "";
filteredCityData: any[] = [];



filterCities() {
  this.filteredCityData = this.cityData.filter(city =>
    city.city_name.toLowerCase().includes(this.searchText.toLowerCase())
  );
}
}


