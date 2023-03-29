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

export type DataTypes = {
    "BattleGoal": BattleGoal,
}

export interface UserSettings {
    [key: string]: any
    partyName: string
    numberToDraw: number
    playerNumber: number
    expansion: Expansion
    expansionCardPacks: string[]
    scenarioNumber: string
    attemptNumber: string
    theme: string
    version: number
}

export interface ExpansionCardPack {
    name: string
    friendlyName: string
}

export interface Expansion {
    name: string
    themeName: string
    friendlyName: string
    cardPacks: ExpansionCardPack[]
}