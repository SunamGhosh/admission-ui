import { Component, OnInit } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-fronthomepage',
  templateUrl: './fronthomepage.page.html',
  styleUrls: ['./fronthomepage.page.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule,IonicModule,RouterModule]
})
export class FronthomepagePage implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
