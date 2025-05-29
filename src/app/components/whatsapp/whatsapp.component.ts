import { Component, OnInit } from '@angular/core';

import { IonicModule } from '@ionic/angular';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-whatsapp',
  templateUrl: './whatsapp.component.html',
  styleUrls: ['./whatsapp.component.scss'],
   standalone: true,
    imports: [IonicModule, RouterModule, CommonModule],
})
export class WhatsappComponent  implements OnInit {

  constructor() { }

  ngOnInit() {}

}
