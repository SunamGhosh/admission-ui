import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GiveAccessPage } from './give-access.page';

describe('GiveAccessPage', () => {
  let component: GiveAccessPage;
  let fixture: ComponentFixture<GiveAccessPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(GiveAccessPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
