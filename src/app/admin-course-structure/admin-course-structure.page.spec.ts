import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AdminCourseStructurePage } from './admin-course-structure.page';

describe('AdminCourseStructurePage', () => {
  let component: AdminCourseStructurePage;
  let fixture: ComponentFixture<AdminCourseStructurePage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminCourseStructurePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
