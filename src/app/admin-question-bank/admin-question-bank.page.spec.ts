import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AdminQuestionBankPage } from './admin-question-bank.page';

describe('AdminQuestionBankPage', () => {
  let component: AdminQuestionBankPage;
  let fixture: ComponentFixture<AdminQuestionBankPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminQuestionBankPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
