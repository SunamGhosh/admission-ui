import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

@Component({
  selector: 'app-give-access',
  templateUrl: './give-access.page.html',
  styleUrls: ['./give-access.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class GiveAccessPage implements OnInit {

  selectedRole: string = '';
  newRoleName: string = '';
  editRoleName: string = '';
  isModalOpen: boolean = false;

  userRoles: string[] = [];
  accessMatrix: any = {};

  menuItems = [
  { name: 'Dashboard', route: '/dashboard', icon: 'home' },
  
  // University & Admission
  { name: 'University Details', route: '/university', icon: 'school' },
  { name: 'Quick Admission', route: '/quick-admission', icon: 'flash' },
  { name: 'Admission', route: '/admission', icon: 'person-add' },
  { name: 'Apply Online', route: '/apply-online', icon: 'cloud-upload' },

  // Academic Modules
  { name: 'Course', route: '/course-structure', icon: 'layers' },

  { name: 'Course Structure', route: '/course', icon: 'layers' },
  { name: 'Session', route: '/session', icon: 'calendar' },
  { name: 'Subject', route: '/subject', icon: 'book' },
  { name: 'Elective', route: '/elective', icon: 'git-branch' },
  { name: 'Specialisation', route: '/specialisation', icon: 'ribbon' },
  { name: 'Semester', route: '/semester', icon: 'albums' },

  // Student Modules
  { name: 'student-syllabus', route: '/student-syllabus', icon: 'document-text' },
  { name: 'student-assignment', route: '/assignment', icon: 'create' },
  { name: 'student-question-bank', route: '/student-question-bank', icon: 'help-circle' },
  { name: 'University-Question', route: '/university-question', icon: 'reader' },

  { name: 'student-University-Question', route: '/student-university-question', icon: 'reader' },


  // Admin Modules
  { name: 'Admin Syllabus', route: '/admin-syllabus', icon: 'book-outline' },
  { name: 'Admin Assignment', route: '/admin-assignment', icon: 'document-attach' },
  { name: 'Admin Question Bank', route: '/admin-question-bank', icon: 'archive' },
  { name: 'admin-university-question', route: '/admin-university-question', icon: 'archive' },


  // Documents & Registration
  { name: 'View Documents', route: '/documents', icon: 'folder-open' },
  { name: 'Add KU Registration No.', route: '/Add-KU-registration-no.', icon: 'person-circle' },

  // Agents
  { name: 'Agent', route: '/Agent', icon: 'business' },
  { name: 'Sub-Agent', route: '/Sub-agent', icon: 'people-circle' },

  // Staff & Users
  { name: 'Office-Staff', route: '/office-staff', icon: 'people' },

  // Communication
  { name: 'WhatsApp Module', route: '/whatsapp/genralmodule', icon: 'logo-whatsapp' },

  // Location
  { name: 'City', route: '/city', icon: 'location' },
  { name: 'Pincode', route: '/pincode', icon: 'navigate' },
  { name: 'Country', route: '/country', icon: 'flag' },
  { name: 'State', route: '/state', icon: 'map' },

  // Stats & Reports
  { name: 'Stats', route: '/stats', icon: 'stats-chart' }
];









  ;

  ngOnInit() {
    const storedRoles = localStorage.getItem('user_roles');
    const storedAccess = localStorage.getItem('access_matrix');

    this.userRoles = storedRoles ? JSON.parse(storedRoles) : ['admin', 'office', 'student'];
    this.accessMatrix = storedAccess ? JSON.parse(storedAccess) : {};

    this.userRoles.forEach(role => {
      if (!this.accessMatrix[role]) this.accessMatrix[role] = {};
      this.menuItems.forEach(item => {
        if (!(item.name in this.accessMatrix[role])) {
          this.accessMatrix[role][item.name] = (role === 'admin');
        }
      });
    });

    this.selectedRole = this.userRoles[0];
  }

  openModal() {
    this.newRoleName = '';
    this.isModalOpen = true;
  }

  closeModal() {
    this.isModalOpen = false;
  }

  submitNewRole() {
    this.addRole(this.newRoleName);
    this.closeModal();
  }

  addRole(newRole: string | null | undefined) {
    if (!newRole || typeof newRole !== 'string') return;

    newRole = newRole.trim().toLowerCase();
    if (!newRole || this.userRoles.includes(newRole)) return;

    this.userRoles.push(newRole);
    this.accessMatrix[newRole] = {};
    this.menuItems.forEach(item => {
      this.accessMatrix[newRole][item.name] = false;
    });

    this.selectedRole = newRole;
    this.saveAccess();
  }

  renameRole(newName: string | null | undefined) {
    if (!newName || typeof newName !== 'string') return;

    newName = newName.trim().toLowerCase();
    if (!newName || newName === this.selectedRole || this.userRoles.includes(newName)) return;

    const index = this.userRoles.indexOf(this.selectedRole);
    if (index >= 0) {
      this.userRoles[index] = newName;
      this.accessMatrix[newName] = this.accessMatrix[this.selectedRole];
      delete this.accessMatrix[this.selectedRole];
      this.selectedRole = newName;
      this.editRoleName = '';
      this.saveAccess();
    }
  }

  deleteRole(roleToDelete: string) {
    if (confirm(`Are you sure you want to delete role "${roleToDelete}"?`)) {
      this.userRoles = this.userRoles.filter(r => r !== roleToDelete);
      delete this.accessMatrix[roleToDelete];

      if (this.selectedRole === roleToDelete) {
        this.selectedRole = this.userRoles.length > 0 ? this.userRoles[0] : '';
      }

      this.saveAccess();
    }
  }

  saveAccess() {
    localStorage.setItem('access_matrix', JSON.stringify(this.accessMatrix));
    localStorage.setItem('user_roles', JSON.stringify(this.userRoles));
    alert('✅ Access permissions saved!');
  }
}
