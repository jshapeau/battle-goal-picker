import { HttpClient } from "@angular/common/http";
import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class BattleGoalDataService {
    
    constructor(private api: HttpClient) {}

    GetBattleGoal() {
        return this.api.get('localhost:7000/battlegoals/aggressor');
    }

    GetAllBattleGoals() {
        return this.api.get('http://localhost:7000/battlegoals/all');
    }

    GetBattleGoals(expansion: string) {
        return this.api.get(`http://localhost:7000/battlegoals?expansion=${expansion}`);
    }
}

@Injectable({
    providedIn: 'root'
})
export class LocalService {

    constructor() { }

    public saveData(key: string, value: string) {
        localStorage.setItem(key, value);
    }

    public getData(key: string) {
        return localStorage.getItem(key)
    }
    public removeData(key: string) {
        localStorage.removeItem(key);
    }

    public clearData() {
        localStorage.clear();
    }
}