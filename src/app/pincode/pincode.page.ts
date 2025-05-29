import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar } from '@ionic/angular/standalone';
import { IonicModule } from '@ionic/angular';  // Added IonicModule import
import { PinService } from '../services/pin.service';
import { city, Country, State } from 'interface';
import { UserService } from '../services/user.service';
import { ApiService } from '../services/api.service';


@Component({
  selector: 'app-pincode',
  templateUrl: './pincode.page.html',
  styleUrls: ['./pincode.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class PincodePage implements OnInit {

  constructor(private  pincodeService: PinService, private cdr: ChangeDetectorRef,private us:UserService,
    private api:ApiService
  ) { }

  


  pincodeData: any[] = [];

  newPincode = {
    
    pin: '',
    locality: '',
    area: '',
    state: 'Jharkhand',
    country: 'India',
    city_name:''
  };

 
  ngOnInit() {
    this.loadPincodes();
    this.loadinger()
  //  this.fetchCities(this.newCity.state_id)
  this.loadAllCities()
  }

  async loadPincodes() {
    const response = await this.pincodeService.getPincodes();
    if (response.ok) {
      this.pincodeData = response.data;
    }
  }

  async addPincode() {
    if (this.newPincode.pin && this.newPincode.locality && this.newPincode.area) {
      const response = await this.pincodeService.addPincode(this.newPincode);
      if (response.ok) {
        this.pincodeData.push(response.data);
        this.newPincode = { pin: '', locality: '', area: '', state: '', country: '',city_name:'' };
        alert("Pincode Added Successfully!");
      }
    } else {
      alert("Please enter Pincode, Location, and Area.");
    }
  }
  async removePincode(id: number) {
    const result = await this.pincodeService.removePincode(id);  // ✅ Directly get parsed JSON
  
    if (result.ok) {
      this.pincodeData = this.pincodeData.filter(pincode => pincode.id !== id);
      this.pincodeData = [...this.pincodeData];  // Ensures UI update
      this.cdr.detectChanges();  
    }
  }






st:State[]=[]
async loadinger() {
  const response = await this.us.state_all();  
  if (response.ok) {  // Ensure the response is successful
    this.st = response.data;  // Extract the array from the response
  } else {
    console.error("Failed to load states");
    this.st = [];  // Prevents errors
  }
  console.log('States loaded:', this.st);
}



coun:Country[]=[]
async loadingers() {
  const response = await this.us.country_all();  
  if (response.ok) {  // Ensure the response is successful
    this.st = response.data;  // Extract the array from the response
  } else {
    console.error("Failed to load states");
    this.st = [];  // Prevents errors
  }
  console.log('country loaded:', this.st);
}



  isEditModalOpen = false;  // Track modal visibility
  editPincodeData: { id: number | null; pin: string; locality: string; area: string } = {
    id: null,
    pin: "",
    locality: "",
    area: ""
  };
  


  openEditModal(pincode: any) {
    this.editPincodeData = { ...pincode };
    this.isEditModalOpen = true;
  }
  
  closeEditModal() {
    this.isEditModalOpen = false;
  }
  
  
  // Update Pincode
  async updatePincode() {
    if (this.editPincodeData.id === null) {
      console.error("Error: ID is null, cannot update pincode");
      return;
    }
  
    try {
      const response = await this.pincodeService.updatePincode(
        this.editPincodeData.id,
        this.editPincodeData
      );
  
      if (response.ok) {
        // Update UI instantly
        this.pincodeData = this.pincodeData.map(p =>
          p.id === this.editPincodeData.id ? { ...p, ...this.editPincodeData } : p
        );
        this.closeEditModal();
      } else {
        console.error("Update failed:", response.msg);
      }
    } catch (error) {
      console.error("Error updating pincode:", error);
    }
  }





// get coursename using id
getStateName(stateId: number): string {
  const state = this.st.find(c => c.id === stateId);
  return state?.state_name ?? 'N/A'; // Use optional chaining and nullish coalescing
}
allCities: any[] = []; // Store all cities permanently

async loadAllCities() {
  try {
    const response = await this.api.post("/city/getall", {}); // Fetch all cities
    if (response.ok) {
      this.allCities = response.data; // Store all cities permanently
    }
  } catch (error) {
    console.error("Error fetching cities:", error);
  }
}

// Updated function to get city name from `allCities`
getCityNameq(cityId: number): string {
  const city = this.allCities.find(c => c.id === cityId);
  return city ? city.city_name : "N/A";
}




  cities: any[] = [];  // ✅ Holds cities based on selected state
  // city poart
  newCity = {
    state_id: '',   // ✅ State ID for adding city
    city_name: ''   // ✅ City name
  };

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

  



  
  
}  