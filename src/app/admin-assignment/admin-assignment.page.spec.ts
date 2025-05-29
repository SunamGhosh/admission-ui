import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AdminAssignmentPage } from './admin-assignment.page';

describe('AdminAssignmentPage', () => {
  let component: AdminAssignmentPage;
  let fixture: ComponentFixture<AdminAssignmentPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminAssignmentPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
