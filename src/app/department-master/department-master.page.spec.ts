import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DepartmentMasterPage } from './department-master.page';

describe('DepartmentMasterPage', () => {
  let component: DepartmentMasterPage;
  let fixture: ComponentFixture<DepartmentMasterPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(DepartmentMasterPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
