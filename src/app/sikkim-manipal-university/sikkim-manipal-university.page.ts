import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar } from '@ionic/angular/standalone';

@Component({
  selector: 'app-sikkim-manipal-university',
  templateUrl: './sikkim-manipal-university.page.html',
  styleUrls: ['./sikkim-manipal-university.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule]
})
export class SikkimManipalUniversityPage implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
