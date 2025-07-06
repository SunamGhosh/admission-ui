import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { UserService } from '../services/user.service';
import { Module, Category, Subcategory, Template } from 'interface';

interface TemplateData {
  id: number;
  module_id: number;
  category_id: number;
  subcategory_id: number;
  template_shortname: string;
  template_name: string;
  variables: string;
}

@Component({
  selector: 'app-template',
  templateUrl: './template.page.html',
  styleUrls: ['./template.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class TemplatePage implements OnInit {
  template: TemplateData = {
    id: 0,
    module_id: 0,
    category_id: 0,
    subcategory_id: 0,
    template_shortname: '',
    template_name: '',
    variables: ''
  };

  modules: Module[] = [];
  categories: Category[] = [];
  subcategories: Subcategory[] = [];
  templates: Template[] = [];

  templateVariables: { template_id: number; variable_key: string; variable_description: string }[] = [];
  templateUrls: { template_id: number; url_label: string; url_value: string }[] = [];

  showVariablePanel = false;
  allVariablesFromDB: { variable_key: string; variable_description: string }[] = [];
  selectedVariables: Set<string> = new Set();

  constructor(private userService: UserService) {}

  async ngOnInit() {
    // Load modules
    const modulesResponse = await this.userService.getAllModules();
    this.modules = modulesResponse.ok ? modulesResponse.data : [];

    // Load categories
    const categoriesResponse = await this.userService.category_all();
    this.categories = categoriesResponse.ok ? categoriesResponse.data : [];

    // Load subcategories
    const subcategoriesResponse = await this.userService.subcategory_all();
    this.subcategories = subcategoriesResponse.ok ? subcategoriesResponse.data : [];

    // Load templates
    const templatesResponse = await this.userService.getTemplates();
    this.templates = Array.isArray(templatesResponse) ? templatesResponse : [];
  }

  async addTemplate() {
    const result = await this.userService.addTemplate(this.template);
    if (result.ok) {
      alert("Template added!");
      const templatesResponse = await this.userService.getTemplates();
      this.templates = Array.isArray(templatesResponse) ? templatesResponse : [];
    } else {
      alert("Error: " + result.msg);
    }
  }

  async onTemplateSelect(template: Template) {
    this.template = {
      id: template.id,
      module_id: template.module_id,
      category_id: template.category_id,
      subcategory_id: template.subcategory_id,
      template_shortname: template.template_shortname,
      template_name: template.template_name,
      variables: template.variables || ''
    };
    await this.loadTemplateVariables();
    await this.loadTemplateUrls();
  }

  async loadTemplateVariables() {
    if (!this.template.id) return;

    const result = await this.userService.getAllTemplateVariables();
    if (result.ok) {
      this.templateVariables = result.data.filter((v: any) => v.template_id === this.template.id);
    }
  }

  async loadTemplateUrls() {
    if (!this.template.id) return;
    const result = await this.userService.getTemplateUrls(this.template.id);
    if (result.ok) {
      this.templateUrls = result.data;
    }
  }

  async toggleShowVariables() {
    this.showVariablePanel = !this.showVariablePanel;
    if (this.showVariablePanel) {
      const result = await this.userService.getAllTemplateVariables();
      if (result.ok) {
        this.allVariablesFromDB = result.data;
      } else {
        alert("Failed to fetch variables");
      }
    }
  }

  toggleVariableSelection(key: string) {
    if (this.selectedVariables.has(key)) {
      this.selectedVariables.delete(key);
    } else {
      this.selectedVariables.add(key);
    }
  }

  async saveSelectedVariables() {
    if (!this.template.id || this.selectedVariables.size === 0) return;

    for (let key of this.selectedVariables) {
      await this.userService.addTemplateVariable({
        template_id: this.template.id,
        variable_key: key,
        variable_description: ''
      });
    }

    alert("Selected variables added!");
    await this.loadTemplateVariables();
    this.selectedVariables.clear();
    this.showVariablePanel = false;
  }

  getModuleName(id: number): string {
    return this.modules.find(m => m.id === id)?.module_name || '—';
  }

  getCategoryName(id: number): string {
    return this.categories.find(c => c.id === id)?.category_name || '—';
  }

  getSubcategoryName(id: number): string {
    return this.subcategories.find(s => s.id === id)?.subcategory_name || '—';
  }
}