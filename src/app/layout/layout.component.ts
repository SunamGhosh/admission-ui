import { Component } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { UniversityService } from '../services/university.service';
import { Common } from 'interface';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss'],
  standalone: true,
  imports: [IonicModule, RouterModule, CommonModule],
})
export class LayoutComponent {
  universityName: string = ''; // Default to an empty string
  university: {
    university_name: string;
    short_name: string;
    start_year: string;
    end_year: string;
  } | null = null;


   user: Common | null = null; // Store user or admin data
    isAdminLoggedIn: boolean = false; // Flag to differentiate roles
    isStudent: boolean = false;  // Add this flag for students
    role: string = ''; // ✅ ADD THIS PROPERT

  constructor(private activatedRoute: ActivatedRoute, private universityService: UniversityService ,private router:Router// Inject UniversityService
  ) {}

  ngOnInit()
   {
    this.activatedRoute.url.subscribe(urlSegments => {
      // Extract university name from URL
      this.universityName = urlSegments[0]?.path || 'Kolhan University'; // Default fallback

     this.loadUserRole() 
    }
  
  
    )
    const userData = localStorage.getItem('user');
    const adminData = localStorage.getItem('admin');
    const agentData = localStorage.getItem('agent'); // Add this line


    if (userData) {
      this.user = JSON.parse(userData) as Common;
      this.isAdminLoggedIn = false; // It's a regular user
    } else if (adminData) {
      this.user = JSON.parse(adminData) as Common;
      this.isAdminLoggedIn = true; // It's an admin
      this.isStudent = this.user?.role === 'student'; // Check if user is student
    } else if (agentData) { // Handle agent login
      let agent = JSON.parse(agentData);
      this.user = {
        first_name: agent.agent_name, // Map agent_name to first_name
        last_name: '', // Agents might not have last_name, so keep it empty
        email: agent.email,
        DOB: agent.DOB || 'N/A', // Handle missing DOB
        father_name: agent.father_name || 'N/A',
        mother_name: agent.mother_name || 'N/A',
        mobile: agent.mobile || agent.phone || 'N/A', // Handle different mobile fields
        role: 'agent' // ✅ Add role for agents
      }}

    console.log('Logged-in User/Admin:', this.user); // Debugging purposes
  
  ;



//university


    const id = this.activatedRoute.snapshot.paramMap.get('id');

  if (id) {
    // Fetch the university data using the id
    this.fetchUniversityData(id);
  }

  }

  isAdmin: boolean = false;
  accessMatrix: any = {};

loadUserRole() {
  const userData = localStorage.getItem('user');
  this.role = localStorage.getItem('role') || '';
  const access = localStorage.getItem('access_matrix');
  this.accessMatrix = access ? JSON.parse(access) : {};

  if (userData) {
    this.user = JSON.parse(userData);
    this.isStudent = this.role === 'student';
    this.isAdmin = this.role === 'admin';
  }
}
hasAccess(moduleName: string): boolean {
  const role = this.role;
  return this.accessMatrix?.[role]?.[moduleName] ?? false;
}



 

  
  // university fetching

  

  
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




// Logout method to clear user/admin data and redirect to login
logout() {
  localStorage.removeItem('user'); // Clear user data
  localStorage.removeItem('admin'); // Clear admin data
  localStorage.removeItem('token'); // Clear token if stored
  // localStorage.clear();
  this.router.navigate(['/login']); // Redirect to login page
}

}
