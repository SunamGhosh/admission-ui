import { ComponentFixture, TestBed } from '@angular/core/testing';
import { KolhanUniversityPage } from './kolhan-university.page';

describe('KolhanUniversityPage', () => {
  let component: KolhanUniversityPage;
  let fixture: ComponentFixture<KolhanUniversityPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(KolhanUniversityPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
