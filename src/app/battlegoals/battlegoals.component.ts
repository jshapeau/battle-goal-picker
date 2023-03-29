//ANGULAR
import { Component, OnInit, ViewEncapsulation, Inject, AfterViewInit } from '@angular/core';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';

//APP
import { BattleGoalDataService, LocalService } from '../services'
import { ArrayShuffler } from '../utilities';
import { UserSettings, BattleGoal, Expansion, ExpansionCardPack } from '../types'
import defaultUserSettings from '../../assets/data/default_user_settings.json'
import registeredExpansions from '../../assets/data/registered_expansions.json'

@Component({
  selector: 'app-battlegoals',
  templateUrl: './battlegoals.component.html',
  styleUrls: ['./battlegoals.component.sass'],
  encapsulation: ViewEncapsulation.None
})
export class BattlegoalsComponent implements OnInit{
  
  battleGoals: BattleGoal[] = []
  selectedBattleGoals: BattleGoal[] = []
  userSettings: UserSettings
  battleGoalCache: string = ''
  registeredExpansions: Expansion[]
  defaultUserSettings: UserSettings

  constructor(private dataService: BattleGoalDataService, private arrayShuffler: ArrayShuffler, private settings: LocalService, public dialog: MatDialog) {
    this.defaultUserSettings = defaultUserSettings as UserSettings
    this.userSettings = defaultUserSettings
    this.registeredExpansions = registeredExpansions as Expansion[]
    
    if (defaultUserSettings.version != this.settings.getData('version')) {
      settings.clearData()
      settings.saveData('version', defaultUserSettings.version)
    } //Clear localStorage if localStorage settings changed.

    //Initialize user settings from localStorage; use default settings as fallback.
    (Object.keys(this.userSettings) as Array<keyof UserSettings>).forEach( (key) => {
      this.userSettings[key] = this.settings.getData(key.toString()) ?? this.defaultUserSettings[key]
    })
    //Special logic for initializing expansions
    this.userSettings.expansion = this.findExpansions(this.settings.getData('expansion')?.name) ?? this.findExpansions(this.defaultUserSettings.expansion?.name) ?? this.registeredExpansions[0]
  }

  ngOnInit() {
    this.swapTheme(this.userSettings.theme)
    this.initializeStandaloneCacheListeners()
  }
  
  cacheData(key: string, value: any) {
    value = value
    this.settings.saveData(key, value)
  }

  /**
   * Entry point for selecting battle goals. Opens Dialog component showing results.
   */
  chooseBattleGoals(): void {
    const startingDraw: number = (this.userSettings.playerNumber - 1) * this.userSettings.numberToDraw
    const endingDraw: number = (startingDraw + this.userSettings.numberToDraw)
    const searchTerms: string[] = [this.userSettings.expansion?.name] 

    this.userSettings.expansion.cardPacks.forEach(x => this.userSettings.expansionCardPacks.indexOf(x.name) != -1 ? searchTerms.push(x.name) : null )
    this.dataService.find([], searchTerms).subscribe(
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

  toggleCardPack(status: boolean, cardPackName: string) {
    if (status) {
      this.userSettings.expansionCardPacks.indexOf(cardPackName) ? this.userSettings.expansionCardPacks.push(cardPackName) : ''
    } else {
      const index = this.userSettings.expansionCardPacks.indexOf(cardPackName)
      this.userSettings.expansionCardPacks.splice(index, 1)
    }
  }
  
  findExpansions(value: any)
  {
    return this.registeredExpansions.find(x => x.name == value)
  }

  /**
 * Caches data for offline use whan application is used in Standalone mode.
 */
  private initializeStandaloneCacheListeners() {
    const pwaMode: string = this.getPwaDisplayMode()
    if (pwaMode == 'standalone' || pwaMode == 'twa') {
      this.cacheAllData()
    }

    window.addEventListener('appinstalled', () => {
      this.cacheAllData()
    })

    window.matchMedia('(display-mode: standalone)').addEventListener('change', (evt) => {
      if (evt.matches) {
        this.cacheAllData()
      }
    })
  }

  private getPwaDisplayMode(): string {
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches;
    if (document.referrer.startsWith('android-app://')) {
      return 'twa';
    } else if (('standalone' in window.navigator) && (window.navigator['standalone']) || isStandalone) {
      return 'standalone';
    }
    return 'browser';
  }
  
  /**
   * Temporary runtime caching strategy
   */
  private cacheAllData(): void {
    this.dataService.findAll().subscribe(result => { 
      result.forEach(battleGoal => 
        fetch(`../../assets/${battleGoal.image}`).then( response => {const _ = result} ))
    })
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
