import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule, AlertController, ToastController } from '@ionic/angular';
import { UserService } from '../services/user.service';
import { Module } from 'interface'; // Adjust import path as needed

@Component({
  selector: 'app-add-modules',
  templateUrl: './add-modules.page.html',
  styleUrls: ['./add-modules.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule],
})
export class AddModulesPage implements OnInit {
  modules: Module[] = [];
  filteredModules: Module[] = [];
  module_name = '';
  editMode = false;
  editId: number | null = null;
  searchTerm = '';

  constructor(
    private us: UserService,
    private alertCtrl: AlertController,
    private toastCtrl: ToastController
  ) {}

  ngOnInit() {
    this.loadModules();
  }

  async loadModules() {
    try {
      const response = await this.us.getAllModules();
      if (response.ok && Array.isArray(response.data)) {
        this.modules = response.data;
        this.filteredModules = [...this.modules];
      } else {
        this.modules = [];
        this.filteredModules = [];
        await this.showToast('No modules found');
      }
    } catch (error) {
      console.error('Error loading modules:', error);
      await this.showToast('Failed to load modules');
    }
  }

  filterModules() {
    const term = this.searchTerm.toLowerCase().trim();
    this.filteredModules = this.modules.filter(mod =>
      mod.module_name.toLowerCase().includes(term)
    );
  }

  async saveModule() {
    if (!this.module_name.trim()) {
      await this.showToast('Module name is required');
      return;
    }

    try {
      let result;
      if (this.editMode && this.editId !== null) {
        result = await this.us.updateModule(this.editId, this.module_name);
      } else {
        result = await this.us.addModule(this.module_name);
      }

      if (result.ok) {
        await this.showToast(result.msg || 'Module saved successfully');
        this.resetForm();
        await this.loadModules();
      } else {
        await this.showToast(result.msg || 'Error saving module');
      }
    } catch (error) {
      console.error('Error saving module:', error);
      await this.showToast('Error saving module');
    }
  }

  editModule(module: Module) {
    this.module_name = module.module_name;
    this.editMode = true;
    
  }

  async deleteModule(id: number) {
    const alert = await this.alertCtrl.create({
      header: 'Confirm Deletion',
      message: 'Are you sure you want to delete this module? This action cannot be undone.',
      buttons: [
        { text: 'Cancel', role: 'cancel' },
        {
          text: 'Delete',
          handler: async () => {
            try {
              const result = await this.us.removeModule(id);
              if (result.ok) {
                await this.showToast(result.msg || 'Module deleted successfully');
                await this.loadModules();
              } else {
                await this.showToast(result.msg || 'Error deleting module');
              }
            } catch (error) {
              console.error('Error deleting module:', error);
              await this.showToast('Error deleting module');
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
    this.searchTerm = '';
    this.filterModules();
  }

  async showToast(message: string) {
    const toast = await this.toastCtrl.create({
      message,
      duration: 2000,
      position: 'bottom',
    });
    await toast.present();
  }
}