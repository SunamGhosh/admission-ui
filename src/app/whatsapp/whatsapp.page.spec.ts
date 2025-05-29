import { ComponentFixture, TestBed } from '@angular/core/testing';
import { WhatsappPage } from './whatsapp.page';

describe('WhatsappPage', () => {
  let component: WhatsappPage;
  let fixture: ComponentFixture<WhatsappPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(WhatsappPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
