import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SubjectPage } from './subject.page';

describe('SubjectPage', () => {
  let component: SubjectPage;
  let fixture: ComponentFixture<SubjectPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(SubjectPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
