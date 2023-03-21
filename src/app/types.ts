export interface DataItem {
    name: string
}

export interface Item extends DataItem {
    points: number
    expansion: string
    image: string
    xws: string
}

export interface BattleGoal extends Item {}

// export interface BattleGoal
// {
//     name: string;
//     expansion: string;
//     points: number;
//     image: string;
//     xws: string;
// }

export type DataTypes = {
    "BattleGoal": BattleGoal,
}

export interface UserSettings {
    partyName: string
    numberToDraw: number
    playerNumber: number
    expansion: string
    scenarioNumber: string
    attemptNumber: string
  }