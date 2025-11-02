import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FronthomepagePage } from './fronthomepage.page';

describe('FronthomepagePage', () => {
  let component: FronthomepagePage;
  let fixture: ComponentFixture<FronthomepagePage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(FronthomepagePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
