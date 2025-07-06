import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule,ToastController } from '@ionic/angular';
import { UserService } from '../services/user.service';
import { UtilsService } from '../services/utils.service';
import { Category } from 'interface';

// interface Category {
//   id: number;
//   category_name: string;
//   category_shortname: string;
//   module_id: number | null;
//   is_active?: number;
// }

interface Subcategory {
  id: number | null;
  category_id: number;
  subcategory_name: string;
  is_active?: number;
}

@Component({
  selector: 'app-subcategory',
  templateUrl: './subcategory.page.html',
  styleUrls: ['./subcategory.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule],
})
export class SubcategoryPage implements OnInit {
  categories: Category[] = [];
  subcategories: Subcategory[] = [];
  subcategory: Subcategory = { id: null, category_id: 0, subcategory_name: '' };
  selectedCategoryId: number | null = null;

  constructor(private us: UserService,private toastCtrl: ToastController,
    private util: UtilsService
  ) {}

  async ngOnInit() {
    await this.loadCategories();
    await this.loadSubcategories();
  }
async loadCategories() {
    try {
      const response = await this.us.category_all();
      console.log('Category API response:', response);
      if (response.ok && Array.isArray(response.data)) {
        this.categories = response.data;
      } else {
        this.categories = [];
        await this.util.toast('No categories found');
      }
    } catch (error) {
      console.error('Error loading categories:', error);
      this.categories = [];
      await this.util.toast('Failed to load categories');
    }
  }

async loadSubcategories() {
    try {
      const response = await this.us.subcategory_all();
      console.log('Subcategory API response:', response);
      if (response.ok && Array.isArray(response.data)) {
        this.subcategories = response.data;
      } else {
        this.subcategories = [];
      }
    } catch (error) {
      console.error('Error loading subcategories:', error);
      this.subcategories = [];
    }
  }

  async loadSubcategoriesByCategory(categoryId: number) {
    this.selectedCategoryId = categoryId;
    this.subcategory.category_id = categoryId;

    try {
      const response = await this.us.getSubcategoriesByCategory(categoryId);
      if (response.ok && Array.isArray(response.data)) {
        this.subcategories = response.data;
      } else {
        this.subcategories = [];
      }
      console.log('Subcategories loaded:', this.subcategories);
    } catch (error) {
      console.error('Failed to load subcategories:', error);
      this.subcategories = [];
    }
  }

  getCategoryName(categoryId: number): string {
    const category = this.categories.find(c => c.id === categoryId);
    return category?.category_name || 'N/A';
  }

  async addOrUpdateSubcategory() {
    if (this.selectedCategoryId === null) {
      alert('Please select a category first!');
      return;
    }

    if (!this.subcategory.subcategory_name) {
      alert('Subcategory name is required!');
      return;
    }

    try {
      const subcategoryPayload: Subcategory = {
        id: this.subcategory.id,
        category_id: this.selectedCategoryId,
        subcategory_name: this.subcategory.subcategory_name,
      };

      if (this.subcategory.id) {
        await this.us.update_sub_category(subcategoryPayload as { id: number; category_id: number; subcategory_name: string });
        alert('Subcategory updated!');
      } else {
        await this.us.add_sub_category(subcategoryPayload);
        alert('Subcategory added!');
      }

      this.subcategory = { id: null, category_id: this.selectedCategoryId, subcategory_name: '' };
      await this.loadSubcategoriesByCategory(this.selectedCategoryId);
    } catch (error) {
      console.error('Error saving subcategory:', error);
      alert('Error saving subcategory!');
    }
  }

  async deleteSubcategory(id: number) {
    try {
      await this.us.delete_sub_category(id);
      alert('Subcategory deleted!');
      if (this.selectedCategoryId) {
        await this.loadSubcategoriesByCategory(this.selectedCategoryId);
      }
    } catch (error) {
      console.error('Error deleting subcategory:', error);
      alert('Error deleting subcategory!');
    }
  }

  editSubcategory(sc: Subcategory) {
    this.subcategory = { ...sc };
    this.selectedCategoryId = sc.category_id;
  }
}