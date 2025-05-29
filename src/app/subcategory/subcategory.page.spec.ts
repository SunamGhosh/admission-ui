import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SubcategoryPage } from './subcategory.page';

describe('SubcategoryPage', () => {
  let component: SubcategoryPage;
  let fixture: ComponentFixture<SubcategoryPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(SubcategoryPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
