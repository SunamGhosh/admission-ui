import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AdminSyllabusPage } from './admin-syllabus.page';

describe('AdminSyllabusPage', () => {
  let component: AdminSyllabusPage;
  let fixture: ComponentFixture<AdminSyllabusPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminSyllabusPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
