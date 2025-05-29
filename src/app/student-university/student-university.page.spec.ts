import { ComponentFixture, TestBed } from '@angular/core/testing';
import { StudentUniversityPage } from './student-university.page';

describe('StudentUniversityPage', () => {
  let component: StudentUniversityPage;
  let fixture: ComponentFixture<StudentUniversityPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(StudentUniversityPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
