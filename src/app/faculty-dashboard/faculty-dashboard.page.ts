import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule} from '@ionic/angular';
import { Router } from '@angular/router';
import { DepartmentMasterService } from '../services/department-master.service';

@Component({
  selector: 'app-faculty-dashboard',
  templateUrl: './faculty-dashboard.page.html',
  styleUrls: ['./faculty-dashboard.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class FacultyDashboardPage implements OnInit {
  faculty: any;
  
departments: any[] = [];

  constructor(private router: Router, private departmentService: DepartmentMasterService) {}

  ngOnInit() {
     const storedFaculty = localStorage.getItem('faculty');
    if (storedFaculty) {
      this.faculty = JSON.parse(storedFaculty);
    }

     this.loadDepartments();
  }


  
async loadDepartments() {
  this.departments = await this.departmentService.getAllDepartments();
}getDepartmentName(): string {
  const dept = this.departments.find(d => d.id === this.faculty?.faculty_department_id);
  return dept?.department_name ?? 'NA';
}



  logout() {
    localStorage.removeItem('faculty');
    this.router.navigate(['/faculty-login']);
  }
}


