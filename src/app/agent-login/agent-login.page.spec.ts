import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AgentLoginPage } from './agent-login.page';

describe('AgentLoginPage', () => {
  let component: AgentLoginPage;
  let fixture: ComponentFixture<AgentLoginPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(AgentLoginPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
