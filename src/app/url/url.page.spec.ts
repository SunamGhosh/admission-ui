import { ComponentFixture, TestBed } from '@angular/core/testing';
import { URLPage } from './url.page';

describe('URLPage', () => {
  let component: URLPage;
  let fixture: ComponentFixture<URLPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(URLPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
