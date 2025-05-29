import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SpecialisationPage } from './specialisation.page';

describe('SpecialisationPage', () => {
  let component: SpecialisationPage;
  let fixture: ComponentFixture<SpecialisationPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(SpecialisationPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
