import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AlertController } from '@ionic/angular';
import { 
  IonContent, 
  IonHeader, 
  IonTitle, 
  IonToolbar, 
  IonFooter, 
  IonList, 
  IonItem, 
  IonLabel, 
  IonSearchbar, IonGrid, IonRow, IonCol, IonBackButton, IonButtons, IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonButton } from '@ionic/angular/standalone';
import { UserService } from '../services/user.service';
import { UtilsService } from '../services/utils.service';
import { Session } from 'interface';
import { IonicModule } from '@ionic/angular';  // Added IonicModule import

@Component({
  selector: 'app-session',
  templateUrl: './session.page.html',
  styleUrls: ['./session.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class SessionPage implements OnInit {
  sessions: any[] = []; // Array to hold all sessions
  filteredSessions: any[] = []; // Array to hold filtered sessions
  searchTerm: string = ''; // Search term for filtering sessions
is_open:boolean=false

is_open_edit:boolean=false
  sessionData: Session = {
    session_name: '',
    session_short_name: '',
    session_end_year: '',
    session_in_use: '',
    session_current: ''
    
  }
  constructor(
    private us: UserService,
    private utils: UtilsService,private alertCtrl: AlertController
  ) {}

  ngOnInit() {
    this.loadAllSessions(); // Load sessions when the component initializes
  }

  async loadAllSessions() {
    try {
      const response = await this.us.session_all(); // Fetch all sessions from the service
      console.log('Response:', response); // Log the response to verify the structure
      if (Array.isArray(response)) { // Check if the response is an array directly
        this.sessions = response; // Set the sessions array directly to the response
        this.filteredSessions = [...this.sessions]; // Initialize the filtered list with all sessions
        console.log('Sessions loaded:', this.sessions); // Log the loaded sessions
      } else {
        console.error('Unexpected response format:', response);
        this.sessions = [];
        this.filteredSessions = [];
      }
    } catch (error) {
      console.error('Error loading sessions:', error); // Log any errors
      this.utils.toast('Error loading sessions. Please try again later.'); // Show an error message
      this.sessions = [];
      this.filteredSessions = [];
    }
  }

  // Filter sessions based on search term
  filterSessions() {
    if (!this.searchTerm.trim()) {
      this.filteredSessions = [...this.sessions]; // If search term is empty, show all sessions
    } else {
      this.filteredSessions = this.sessions.filter(session =>
        session.session_name?.toLowerCase().includes(this.searchTerm.toLowerCase()) // Case-insensitive filtering
      );
    }
  }





  async addSession() {
    try {
      const response = await this.us.addedSession(this.sessionData);
      console.log('Session added:', response);
    await this.utils.toast("added")
    window.location.reload(); // Full page reload

    } catch (error) {
      console.error('adding session:', error);
      await this.utils.toast("failed")
    }
  }
 // Open edit modal
 // 🛠 Fixed `sessionData` not showing in modal
 async editSession(session: Session) {
  console.log("Editing session:", session);
  if (!session) {
    this.utils.toast("Invalid session data.");
    return;
  }
  
  this.sessionData = { ...session };

  // Convert data types
  this.sessionData.session_end_year = Number(session.session_end_year);
  this.sessionData.session_in_use = session.session_in_use === "Y";
  this.sessionData.session_current = session.session_current === "Y";

  console.log("Session data inside modal:", this.sessionData);
  this.is_open_edit = true;
}

async confirmUpdate() {
  const alert = await this.alertCtrl.create({
    header: 'Confirm Update',
    message: 'Are you sure you want to update this session?',
    buttons: [
      { text: 'Cancel', role: 'cancel', handler: () => console.log('Update canceled') },
      { text: 'Update', handler: () => this.updateSession() }
    ],
  });

  await alert.present();
}

async updateSession() {
  try {
    // Convert `true/false` back to `"Y"` / `"N"` before sending
    this.sessionData.session_in_use = this.sessionData.session_in_use ? "Y" : "N";
    this.sessionData.session_current = this.sessionData.session_current ? "Y" : "N";

    const response = await this.us.updateSession(this.sessionData);
    console.log('Session updated:', response);
    await this.utils.toast('Session updated successfully');
    
    this.closeEditModal();
    await this.loadAllSessions();
  } catch (error) {
    console.error('Error updating session:', error);
    await this.utils.toast('Update failed');
  }
}

closeEditModal() {
  this.is_open_edit = false;
  this.sessionData = { 
    session_name: '',
    session_short_name: '',
    session_end_year: '',
    session_in_use: '',
    session_current: ''
  };
}





  // to open modal
  openModal() {
   
    this.is_open = true;
  }

  /**
   * Closes the modal
   */
  closeModal() {
    this.is_open = false;
  }
}
