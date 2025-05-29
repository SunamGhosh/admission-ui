import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UserUniversityPage } from './user-university.page';

describe('UserUniversityPage', () => {
  let component: UserUniversityPage;
  let fixture: ComponentFixture<UserUniversityPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(UserUniversityPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
