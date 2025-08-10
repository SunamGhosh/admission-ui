import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FacultyLoginPage } from './faculty-login.page';

describe('FacultyLoginPage', () => {
  let component: FacultyLoginPage;
  let fixture: ComponentFixture<FacultyLoginPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(FacultyLoginPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
