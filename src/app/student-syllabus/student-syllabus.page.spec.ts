import { ComponentFixture, TestBed } from '@angular/core/testing';
import { StudentSyllabusPage } from './student-syllabus.page';

describe('StudentSyllabusPage', () => {
  let component: StudentSyllabusPage;
  let fixture: ComponentFixture<StudentSyllabusPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(StudentSyllabusPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
