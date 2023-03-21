export interface DataItem {
    name: string;
}

export interface Item extends DataItem {
    points: number;
    expansion: string;
    image: string;
    xws: string;
}

export interface BattleGoal extends Item {
    
}

export type DataTypes = {
    "BattleGoal": BattleGoal,
}

export interface UserSettings {
    partyName: string
    numberToDraw: string
    playerNumber: string
    expansion: string
    scenarioNumber: string
    attemptNumber: string
  }