import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AdminSchedulingTimetablePage } from './admin-scheduling-timetable.page';

describe('AdminSchedulingTimetablePage', () => {
  let component: AdminSchedulingTimetablePage;
  let fixture: ComponentFixture<AdminSchedulingTimetablePage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminSchedulingTimetablePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
