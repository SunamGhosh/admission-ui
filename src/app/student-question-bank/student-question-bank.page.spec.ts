import { ComponentFixture, TestBed } from '@angular/core/testing';
import { StudentQuestionBankPage } from './student-question-bank.page';

describe('StudentQuestionBankPage', () => {
  let component: StudentQuestionBankPage;
  let fixture: ComponentFixture<StudentQuestionBankPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(StudentQuestionBankPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
