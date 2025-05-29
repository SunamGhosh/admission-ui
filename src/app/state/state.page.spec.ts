import { ComponentFixture, TestBed } from '@angular/core/testing';
import { StatePage } from './state.page';

describe('StatePage', () => {
  let component: StatePage;
  let fixture: ComponentFixture<StatePage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(StatePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
