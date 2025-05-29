import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class PinService {

//   private apiUrl = 'http://localhost:3000/api/pincodes'; // Change as per your backend

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
//     return fetch(`http://localhost:3000/api/pincodes/delete/${id}`, {
//       method: "DELETE",
//     }).then(response => response.json()); // ✅ JSON is already parsed here
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


private apiUrl = 'http://localhost:3000/api/pincodes'; 
private stateUrl = 'http://localhost:3000/api/states';  
private countryUrl = 'http://localhost:3000/api/countries';  

constructor() {}

// ✅ Fetch all Pincodes
async getPincodes() {
  const response = await fetch(`${this.apiUrl}/getall`);
  return response.json();
}

// ✅ Add new Pincode
async addPincode(pincode: any) {
  const response = await fetch(`${this.apiUrl}/add`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(pincode)
  });
  return response.json();
}

// ✅ Remove Pincode
async removePincode(id: number) {
  const response = await fetch(`${this.apiUrl}/delete/${id}`, {
    method: 'DELETE'
  });
  return response.json();
}

// ✅ Update Pincode
async updatePincode(id: number, pincode: any) {
  const response = await fetch(`${this.apiUrl}/edit/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(pincode)
  });
  return response.json();
}

// ✅ Fetch all States from MySQL
async getStates() {
  const response = await fetch(this.stateUrl);
  return response.json();
}

// ✅ Fetch all Countries from MySQL
async getCountries() {
  const response = await fetch(this.countryUrl);
  return response.json();
}
}