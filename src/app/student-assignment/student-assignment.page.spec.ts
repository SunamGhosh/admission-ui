import { ComponentFixture, TestBed } from '@angular/core/testing';
import { StudentAssignmentPage } from './student-assignment.page';

describe('StudentAssignmentPage', () => {
  let component: StudentAssignmentPage;
  let fixture: ComponentFixture<StudentAssignmentPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(StudentAssignmentPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
