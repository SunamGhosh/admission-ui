import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FacultyMasterPage } from './faculty-master.page';

describe('FacultyMasterPage', () => {
  let component: FacultyMasterPage;
  let fixture: ComponentFixture<FacultyMasterPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(FacultyMasterPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
