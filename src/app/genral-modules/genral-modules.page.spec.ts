import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GenralModulesPage } from './genral-modules.page';

describe('GenralModulesPage', () => {
  let component: GenralModulesPage;
  let fixture: ComponentFixture<GenralModulesPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(GenralModulesPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
