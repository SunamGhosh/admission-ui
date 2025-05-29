import { Component, OnInit, ViewChild, ElementRef, ChangeDetectorRef  } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar } from '@ionic/angular/standalone';
import { ApiService } from '../services/api.service';
import {IonicModule} from '@ionic/angular'
import { UtilsService } from '../services/utils.service';
import { UserService } from '../services/user.service';
import { Course, Semester, Session } from 'interface';
import { Chart, registerables } from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
@Component({
  selector: 'app-stats',
  templateUrl: './stats.page.html',
  styleUrls: ['./stats.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class StatsPage implements OnInit {

  

  @ViewChild('studentChart') studentChart!: ElementRef;
  chart!: Chart | null;  // Store chart instance
  feeCollected: number = 0;
  admissionsCount: number = 0;
  users: any[] = [];
  filteredUsers: any[] = [];
  officeStaffList: any[] = [];
  
  totalStaff: number = 0;  // Holds total staff count
  activeStudents: number = 0; // Holds active students count

  searchTerm: string = ''; 
  selectedCourse: string | null = null;
  selectedSemester: string | null = null;
  selectedSession: string | null = null;

  constructor(private api: ApiService, private utils: UtilsService, private us: UserService,private cdr: ChangeDetectorRef) {}

  ngOnInit() {
    Chart.register(...registerables);  // Ensure Chart.js is registered
    this.loadSessions().then(() => {
      this.loadAllUsers(); // Load users after sessions
    });
    this.getOfficeStaff();
    this.loadCourses();   // Ensure courses are loaded
    this.loadSemesters(); // Ensure semesters are loaded
    this.loadSessions();  // Make sure to load sessions
  }

  selectedSessionId: number | null = null; 
selectedSessionName: string = "All Sessions"; 
filteredCourses: any[] = [];

filterCoursesBySession() {
  if (this.selectedSessionId !== null) {
    const selectedSession = this.st.find(session => session.id === this.selectedSessionId);
    this.selectedSessionName = selectedSession?.session_name ?? "Unknown Session";

    this.filteredCourses = this.courseCountsArray.filter(course => course.session_id === this.selectedSessionId);
  } else {
    this.selectedSessionName = "All Sessions";
    this.filteredCourses = [...this.courseCountsArray];
  }

  this.cdr.detectChanges(); // Force UI update
}



async loadAllUsers() {
  try {
    const response = await this.us.user_all();
    if (response.ok && Array.isArray(response.data)) {
      this.users = response.data;
      this.filteredUsers = [...this.users];
      this.activeStudents = this.users.length;
      
      // Render the chart
      this.cdr.detectChanges();
      setTimeout(() => {
        this.renderChart();
        this.filterCoursesBySession(); // Ensure filtering happens after data is available
      }, 500);
    }
  } catch (error) {
    console.error('Error loading users:', error);
  }
}

async getOfficeStaff() {
    try {
      const response = await this.api.post('/office/getall', {});
      if (response.ok) {
        this.officeStaffList = response.data;
        this.totalStaff = this.officeStaffList.length;
      }
    } catch (error) {
      console.error('Error fetching office staff:', error);
    }
  }
  courseCountsArray: { name: string, count: number ,session_id?: number}[] = [];

  renderChart() {
    if (!this.studentChart || !this.studentChart.nativeElement) {
      console.error('Canvas element not found!');
      return;
    }
  
    if (this.chart) {
      this.chart.destroy();
    }
    const courseCounts: { [key: string]: { count: number; session_id: number } } = {};

    this.users.forEach(user => {
      // Ensure courseName is always a string
      const courseName: string = this.getCourseName(user.course_id) ?? 'Unknown';
    
      // Initialize entry if not already present
      if (!courseCounts[courseName]) {
        courseCounts[courseName] = { count: 0, session_id: user.session_id };
      }
    
      // Increment count
      courseCounts[courseName].count += 1;
    });
    
  
    this.courseCountsArray = Object.keys(courseCounts).map(key => ({
      name: key,
      count: courseCounts[key].count,
      session_id: courseCounts[key].session_id // Ensure session_id is assigned
    }));
  
    this.filterCoursesBySession(); // Apply filter after generating data
  
    this.chart = new Chart(this.studentChart.nativeElement, {
      type: 'bar',
      data: {
        labels: Object.keys(courseCounts),
        datasets: [{
          label: 'Students per Course',
          data: Object.values(courseCounts).map(item => item.count),
          backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0'],
          borderColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0'],
          borderWidth: 1.5,
          borderRadius: 6,
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: { beginAtZero: true, grid: { display: false } },
          x: { grid: { display: false } }
        },
        plugins: {
          legend: { display: false },
          datalabels: {
            anchor: 'end',
            align: 'top',
            formatter: (value) => value,
            font: { weight: 'bold' }
          }
        }
      },
      plugins: [ChartDataLabels]
    });
  }
  

  co:Course[]=[];
  st:Session[]=[];
  
  // Load courses
async loadCourses() {
  try {
    this.co = await this.us.course_all();
    console.log('Courses loaded:', this.co);
  } catch (error) {
    console.error('Error loading courses:', error);
  }
}

// Load semesters
async loadSemesters() {
  try {
    this.sem = await this.us.semester_all();
    console.log('Semesters loaded:', this.sem);
  } catch (error) {
    console.error('Error loading semesters:', error);
  }
}
  
  
    sem: Semester[]=[];
    async loaders(){
      this.sem= await this.us.semester_all()
    }
    getCourseName(courseId: number) {
      const course = this.co.find(c => c.id === courseId);
      return course ? course.course_name : 'N/A';  // Use `this.co` instead of `this.users`
    }
    
    getSemesterName(semesterId: number) {
      const semester = this.sem.find(s => s.id === semesterId);
      return semester ? semester.semester_name : 'N/A';  // Use `this.sem` instead of `this.users`
    }


    async loadSessions() {
      try {
        this.st = await this.us.session_all();
        console.log('Sessions loaded:', this.st);
      } catch (error) {
        console.error('Error loading sessions:', error);
      }
    }
    
  }    


