import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { Common } from 'interface';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class DashboardPage implements OnInit {
  user: Common | null = null; // Store user or admin data
  isAdminLoggedIn: boolean = false; // Flag to differentiate roles

  constructor(private router: Router) {}

  ngOnInit() {
    // Retrieve user or admin data from local storage
    const userData = localStorage.getItem('user');
    const adminData = localStorage.getItem('admin');
    const agentData = localStorage.getItem('agent'); // Add this line

    if (userData) {
      this.user = JSON.parse(userData) as Common;
      this.isAdminLoggedIn = false; // It's a regular user
    } else if (adminData) {
      this.user = JSON.parse(adminData) as Common;
      this.isAdminLoggedIn = true; // It's an admin
    }  else if (agentData) { // Handle agent login
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
  }

  // Logout method to clear user/admin data and redirect to login
  logout() {
    localStorage.removeItem('user'); // Clear user data
    localStorage.removeItem('admin'); // Clear admin data
    localStorage.removeItem('token'); // Clear token if stored
    localStorage.clear()
    this.router.navigate(['/login']); // Redirect to login page
  }
}
