import { ComponentFixture, TestBed } from '@angular/core/testing';
import { OfficeStaffPage } from './office-staff.page';

describe('OfficeStaffPage', () => {
  let component: OfficeStaffPage;
  let fixture: ComponentFixture<OfficeStaffPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(OfficeStaffPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
