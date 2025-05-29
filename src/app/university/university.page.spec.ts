import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UniversityPage } from './university.page';

describe('UniversityPage', () => {
  let component: UniversityPage;
  let fixture: ComponentFixture<UniversityPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(UniversityPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
