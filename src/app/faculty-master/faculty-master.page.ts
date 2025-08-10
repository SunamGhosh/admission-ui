import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import {IonicModule} from '@ionic/angular'
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-faculty-master',
  templateUrl: './faculty-master.page.html',
  styleUrls: ['./faculty-master.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule,RouterModule]
})
export class FacultyMasterPage implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
