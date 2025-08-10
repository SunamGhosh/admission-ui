import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FacultyRecognisationPage } from './faculty-recognisation.page';

describe('FacultyRecognisationPage', () => {
  let component: FacultyRecognisationPage;
  let fixture: ComponentFixture<FacultyRecognisationPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(FacultyRecognisationPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
