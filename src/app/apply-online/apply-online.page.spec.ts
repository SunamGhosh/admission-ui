import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ApplyOnlinePage } from './apply-online.page';

describe('ApplyOnlinePage', () => {
  let component: ApplyOnlinePage;
  let fixture: ComponentFixture<ApplyOnlinePage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ApplyOnlinePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
