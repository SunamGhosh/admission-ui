import { ComponentFixture, TestBed } from '@angular/core/testing';
import { QuickadmissionPage } from './quickadmission.page';

describe('QuickadmissionPage', () => {
  let component: QuickadmissionPage;
  let fixture: ComponentFixture<QuickadmissionPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(QuickadmissionPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
