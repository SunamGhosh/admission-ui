import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { UserService } from '../services/user.service';

interface Module {
  id?: number;
  module_name: string;
}

interface Category {
  id?: number | null;
  category_name: string;
  category_shortname: string;
  module_id: number | null;
}

@Component({
  selector: 'app-category',
  templateUrl: './category.page.html',
  styleUrls: ['./category.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule],
})
export class CategoryPage implements OnInit {
  categories: Category[] = [];
  modules: Module[] = [];
  category: Category = { id: null, category_name: '', category_shortname: '', module_id: null };

  constructor(private us: UserService) {}

  ngOnInit() {
    this.loadModules();
    this.loadCategories();
  }

  async loadModules() {
    try {
      const response = await this.us.getAllModules();
      if (response.ok) {
        this.modules = response.data;
      }
    } catch (error) {
      console.error('Error loading modules:', error);
    }
  }

  async loadCategories() {
    try {
      const res = await this.us.category_GETall();
      this.categories = res;
    } catch (error) {
      console.error('Error loading categories:', error);
    }
  }

  getModuleName(moduleId: number | null): string {
    if (!moduleId) return 'N/A';
    const module = this.modules.find(m => m.id === moduleId);
    return module?.module_name || 'N/A';
  }

  async addOrUpdateCategory() {
    if (!this.category.category_name || !this.category.category_shortname || this.category.module_id === null) {
      alert('Category name, short name, and module are required!');
      return;
    }

    try {
      // Create a new object with non-null id and module_id for API compatibility
      const categoryPayload = {
        id: this.category.id ?? 0, // Default to 0 for new categories if id is null
        category_name: this.category.category_name,
        category_shortname: this.category.category_shortname,
        module_id: this.category.module_id,
      };

      if (this.category.id) {
        await this.us.update_category(categoryPayload);
        alert('Category updated!');
      } else {
        await this.us.add_category(categoryPayload);
        alert('Category added!');
      }
      this.category = { id: null, category_name: '', category_shortname: '', module_id: null };
      await this.loadCategories();
    } catch (error) {
      console.error('Error saving category:', error);
      alert('Error saving category!');
    }
  }

  async deleteCategory(id: number) {
    try {
      await this.us.delete_category(id);
      alert('Category deleted!');
      await this.loadCategories();
    } catch (error) {
      console.error('Error deleting category:', error);
      alert('Error deleting category!');
    }
  }

  editCategory(c: Category) {
    this.category = { ...c };
  }
}