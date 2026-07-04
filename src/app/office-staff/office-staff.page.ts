import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar } from '@ionic/angular/standalone';
import {IonicModule} from '@ionic/angular'
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Office } from 'interface';
import { ApiService } from '../services/api.service';
import { UtilsService } from '../services/utils.service';

@Component({
  selector: 'app-office-staff',
  templateUrl: './office-staff.page.html',
  styleUrls: ['./office-staff.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, ReactiveFormsModule]
})
export class OfficeStaffPage implements OnInit {
  officeForm: FormGroup;
  officeStaffList: any[] = [];

  constructor(private api: ApiService, private fb: FormBuilder,private utils:UtilsService) {
    this.officeForm = this.fb.group({
      id: [{ value: '', disabled: true }],  // âœ… Add this line
        first_name: ['', [Validators.required, Validators.minLength(2)]],
        last_name: ['', [Validators.required, Validators.minLength(2)]],
        email: ['', [Validators.required, Validators.email]], // âœ… Fix Email Validation
        mobile: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]], // âœ… Exactly 10 digits
        DOB: [null], 
        aadhar_no: ['', [Validators.required, Validators.pattern('^[0-9]{12}$')]], // âœ… Exactly 12 digits
        password: ['', [Validators.required, Validators.minLength(6)]],
        father_name: ['', Validators.required],
        mother_name: ['', Validators.required]
      });
      
    ;
  }

  ngOnInit() {
    this.getOfficeStaff();
    this.getNextId()
   

  }

  async getOfficeStaff() {
    try {
      const response: any = await this.api.post('/office/getall', {});
      if (response.ok) {
        this.officeStaffList = response.data;
      }
    } catch (error) {
      console.error('Error fetching office staff:', error);
    }
  }

  async addOfficeStaff() {
    if (this.officeForm.invalid) {
      this.markFormFieldsAsTouched(); // Ensure all fields show errors
      alert('Please fill all required fields correctly.');
      console.log('Form Data:', this.officeForm.value);
      console.log('added:', this.officeForm.errors);
      return;
    }
  
    try {
      const response: any = await this.api.post('/office/add', this.officeForm.value);
      window.location.reload()
      if (response.ok) {
        alert('Office staff added successfully!');
        this.officeForm.reset();
        this.officeForm.markAsPristine();
        this.officeForm.markAsUntouched();
        this.getOfficeStaff();
      } else {
        alert("added");
      }
    } catch (error) {
      console.error('adding office staff:', error);
    }
  }
  
  markFormFieldsAsTouched() {
    Object.values(this.officeForm.controls).forEach(control => {
      control.markAsTouched();
      control.updateValueAndValidity();
    });
  }

  async getNextId() {
    try {
      const response = await this.api.post('/office/next-id', {});
      console.log('API Response:', response); // Debugging
  
      if (response.ok && response.nextId) {
        this.officeForm.patchValue({ id: response.nextId }); // âœ… Correctly update form
        this.officeForm.updateValueAndValidity(); // âœ… Force Angular to detect changes
      } else {
        console.error('Error fetching next ID:', response.msg);
        this.utils.toast('Failed to fetch the next ID.');
      }
    } catch (error) {
      console.error('Error:', error);
      this.utils.toast('An error occurred while fetching the next ID.');
    }
  }
  
 
  filteredStaffList: any[] = []; // Filtered list used for display
  
  searchTermName: string = '';
  searchTermEmail: string = '';
  searchTermMobile: string = '';
  
  filterStaff() {
    this.filteredStaffList = this.officeStaffList.filter(staff => {
      return (
        (!this.searchTermName || 
          (staff.first_name + ' ' + staff.last_name).toLowerCase().includes(this.searchTermName.toLowerCase())) &&
        (!this.searchTermEmail || staff.email.toLowerCase().includes(this.searchTermEmail.toLowerCase())) &&
        (!this.searchTermMobile || staff.mobile.includes(this.searchTermMobile))
      );
    });
  }
  
  async downloadOfficeExcel(): Promise<void> {
    try {
      const token = localStorage.getItem("token");

      // API request to download Office Staff Excel
      const response = await fetch("https://admission-api-suyk.onrender.com/office/excel", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { "Authorization": `Bearer ${token}` } : {}),
        },
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to download Excel: ${errorText}`);
      }

      const blob: Blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `office_staff.xlsx`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error downloading Office Staff Excel:", error);
    }
  }
}
