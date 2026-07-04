import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar } from '@ionic/angular/standalone';
import { IonicModule } from '@ionic/angular';
import { ApiService } from '../services/api.service';
import { AlertController } from '@ionic/angular';

 interface Agent {
  id?: number;               // Unique Agent ID (Optional for new entries)
  agent_name: string;        // Full Name of the Agent
  bank_name?: string;        // Bank Name for Payment (Optional)
  email: string;             // Agent's Email Address
  mobile: string;            // Mobile Number
  organisation?: string;     // Associated Organization Name (Optional)
  gender?: any;  // Enum for Gender (Optional)
  office_address?: string;   // Office Address of the Agent (Optional)
  aadhar_card?: string;      // Aadhar Card Number (Optional)
  pan_card?: string;         // PAN Card Number (Optional)
  password: string;          // Password for Authentication
  is_active?: boolean;       // Status: Active/Inactive (Optional)
  mobile_two?:any,
  mobile_whatsapp?:any,
  account_name?:string,
  account_no?:string,
  IFSC_code?:string
}


interface SubAgent {
  id:number,
  sub_agent_name: string;
  bank_name?: string;  
  agent_id: number;
  email: string;
  mobile: string;
    // Mobile Number
  organisation?: string;     // Associated Organization Name (Optional)
  gender?: any;  // Enum for Gender (Optional)
  office_address?: string;   // Office Address of the Agent (Optional)
  aadhar_card?: string;      // Aadhar Card Number (Optional)
  pan_card?: string;
  password: string;
  is_active?: boolean;       // Status: Active/Inactive (Optional)
  mobile_two?:any,
  mobile_whatsapp?:any,
  account_name?:string,
  account_no?:string,
  IFSC_code?:string
}
@Component({
  selector: 'app-sub-agent',
  templateUrl: './sub-agent.page.html',
  styleUrls: ['./sub-agent.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class SubAgentPage implements OnInit {
  agents: Agent[] = [];
  subagent: Partial<SubAgent> = {}; // Holds form data
  subagents: SubAgent[] = [];  // âœ… Added this to store sub-agents list
  constructor(private api: ApiService, private alertCtrl: AlertController) {}

  ngOnInit() {
    this.loadAgents();
    this.loadSubAgents();  // âœ… Call this function to load sub-agents
    this.getNextSubAgentId()
  }

  async downloadAgentExcel(): Promise<void> {
    try {
      const token = localStorage.getItem("token");
  
      // API request to download Agent Excel
      const response = await fetch("https://admission-api-suyk.onrender.com/sub-agent/excel", {
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

  async loadAgents() {
    try {
      let response = await this.api.post('/agent/getall', {});
      this.agents = response.data || [];
    } catch (error) {
      console.error('Error fetching agents:', error);
    }
  } // âœ… Function to load sub-agents
  async loadSubAgents() {
    try {
      let response = await this.api.post('/sub-agent/getall', {}); 
      this.subagents = response.data || [];  // âœ… Update sub-agent list
    } catch (error) {
      console.error('Error fetching sub-agents:', error);
    }
  }

  async addSubAgent() {
    if (!this.subagent.sub_agent_name || !this.subagent.agent_id || !this.subagent.email || !this.subagent.mobile || !this.subagent.password) {
      this.showAlert('Error', 'Mandatory fields are missing.');
      return;
    }

    try {
      let response = await this.api.post('/sub-agent/add', this.subagent);
      if (response.ok) {
        this.showAlert('Success', 'Sub-agent added successfully!');
        this.subagent = {}; // Reset form 
        window.location.reload()
      } else {
        this.showAlert('', response.msg || ' add sub-agent.');
        window.location.reload();
      }
    } catch (error) {
      console.error('adding sub-agent:', error);
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



  async getNextSubAgentId() {
    try {
      const response = await this.api.post('/sub-agent/next-id', {}); // Call API to get next sub-agent ID
      console.log('API Response:', response); // Debugging
  
      if (response.ok) {
        this.subagent.id = response.nextId; // âœ… Store next ID in the `subagent` object
      } else {
        console.error('Error fetching next ID:', response.msg);
        this.showAlert('Error', 'Failed to fetch the next Sub-Agent ID.');
      }
    } catch (error) {
      console.error('Error:', error);
      this.showAlert('Error', 'An error occurred while fetching the next Sub-Agent ID.');
    }
  }
  

  // âœ… Method to get Agent Name by agent_id
  getAgentName(agent_id: number): string {
    const agent = this.agents.find(a => a.id=== agent_id);
    return agent ? agent.agent_name : 'Unknown Agent';
  }
  filteredSubAgents: SubAgent[] = []; // âœ… This will hold the filtered sub-agents
  searchAgentName: string = '';
  searchSubAgentName: string = '';
  searchEmailOrMobile: string = '';
 // âœ… Apply Filter Logic
 applyFilter() {
  this.filteredSubAgents = this.subagents.filter(subAgent => {
    const agentName = this.getAgentName(subAgent.agent_id).toLowerCase();
    const subAgentName = subAgent.sub_agent_name.toLowerCase();
    const email = subAgent.email.toLowerCase();
    const mobile = subAgent.mobile.toLowerCase();
    
    return (
      agentName.includes(this.searchAgentName.toLowerCase()) &&
      subAgentName.includes(this.searchSubAgentName.toLowerCase()) &&
      (email.includes(this.searchEmailOrMobile.toLowerCase()) || mobile.includes(this.searchEmailOrMobile.toLowerCase()))
    );
  });
}
}


