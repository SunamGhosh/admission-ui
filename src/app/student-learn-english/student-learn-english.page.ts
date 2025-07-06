import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar } from '@ionic/angular/standalone';
import {IonicModule} from '@ionic/angular'

@Component({
  selector: 'app-student-learn-english',
  templateUrl: './student-learn-english.page.html',
  styleUrls: ['./student-learn-english.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class StudentLearnEnglishPage implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
