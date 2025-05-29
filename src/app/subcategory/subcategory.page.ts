import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar } from '@ionic/angular/standalone';
import { UserService } from '../services/user.service';
import { IonicModule } from '@ionic/angular';

@Component({
  selector: 'app-subcategory',
  templateUrl: './subcategory.page.html',
  styleUrls: ['./subcategory.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class SubcategoryPage implements OnInit {

   categories: any[] = [];
  subcategories: any[] = [];
 subcategory = { id: null, category_id: 0, subcategory_name: '' }; // or some default category_id

  selectedCategoryId: number | null = null;

  constructor(private us: UserService) {}

  async ngOnInit() {
     this.categories = await this.us.category_all(); // Make sure this method exists
    this.subcategories = await this.us.subcategory_all();
  }

 async loadSubcategoriesByCategory(category_id: number) {
  this.selectedCategoryId = category_id;
  this.subcategory.category_id = category_id;

  try {
    this.subcategories = await this.us.getSubcategoriesByCategory(category_id);
    console.log('Subcategories loaded:', this.subcategories);
  } catch (error) {
    console.error('Failed to load subcategories', error);
    this.subcategories = [];
  }
}
getCategoryName(categoryId: number): string {
  const category = this.categories.find(c => c.id === categoryId);
  return category ? category.category_name : 'N/A';
}


 async addOrUpdateSubcategory() {
  if (this.selectedCategoryId === null) {
    alert('Please select a category first!');
    return;
  }

  if (this.subcategory.id) {
    await this.us.update_sub_category(this.subcategory);
    alert('Subcategory updated!');
  } else {
    await this.us.add_sub_category(this.subcategory);
    alert('Subcategory added!');
  }

  this.subcategory = { id: null, category_id: this.selectedCategoryId, subcategory_name: '' };

  await this.loadSubcategoriesByCategory(this.selectedCategoryId);
}


  async deleteSubcategory(id: number) {
    await this.us.delete_sub_category(id);
    alert('Subcategory deleted!');
    if (this.selectedCategoryId) {
      await this.loadSubcategoriesByCategory(this.selectedCategoryId);
    }
  }

  editSubcategory(sc: any) {
    this.subcategory = { ...sc };
  }
}