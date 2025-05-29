import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UniversityService } from '../services/university.service';
import { IonicModule } from '@ionic/angular'; // For Ionic components
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Course, Semester, Session } from 'interface';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-kolhan-university',
  templateUrl: './kolhan-university.page.html',
  styleUrls: ['./kolhan-university.page.scss'],
  standalone: true,
  imports: [FormsModule, CommonModule, IonicModule],
})
export class KolhanUniversityPage implements OnInit {
  university: {
    university_name: string;
    short_name: string;
    start_year: string;
    end_year: string;
  } | null = null;

  constructor(
    private activatedRoute: ActivatedRoute, // To get route parameters
    private universityService: UniversityService, // Inject UniversityService

  ) {}

  ngOnInit() {
    
    // Retrieve the university id from the URL parameters
    const id = this.activatedRoute.snapshot.paramMap.get('id');

    if (id) {
      // Fetch the university data using the id
      this.fetchUniversityData(id);
      localStorage.setItem("university_id",id)
    }
  }

  
  /**
   * Fetch university data based on the given ID
   * @param id The ID of the university
   */
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




  
}
