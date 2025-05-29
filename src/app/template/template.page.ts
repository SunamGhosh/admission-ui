import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar } from '@ionic/angular/standalone';
import {IonicModule} from '@ionic/angular'
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-template',
  templateUrl: './template.page.html',
  styleUrls: ['./template.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class TemplatePage implements OnInit {

  template = {
    id:0,
  module_id: 0,
  category_id: 0,
  subcategory_id: 0,
  template_shortname: '',
  template_name: '',
  variables: ''
};

  modules: any[] = [];
  categories: any[] = [];
  subcategories: any[] = [];
  templates: any[] = [];
// 👇 Add these to fix the error
  selectedVariable: string = '';
  selectedLink: string = '';
  variableList: string[] = ['{{username}}', '{{email}}']; // Example variables
  linkList: string[] = ['https://example.com', 'https://docs.example.com']; // Example links

  constructor(private userService: UserService) {}

  async ngOnInit() {
    this.modules = (await this.userService.getAllModules()).data;
    this.categories = await this.userService.category_all();
    this.subcategories = await this.userService.subcategory_all();
    this.templates = await this.userService.getTemplates();
  }
// Add these properties to store template variables & URLs
templateVariables: any[] = [];
templateUrls: any[] = [];

// Call these after adding a variable or URL to refresh the lists
async loadTemplateVariables() {
  if (!this.template.module_id) return; // Or check template_id availability
  // Assuming you have an API method userService.getTemplateVariables(template_id)
  this.templateVariables = (await this.userService.getTemplateVariables(this.template.id)).data;
}

async loadTemplateUrls() {
  if (!this.template.module_id) return;
  this.templateUrls = (await this.userService.getTemplateUrls(this.template.id)).data;
}

// Modify addVariable()
async addVariable() {
  if (!this.selectedVariable) return alert("Select a variable first");
  if (!this.template.id) return alert("Template must be saved first");

  const variable_key = this.selectedVariable;
  const variable_description = ""; // You can ask user for description or use empty

  const result = await this.userService.addTemplateVariable({
    template_id: this.template.id,
    variable_key,
    variable_description,
  });

  if (result.ok) {
    alert("Variable added!");
    this.selectedVariable = "";
    await this.loadTemplateVariables();
  } else {
    alert("Error: " + result.msg);
  }
}

// Modify addLink()
async addLink() {
  if (!this.selectedLink) return alert("Select a link first");
  if (!this.template.id) return alert("Template must be saved first");

  const url_label = this.selectedLink; // Or prompt user for label
  const url_value = this.selectedLink;

  const result = await this.userService.addTemplateUrl({
    template_id: this.template.id,
    url_label,
    url_value,
  });

  if (result.ok) {
    alert("Link added!");
    this.selectedLink = "";
    await this.loadTemplateUrls();
  } else {
    alert("Error: " + result.msg);
  }
}
  async addTemplate() {
    const result = await this.userService.addTemplate(this.template);
    if (result.ok) {
      alert("Template added!");
      this.templates = await this.userService.getTemplates();
    } else {
      alert("Error: " + result.msg);
    }
  }

  getModuleName(id: number) {
    return this.modules.find(m => m.id === id)?.module_name || '—';
  }

  getCategoryName(id: number) {
    return this.categories.find(c => c.id === id)?.category_name || '—';
  }

  getSubcategoryName(id: number) {
    return this.subcategories.find(s => s.id === id)?.subcategory_name || '—';
  }
}

