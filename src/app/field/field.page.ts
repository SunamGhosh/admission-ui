import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar } from '@ionic/angular/standalone';
import { Module, Table, Template_Field } from 'interface';
import { VariablesService } from '../services/variables.service';
import { UserService } from '../services/user.service';
import { AlertController, ToastController ,IonicModule} from '@ionic/angular';

@Component({
  selector: 'app-field',
  templateUrl: './field.page.html',
  styleUrls: ['./field.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class FieldPage implements OnInit {
modules: Module[] = [];
  tables: Table[] = [];
  fields: Template_Field[] = [];
  formData: Template_Field = {};
  isEditMode = false;

  constructor(
    private variableService: VariablesService,
    private userService: UserService
  ) {}

  async ngOnInit() {
    const res = await this.userService.getAllModules();
    if (res.ok) this.modules = res.data;
    await this.loadFields();

    // Load all tables (not just for one module)
  this.tables = await this.userService.getAllTables();
  }

  async onModuleChange() {
    if (this.formData.module_id) {
      this.tables = await this.userService.getTablesByModule(this.formData.module_id);
      this.formData.table_id = undefined; // Reset table selection
    }
  }

  async loadFields() {
    this.fields = await this.variableService.template_field_all();
  }

  async saveField() {
    if (this.isEditMode && this.formData.id) {
      await this.variableService.updateTemplateField(this.formData);
    } else {
      await this.variableService.addTemplateField(this.formData);
    }
    this.resetForm();
    await this.loadFields();
  }

  editField(field: Template_Field) {
    this.formData = { ...field };
    this.isEditMode = true;
    this.onModuleChange(); // Load tables when editing
  }

  async deleteField(id: number | undefined) {
    if (id && confirm('Are you sure you want to delete this field?')) {
      await this.variableService.deleteTemplateField(id);
      await this.loadFields();
    }
  }

  resetForm() {
    this.formData = {};
    this.isEditMode = false;
  }
getModuleName(moduleId: number | undefined): string {
  if (moduleId === undefined) return 'N/A';
  const module = this.modules.find(m => m.id === moduleId);
  return module ? module.module_name : 'N/A';
}

getTableName(tableId: number | undefined): string {
  if (tableId === undefined) return 'N/A';
  const table = this.tables.find(t => t.id === tableId);
  return table ? table.table : 'N/A';
}


}