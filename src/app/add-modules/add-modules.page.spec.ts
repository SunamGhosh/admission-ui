import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AddModulesPage } from './add-modules.page';

describe('AddModulesPage', () => {
  let component: AddModulesPage;
  let fixture: ComponentFixture<AddModulesPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(AddModulesPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
