import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar } from '@ionic/angular/standalone';
import { IonicModule } from '@ionic/angular';
@Component({
  selector: 'app-calculator',
  templateUrl: './calculator.page.html',
  styleUrls: ['./calculator.page.scss'],
  standalone: true,
  imports: [IonicModule,CommonModule, FormsModule]
})
export class CalculatorPage implements OnInit {
  display: string = '';
  constructor() { }

  ngOnInit() {
  }




  // Add to display
  addToDisplay(value: string | number) {
    this.display += value;
  }

  // Clear display
  clear() {
    this.display = '';
  }

  // Calculate the result
  calculate() {
    try {
      this.display = eval(this.display).toString(); // Note: eval can be unsafe for user inputs; consider a safer parser for production.
    } catch (e) {
      this.display = 'Error';
    }
  }
}


