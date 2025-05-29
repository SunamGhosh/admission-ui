import { ComponentFixture, TestBed } from '@angular/core/testing';
import { StudentUniversityQuestionsPage } from './student-university-questions.page';

describe('StudentUniversityQuestionsPage', () => {
  let component: StudentUniversityQuestionsPage;
  let fixture: ComponentFixture<StudentUniversityQuestionsPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(StudentUniversityQuestionsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
