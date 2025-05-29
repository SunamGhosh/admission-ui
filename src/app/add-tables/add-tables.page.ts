import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar } from '@ionic/angular/standalone';
import { Table } from 'interface';
import { ApiService } from '../services/api.service';
import { UtilsService } from '../services/utils.service';
import { UserService } from '../services/user.service';
import { IonicModule } from '@ionic/angular';  // Added IonicModule import

@Component({
  selector: 'app-add-tables',
  templateUrl: './add-tables.page.html',
  styleUrls: ['./add-tables.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class AddTablesPage implements OnInit {

  tables: Table[] = [];
  filteredTables: Table[] = [];
  searchTerm: string = '';

  newTable: Table = { id: null, module_id: null, table: '' };
  is_open: boolean = false;

  modules: any[] = []; // To hold module list for dropdown

  constructor(
    private api: ApiService,
    private utils: UtilsService,
    private us:UserService// Should have a method like `getAllModules()`
  ) {}

  ngOnInit() {
    this.loadTables();
    this.loadModules();
  }

  async loadTables() {
    try {
      const response = await this.api.post('/table/getall', {});
      if (response.ok) {
        this.tables = response.data;
        this.filteredTables = [...this.tables];
      } else {
        this.utils.toast('Failed to load tables.');
      }
    } catch (err) {
      console.error('Error loading tables:', err);
      this.utils.toast('Server error while loading tables.');
    }
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


  openModal() {
    this.resetForm();
    this.is_open = true;
  }

  closeModal() {
    this.is_open = false;
  }

  filterTables() {
    const search = this.searchTerm.toLowerCase();
    this.filteredTables = this.tables.filter(tbl =>
      tbl.table?.toLowerCase().includes(search)
    );
  }

  async addTable() {
    if (!this.newTable.table || !this.newTable.module_id) {
      this.utils.toast('Module and table name are required.');
      return;
    }

    try {
      const response = await this.api.post('/table/add', this.newTable);
      if (response.ok) {
        this.utils.toast('Table added successfully!');
        this.loadTables();
        this.closeModal();
      } else {
        this.utils.toast(response.msg || 'Failed to add table.');
      }
    } catch (error) {
      console.error('Add table error:', error);
      this.utils.toast('Server error.');
    }
  }

  async updateTable(tbl: Table) {
    try {
      const response = await this.api.post('/table/update', tbl);
      if (response.ok) {
        this.utils.toast('Table updated.');
        this.loadTables();
      } else {
        this.utils.toast('Failed to update table.');
      }
    } catch (error) {
      console.error('Update error:', error);
      this.utils.toast('Server error.');
    }
  }

  async deleteTable(id: number) {
    try {
      const response = await this.api.post('/table/remove', { id });
      if (response.ok) {
        this.utils.toast('Table deleted.');
        this.loadTables();
      } else {
        this.utils.toast('Delete failed.');
      }
    } catch (err) {
      console.error('Delete error:', err);
      this.utils.toast('Server error.');
    }
  }

  resetForm() {
    this.newTable = { id: null, module_id: null, table: '' };
  }

  getModuleName(module_id: number): string {
    const module = this.modules.find(m => m.id === module_id);
    return module ? module.module_name : 'N/A';
  }
}
