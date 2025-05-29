import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AddTablesPage } from './add-tables.page';

describe('AddTablesPage', () => {
  let component: AddTablesPage;
  let fixture: ComponentFixture<AddTablesPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(AddTablesPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
