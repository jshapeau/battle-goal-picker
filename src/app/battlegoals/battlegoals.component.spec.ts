import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BattlegoalsComponent } from './battlegoals.component';

describe('BattlegoalsComponent', () => {
  let component: BattlegoalsComponent;
  let fixture: ComponentFixture<BattlegoalsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BattlegoalsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BattlegoalsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
