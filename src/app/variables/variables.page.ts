import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar } from '@ionic/angular/standalone';
import { TemplateVariable } from 'interface';
import { VariablesService } from '../services/variables.service';
import { AlertController, ToastController ,IonicModule} from '@ionic/angular';
import { UtilsService } from '../services/utils.service';
import { UserService } from '../services/user.service';
import { ApiService } from '../services/api.service';


@Component({
  selector: 'app-variables',
  templateUrl: './variables.page.html',
  styleUrls: ['./variables.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class VariablesPage implements OnInit {

  
  templateVariables: TemplateVariable[] = [];
  modules: any[] = [];
  tables: any[] = [];
  fields: any[] = [];

  form = {
    id: 0,
    module_id: null,
    table_id: null,
    table_field_id: null,
    variable_key: '',
    variable_description: ''
  };

  constructor(
    private toastController: ToastController,
    private variableService: VariablesService,
    private userService: UserService
  ) {}

  ngOnInit() {
    this.loadVariables();
    this.loadModules();
    this.loadTables();
    this.loadFields();
  }

  async loadVariables() {
    this.templateVariables = await this.variableService.template_variable_all();
  }
async loadModules() {
  const res = await this.userService.getAllModules();
  if (res.ok) this.modules = res.data;
}

// Load tables when a module is selected
async onModuleChange() {
  if (this.form.module_id) {
    const res = await this.userService.getTablesByModule(this.form.module_id);
    this.tables = res;
    this.form.table_id = null;
    this.fields = []; // Reset fields
    this.form.table_field_id = null;
  }
}

// Load fields when a table is selected
async onTableChange() {
  if (this.form.table_id) {
    const res = await this.userService.getFieldsByTableId(this.form.table_id);
    this.fields = res;
    this.form.table_field_id = null;
  }
}


  async loadTables() {
    this.tables = await this.userService.getAllTables();
  }

  async loadFields() {
    this.fields = await this.variableService.template_field_all();
  }async save() {
  const { module_id,  table_id,table_field_id, variable_key, variable_description, id } = this.form;

  if (!module_id || !table_field_id || !variable_key || !variable_description) {
    return this.presentToast('All fields are required.');
  }

  if (id === 0) {
    const result = await this.variableService.add_template_variable({
      module_id,
       table_id,
      table_field_id,
      variable_key,
      variable_description
    });
    if (result.ok) {
      this.presentToast('Added successfully');
      this.loadVariables();
      this.resetForm();
    }
  } else {
    const result = await this.variableService.update_template_variable(this.form);
    if (result.ok) {
      this.presentToast('Updated successfully');
      this.loadVariables();
      this.resetForm();
    }
  }
}

  edit(item: any) {
    this.form = { ...item };
  }

  async delete(id: number) {
    if (confirm('Are you sure you want to delete this variable?')) {
      const result = await this.variableService.delete_template_variable(id);
      if (result.ok) {
        this.presentToast('Deleted successfully');
        this.loadVariables();
      }
    }
  }

  resetForm() {
  this.form = {
    id: 0,
    module_id: null,
    table_id: null,
    table_field_id: null,
    variable_key: '',
    variable_description: ''
  };
}

  async presentToast(message: string) {
    const toast = await this.toastController.create({
      message,
      duration: 2000,
      position: 'top'
    });
    toast.present();
  }

  getModuleName(moduleId: number): string {
  const module = this.modules.find(m => m.id === moduleId);
  return module ? module.module_name : 'N/A';
}

getTableName(tableId: number): string {
  const table = this.tables.find(t => t.id === tableId);
  return table ? table.table : 'N/A';
}

getFieldName(fieldId: number): string {
  const field = this.fields.find(f => f.id === fieldId);
  return field ? field.field_name : 'N/A';
}

}