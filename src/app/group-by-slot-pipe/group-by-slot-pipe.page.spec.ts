import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GroupBySlotPipePage } from './group-by-slot-pipe.page';

describe('GroupBySlotPipePage', () => {
  let component: GroupBySlotPipePage;
  let fixture: ComponentFixture<GroupBySlotPipePage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(GroupBySlotPipePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
