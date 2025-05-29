import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar } from '@ionic/angular/standalone';
import { ApiService } from '../services/api.service';
import { AlertController } from '@ionic/angular';
import { Agent } from 'interface';
import {IonicModule} from '@ionic/angular'
import { UserService } from '../services/user.service';
import { ToastController } from '@ionic/angular';
@Component({
  selector: 'app-agent',
  templateUrl: './agent.page.html',
  styleUrls: ['./agent.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class AgentPage implements OnInit {

  agent: Partial<Agent> = {};  // Object to hold form data
  agents: Agent[] = [];        // Array to store all agents
  filteredAgents: Agent[] = []; // Filtered list for displaying search results
  searchTerm: string = ''; // Search term for filtering
  async downloadAgentExcel(): Promise<void> {
    try {
      const token = localStorage.getItem("token");
  
      // API request to download Agent Excel
      const response = await fetch("http://localhost:3000/agent/agents/excel", {
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
      a.download = `agents.xlsx`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error downloading Agent Excel:", error);
    }
  }
  
  constructor(private api: ApiService, private alertCtrl: AlertController,private userService: UserService, private toastCtrl: ToastController) {}

  ngOnInit() {
    this.loadAgents();
    this.getNextAgentId()
  }

  async loadAgents() {
    try {
      let response = await this.api.post('/agent/getall', {});
      this.agents = response.data || [];
      this.filteredAgents = [...this.agents]; // Initialize with all agents
    } catch (error) {
      console.error('Error fetching agents:', error);
    }
  }
  searchName: string = '';
  searchEmail: string = '';
  searchMobile: string = '';
 // Filter agents based on search inputs
 filterAgents() {
  const nameSearch = this.searchName.trim().toLowerCase();
  const emailSearch = this.searchEmail.trim().toLowerCase();
  const mobileSearch = this.searchMobile.trim().toLowerCase();

  this.filteredAgents = this.agents.filter(agent =>
    (nameSearch === '' || agent.agent_name.toLowerCase().includes(nameSearch)) &&
    (emailSearch === '' || agent.email.toLowerCase().includes(emailSearch)) &&
    (mobileSearch === '' || agent.mobile.includes(mobileSearch)) // Mobile is numeric; no .toLowerCase()
  );
}


  async addAgent() {
    if (!this.agent.agent_name || !this.agent.email || !this.agent.mobile || !this.agent.password) {
      this.showAlert('Error', 'Mandatory fields are missing.');
      return;
    }

    try {
      let response = await this.api.post('/agent/add', this.agent);
      if (response.ok) {
        this.showAlert('Success', 'Agent added successfully!');
        this.loadAgents(); // Reload the agent list
        this.agent = {};   // Reset form fields
      } else {
        this.showAlert('Error', response.msg || 'Failed to add agent.');
      }
    } catch (error) {
      console.error('Error adding agent:', error);
      this.showAlert('Error', 'Something went wrong.');
    }
  }

  async showAlert(header: string, message: string) {
    const alert = await this.alertCtrl.create({
      header,
      message,
      buttons: ['OK'],
    });
    await alert.present();
  }
  async getNextAgentId() {
    try {
      const response = await this.api.post('/agent/next-id', {}); // Call API to get next agent ID
      console.log('API Response:', response); // Debugging
  
      if (response.ok) {
        this.agent.id = response.nextId; // ✅ Store next ID in the `agent` object
      } else {
        console.error('Error fetching next ID:', response.msg);
        this.showAlert('Error', 'Failed to fetch the next ID.');
      }
    } catch (error) {
      console.error('Error:', error);
      this.showAlert('Error', 'An error occurred while fetching the next ID.');
    }
  }


}
