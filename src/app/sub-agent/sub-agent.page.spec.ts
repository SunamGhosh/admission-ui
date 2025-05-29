import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SubAgentPage } from './sub-agent.page';

describe('SubAgentPage', () => {
  let component: SubAgentPage;
  let fixture: ComponentFixture<SubAgentPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(SubAgentPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
