import { ComponentFixture, TestBed } from '@angular/core/testing';
import { StudentLearnEnglishPage } from './student-learn-english.page';

describe('StudentLearnEnglishPage', () => {
  let component: StudentLearnEnglishPage;
  let fixture: ComponentFixture<StudentLearnEnglishPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(StudentLearnEnglishPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
