import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { Template_Field, TemplateVariable } from 'interface';

@Injectable({
  providedIn: 'root'
})
export class VariablesService {

  constructor(
    private api:ApiService
  ) { }


 // TEMPLATE VARIABLE: Get all active template variables
async template_variable_all() {
  let data = await this.api.post("/variables/getall", {});
  return data.data; // returns the list of template variables
}

// TEMPLATE VARIABLE: Add a new variable
async add_template_variable(variable: {
  module_id: number,
   table_id:any,
  table_field_id: number,
  variable_key: string,
  variable_description: string
}) {
  let data = await this.api.post("/variables/add", variable);
  return data;
}

// TEMPLATE VARIABLE: Update an existing variable
async update_template_variable(variable: {
   id: number,
  module_id: number | null,
  table_field_id: number | null,
  variable_key: string,
  variable_description: string
}) {
  let data = await this.api.post("/variables/update", variable);
  return data;
}

// TEMPLATE VARIABLE: Delete (soft delete)
async delete_template_variable(id: number) {
  let data = await this.api.post("/variables/delete", { id });
  return data;
}




// Tempolate field service part 
// 🔹 Add a new Template Field
  addTemplateField(field: Template_Field) {
    return this.api.post('/field/add', {
      module_id: field.module_id,
      table_id: field.table_id,
      field_name: field.field_name
    });
  }

  // 🔹 Update an existing Template Field
  updateTemplateField(field: Template_Field) {
    return this.api.post('/field/update', {
      id: field.id,
      module_id: field.module_id,
      table_id: field.table_id,
      field_name: field.field_name
    });
  }

  // 🔹 Soft delete a Template Field
  deleteTemplateField(id: number) {
    return this.api.post('/field/delete', { id });
  }

   // TEMPLATE VARIABLE: Get all active template variables
async template_field_all() {
  let data = await this.api.post("/field/getall", {});
  return data.data; // returns the list of template variables
}
}
