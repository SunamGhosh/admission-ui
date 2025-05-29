import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar } from '@ionic/angular/standalone';
import { ApiService } from '../services/api.service';
import { UserService } from '../services/user.service';
import { IonicModule } from '@ionic/angular';

@Component({
  selector: 'app-category',
  templateUrl: './category.page.html',
  styleUrls: ['./category.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class CategoryPage implements OnInit {

 categories: any[] = [];
  subcategories: any[] = [];
  selectedCategoryId: number | null = null;

  // Models for add/update
  category = { id: null, category_name: '', category_shortname: '' };
  subcategory = { id: null, category_id: '', subcategory_name: '' };

  constructor(private api: ApiService,
    private us:UserService
  ) {}

  async ngOnInit() {
    await this.loadCategories();
  }

  async loadCategories() {
    const res = await this.us.category_all();
    this.categories = res;
  }

  // async loadSubcategoriesByCategory(categoryId: number) {
  //   this.selectedCategoryId = categoryId;
  //   const res = await this.(categoryId);
  //   this.subcategories = res;
  // }

  async addOrUpdateCategory() {
    if (this.category.id) {
      await this.us.update_category(this.category);
      alert('Category updated!');
    } else {
      await this.us.add_category(this.category);
      alert('Category added!');
    }
    this.category = { id: null, category_name: '', category_shortname: '' };
    await this.loadCategories();
  }

  async deleteCategory(id: number) {
    await this.us.delete_category(id);
    alert('Category deleted!');
    await this.loadCategories();
  }

  editCategory(c: any) {
    this.category = { ...c };
  }

//   async addOrUpdateSubcategory() {
//     if (this.subcategory.id) {
//       await this.api.update_sub_category(this.subcategory);
//       alert('Subcategory updated!');
//     } else {
//       await this.api.add_sub_category(this.subcategory);
//       alert('Subcategory added!');
//     }
//     this.subcategory = { id: null, category_id: this.selectedCategoryId, subcategory_name: '' };
//     if (this.selectedCategoryId) {
//       await this.loadSubcategoriesByCategory(this.selectedCategoryId);
//     }
//   }

//   async deleteSubcategory(id: number) {
//     await this.api.delete_sub_category(id);
//     alert('Subcategory deleted!');
//     if (this.selectedCategoryId) {
//       await this.loadSubcategoriesByCategory(this.selectedCategoryId);
//     }
//   }

//   editSubcategory(sc: any) {
//     this.subcategory = { ...sc };
//   }
// }

}