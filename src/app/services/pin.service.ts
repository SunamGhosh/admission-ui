import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class PinService {

//   private apiUrl = 'https://admission-api-suyk.onrender.com/api/pincodes'; // Change as per your backend

//   constructor() {}

//   // Fetch all Pincodes
//   async getPincodes() {
//     const response = await fetch(`${this.apiUrl}/getall`);
//     return response.json();
//   }

//   // Add new Pincode
//   async addPincode(pincode: any) {
//     const response = await fetch(`${this.apiUrl}/add`, {
//       method: 'POST',
//       headers: { 'Content-Type': 'application/json' },
//       body: JSON.stringify(pincode)
//     });
//     return response.json();
//   }

//   removePincode(id: number): Promise<any> {
//     return fetch(`https://admission-api-suyk.onrender.com/api/pincodes/delete/${id}`, {
//       method: "DELETE",
//     }).then(response => response.json()); // âœ… JSON is already parsed here
//   }


//   async updatePincode(id: number, pincode: any) {
//     const response = await fetch(`${this.apiUrl}/edit/${id}`, {
//       method: 'PUT',
//       headers: { 'Content-Type': 'application/json' },
//       body: JSON.stringify(pincode)
//     });
//     return response.json();
//   }
  
// }  


private apiUrl = 'https://admission-api-suyk.onrender.com/api/pincodes'; 
private stateUrl = 'https://admission-api-suyk.onrender.com/api/states';  
private countryUrl = 'https://admission-api-suyk.onrender.com/api/countries';  

constructor() {}

// âœ… Fetch all Pincodes
async getPincodes() {
  const response = await fetch(`${this.apiUrl}/getall`);
  return response.json();
}

// âœ… Add new Pincode
async addPincode(pincode: any) {
  const response = await fetch(`${this.apiUrl}/add`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(pincode)
  });
  return response.json();
}

// âœ… Remove Pincode
async removePincode(id: number) {
  const response = await fetch(`${this.apiUrl}/delete/${id}`, {
    method: 'DELETE'
  });
  return response.json();
}

// âœ… Update Pincode
async updatePincode(id: number, pincode: any) {
  const response = await fetch(`${this.apiUrl}/edit/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(pincode)
  });
  return response.json();
}

// âœ… Fetch all States from MySQL
async getStates() {
  const response = await fetch(this.stateUrl);
  return response.json();
}

// âœ… Fetch all Countries from MySQL
async getCountries() {
  const response = await fetch(this.countryUrl);
  return response.json();
}
}
