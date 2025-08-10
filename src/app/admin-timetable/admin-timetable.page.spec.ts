import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AdminTimetablePage } from './admin-timetable.page';

describe('AdminTimetablePage', () => {
  let component: AdminTimetablePage;
  let fixture: ComponentFixture<AdminTimetablePage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminTimetablePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
