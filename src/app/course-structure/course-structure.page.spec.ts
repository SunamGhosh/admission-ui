import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CourseStructurePage } from './course-structure.page';

describe('CourseStructurePage', () => {
  let component: CourseStructurePage;
  let fixture: ComponentFixture<CourseStructurePage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(CourseStructurePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
