import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UniversityRegistrationPage } from './university-registration.page';

describe('UniversityRegistrationPage', () => {
  let component: UniversityRegistrationPage;
  let fixture: ComponentFixture<UniversityRegistrationPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(UniversityRegistrationPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
