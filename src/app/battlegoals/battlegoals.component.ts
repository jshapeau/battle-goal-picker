import { Component, OnInit, ViewEncapsulation, Inject } from '@angular/core';
import { BattleGoal } from '../battlegoal';
import { BattleGoalDataService, LocalService } from '../services'
import { ArrayShuffler } from '../utilities';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { UserSettings } from '../types'

@Component({
  selector: 'app-battlegoals',
  templateUrl: './battlegoals.component.html',
  styleUrls: ['./battlegoals.component.sass'],
  encapsulation: ViewEncapsulation.None
})
export class BattlegoalsComponent implements OnInit{
  
  defaultUserSettings: UserSettings = {
    'partyName': 'Your Party Name',
    'numberToDraw': '3',
    'playerNumber': '1',
    'expansion': 'Gloomhaven',
    'scenarioNumber': '1',
    'attemptNumber': '1'
  }

  battleGoals: BattleGoal[] = [];
  selectedBattleGoals: BattleGoal[] = [];
  
  partyName: string
  numberToDraw: number
  playerNumber: number
  expansion: string
  scenarioNumber: string
  attemptNumber: string

  constructor(private dataService: BattleGoalDataService, private arrayShuffler: ArrayShuffler, private settings: LocalService, public dialog: MatDialog) {
    this.partyName = this.settings.getData('partyName') ?? this.defaultUserSettings.partyName;
    this.numberToDraw = parseInt(this.settings.getData('numberToDraw') ?? this.defaultUserSettings.numberToDraw)
    this.playerNumber = parseInt(this.settings.getData('playerNumber') ?? this.defaultUserSettings.playerNumber)
    this.scenarioNumber = this.settings.getData('scenarioNumber') ?? this.defaultUserSettings.scenarioNumber
    this.attemptNumber = this.settings.getData('attemptNumber') ?? this.defaultUserSettings.attemptNumber
    this.expansion = this.settings.getData('expansion') ?? this.defaultUserSettings.expansion;
  }

  ngOnInit() {

  }

  cacheData(key: string, value: any) {
    value = String(value)
    this.settings.saveData(key, value);
  }

  chooseBattleGoals(): void {

    const startingDraw: number = (this.playerNumber - 1) * this.numberToDraw;
    const endingDraw: number = (startingDraw + this.numberToDraw);

    this.dataService.Find(undefined, this.expansion).subscribe(
      result => { 
        this.battleGoals = result as BattleGoal[];
        this.battleGoals = this.battleGoals.filter(item => item.name != 'battle-goals-back');
        this.battleGoals = this.shuffleDeck()
        this.selectedBattleGoals = this.sliceDeck(startingDraw, endingDraw)
        this.dialog.open(BattleGoalDialog, {
          data: this.selectedBattleGoals
        });
      }
    ) 
  }

  private shuffleDeck(): BattleGoal[] {
    const seed: string = this.partyName + this.scenarioNumber + this.attemptNumber
    return this.arrayShuffler.shuffle(this.battleGoals, seed);
  }

  private sliceDeck(startingDraw: number, endingDraw: number): BattleGoal[] {
    function* range(from: number, to: number, step: number = 1) {
      let value = from;
      while (value <= to) {
        yield value;
        value += step;
      }
    }
    
    var slice = []
    for (const i of range(startingDraw, endingDraw - 1)) {
      slice.push(this.battleGoals[i % this.battleGoals.length] )
    }

    return slice
  }
}

@Component({
  selector: 'app-battlegoals-dialog',
  templateUrl: 'battlegoals.selected-dialog.html',
})
export class BattleGoalDialog {
  constructor(@Inject(MAT_DIALOG_DATA) public data: BattleGoal[]) 
  {
    
  }
}
