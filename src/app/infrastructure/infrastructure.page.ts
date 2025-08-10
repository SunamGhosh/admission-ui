import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule} from '@ionic/angular';
import { Infrastructure } from 'interface';
import { InfrastructureService } from '../services/infrastructure.service';

@Component({
  selector: 'app-infrastructure',
  templateUrl: './infrastructure.page.html',
  styleUrls: ['./infrastructure.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class InfrastructurePage implements OnInit {

 infrastructures: Infrastructure[] = [];
  formData: Infrastructure = { room_no: '', floor_no: '', building_no: '' };
  isEdit = false;

  constructor(private infraService: InfrastructureService) {}

  ngOnInit() {
    this.loadData();
  }

  async loadData() {
    const res = await this.infraService.getAll();
    if (res.ok && res.data) {
      this.infrastructures = res.data;
    }
  }

  async save() {
    if (this.isEdit && this.formData.id) {
      const res = await this.infraService.update(this.formData);
      if (res.ok) {
        alert('Updated successfully!');
        this.resetForm();
        this.loadData();
      }
    } else {
      const res = await this.infraService.add(this.formData);
      if (res.ok) {
        alert('Added successfully!');
        this.resetForm();
        this.loadData();
      }
    }
  }

  edit(item: Infrastructure) {
    this.formData = { ...item };
    this.isEdit = true;
  }

  async deleteItem(id: number) {
    if (confirm('Are you sure to delete?')) {
      const res = await this.infraService.delete(id);
      if (res.ok) {
        alert('Deleted successfully!');
        this.loadData();
      }
    }
  }

  resetForm() {
    this.formData = { room_no: '', floor_no: '', building_no: '' };
    this.isEdit = false;
  }
}


