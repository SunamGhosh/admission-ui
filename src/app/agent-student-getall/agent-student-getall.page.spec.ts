import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AgentStudentGetallPage } from './agent-student-getall.page';

describe('AgentStudentGetallPage', () => {
  let component: AgentStudentGetallPage;
  let fixture: ComponentFixture<AgentStudentGetallPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(AgentStudentGetallPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
