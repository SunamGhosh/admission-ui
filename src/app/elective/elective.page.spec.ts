import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ElectivePage } from './elective.page';

describe('ElectivePage', () => {
  let component: ElectivePage;
  let fixture: ComponentFixture<ElectivePage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ElectivePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
