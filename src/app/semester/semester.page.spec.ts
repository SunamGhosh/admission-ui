import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SemesterPage } from './semester.page';

describe('SemesterPage', () => {
  let component: SemesterPage;
  let fixture: ComponentFixture<SemesterPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(SemesterPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
