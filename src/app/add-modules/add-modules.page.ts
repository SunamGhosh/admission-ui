import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar } from '@ionic/angular/standalone';
import { ApiService } from '../services/api.service';
import { AlertController, ToastController } from '@ionic/angular';
import { UserService } from '../services/user.service';
import { IonicModule } from '@ionic/angular';  // Added IonicModule import

@Component({
  selector: 'app-add-modules',
  templateUrl: './add-modules.page.html',
  styleUrls: ['./add-modules.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class AddModulesPage implements OnInit {

  modules: any[] = [];
  module_name = '';
  editMode = false;
  editId: number | null = null;
  searchTerm: string = '';
  filteredModules: any[] = [];

  constructor(
    private api: ApiService,
    private us:UserService,
    private toastCtrl: ToastController,
    private alertCtrl: AlertController
  ) {}

  ngOnInit() {
    this.loadModules();
  }
filterModules() {
    const term = this.searchTerm.toLowerCase();
    this.filteredModules = this.modules.filter(mod =>
      mod.module_name.toLowerCase().includes(term)
    );
  }

  async loadModules() {
  try {
    const response = await this.us.getAllModules();
    if (response.ok) {
      this.modules = response.data;
      this.filteredModules = [...this.modules]; // ✅ Fix added here
    }
  } catch (error) {
    console.error('Error loading modules:', error);
  }
}


  async saveModule() {
    if (!this.module_name.trim()) {
      this.showToast('Module name is required');
      return;
    }

    try {
      if (this.editMode && this.editId !== null) {
        const res = await this.us.updateModule(this.editId, this.module_name);
        this.showToast('Module updated successfully');
      } else {
        const res = await this.us.addModule(this.module_name);
        this.showToast('Module added successfully');
      }
      this.resetForm();
      this.loadModules();
    } catch (err) {
      this.showToast('Error saving module');
    }
  }

  editModule(module: any) {
    this.module_name = module.module_name;
    this.editMode = true;
    this.editId = module.id;
  }

  async deleteModule(id: number) {
    const alert = await this.alertCtrl.create({
      header: 'Confirm',
      message: 'Do you want to delete this module?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
        },
        {
          text: 'Delete',
          handler: async () => {
            try {
              await this.us.removeModule(id);
              this.showToast('Module deleted successfully');
              this.loadModules();
            } catch (err) {
              this.showToast('Error deleting module');
            }
          },
        },
      ],
    });

    await alert.present();
  }

  resetForm() {
    this.module_name = '';
    this.editMode = false;
    this.editId = null;
  }

  async showToast(msg: string) {
    const toast = await this.toastCtrl.create({
      message: msg,
      duration: 2000,
      position: 'bottom',
    });
    toast.present();
  }
}


