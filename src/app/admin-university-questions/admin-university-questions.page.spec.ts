import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AdminUniversityQuestionsPage } from './admin-university-questions.page';

describe('AdminUniversityQuestionsPage', () => {
  let component: AdminUniversityQuestionsPage;
  let fixture: ComponentFixture<AdminUniversityQuestionsPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminUniversityQuestionsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
