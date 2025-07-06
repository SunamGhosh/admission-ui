import { ComponentFixture, TestBed } from '@angular/core/testing';
import { VariablesPage } from './variables.page';

describe('VariablesPage', () => {
  let component: VariablesPage;
  let fixture: ComponentFixture<VariablesPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(VariablesPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
