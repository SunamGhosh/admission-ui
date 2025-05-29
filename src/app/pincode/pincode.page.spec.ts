import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PincodePage } from './pincode.page';

describe('PincodePage', () => {
  let component: PincodePage;
  let fixture: ComponentFixture<PincodePage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(PincodePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
