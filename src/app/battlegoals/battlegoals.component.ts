//ANGULAR
import { Component, OnInit, ViewEncapsulation, Inject } from '@angular/core';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';

//APP
import { BattleGoalDataService, LocalService } from '../services'
import { ArrayShuffler } from '../utilities';
import { UserSettings, BattleGoal } from '../types'
import defaultUserSettings from '../../assets/data/default_user_settings.json'

@Component({
  selector: 'app-battlegoals',
  templateUrl: './battlegoals.component.html',
  styleUrls: ['./battlegoals.component.sass'],
  encapsulation: ViewEncapsulation.None
})
export class BattlegoalsComponent implements OnInit{
  
  defaultUserSettings: UserSettings
  battleGoals: BattleGoal[] = []
  selectedBattleGoals: BattleGoal[] = []
  userSettings: UserSettings

  constructor(private dataService: BattleGoalDataService, private arrayShuffler: ArrayShuffler, private settings: LocalService, public dialog: MatDialog) {
    this.defaultUserSettings = defaultUserSettings as UserSettings
    this.userSettings = defaultUserSettings

    //Set user settings from cache, or fallback to defaults.
    this.userSettings.partyName = this.settings.getData('partyName') ?? this.defaultUserSettings.partyName
    this.userSettings.numberToDraw = this.settings.getData('numberToDraw') ? Number(this.settings.getData('numberToDraw')) : this.defaultUserSettings.numberToDraw
    this.userSettings.playerNumber =  this.settings.getData('playerNumber') ? Number(this.settings.getData('playerNumber')) : this.defaultUserSettings.playerNumber
    this.userSettings.scenarioNumber = this.settings.getData('scenarioNumber') ?? this.defaultUserSettings.scenarioNumber
    this.userSettings.attemptNumber = this.settings.getData('attemptNumber') ?? this.defaultUserSettings.attemptNumber
    this.userSettings.expansion = this.settings.getData('expansion') ?? this.defaultUserSettings.expansion
    this.userSettings.theme = this.settings.getData('theme') ?? this.defaultUserSettings.theme
  }

  ngOnInit() {
    this.swapTheme(this.userSettings.theme)
  }
  
  cacheData(key: string, value: any) {
    console.log("cache")
    value = String(value)
    this.settings.saveData(key, value)
  }

  /**
   * Entry point for selecting battle goals. Opens Dialog component showing results.
   */
  chooseBattleGoals(): void {

    const startingDraw: number = (this.userSettings.playerNumber - 1) * this.userSettings.numberToDraw
    const endingDraw: number = (startingDraw + this.userSettings.numberToDraw)

    this.dataService.find(undefined, this.userSettings.expansion).subscribe(
      result => { 
        this.battleGoals = result as BattleGoal[]
        this.battleGoals = this.battleGoals.filter(item => item.name != 'battle-goals-back')
        this.battleGoals = this.shuffleDeck()
        this.selectedBattleGoals = this.sliceDeck(startingDraw, endingDraw)
        this.dialog.open(BattleGoalDialog, {
          data: this.selectedBattleGoals
        });
      }
    ) 
  }

  private shuffleDeck(): BattleGoal[] {
    const seed: string = this.userSettings.partyName + this.userSettings.scenarioNumber + this.userSettings.attemptNumber
    return this.arrayShuffler.shuffle(this.battleGoals, seed)
  }

  private sliceDeck(startingDraw: number, endingDraw: number): BattleGoal[] {
    function* range(from: number, to: number, step: number = 1) {
      let value = from;
      while (value <= to) {
        yield value
        value += step
      }
    }
    
    var slice = []
    for (const i of range(startingDraw, endingDraw - 1)) {
      slice.push(this.battleGoals[i % this.battleGoals.length] )
    }

    return slice
  }

  swapTheme(themeName: string) {
    
    themeName = themeName.replace(/\s+/g, '')
    const themeTag = themeName == "Frosthaven" || themeName == "frosthaven-theme" ? "frosthaven-theme" : "gloomhaven-theme"
    const body = document.body

    body?.classList.remove(this.userSettings.theme)
    this.userSettings.theme = themeTag
    this.cacheData('theme', themeTag)
    body?.classList.add(themeTag)
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
