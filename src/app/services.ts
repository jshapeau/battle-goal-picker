import { HttpClient } from "@angular/common/http"
import { Injectable, Inject } from '@angular/core'

import { BattleGoal } from './types'

import { Item } from './types'
import { Observable, of } from 'rxjs'

export interface DataSource<DataType> {

    Find (name?: string, expansion?: string): Observable<DataType[]>;
    FindAll (): DataType[];

}

@Injectable({
    providedIn: 'root'
})
export class JsonDataSource<DataType extends Item> implements DataSource<DataType> {
    private data: DataType[];
    
    constructor(@Inject(Object) private JsonData: object) {
        this.data = this.Parse(JsonData);
    }
    
    Parse(data: object): DataType[] {
        try {
            const result: DataType[] = data as DataType[];
            return result;
        }
        catch(e) {
            //Needs proper error handling.
            console.log("ERROR: Improperly formatted data.");
            return [];
        }
    }

    Find(id?: string, expansion?: string ): Observable<DataType[]> {
        return of(this.data.filter(item => 
                                    (item.name == id || !id) &&
                                    (item.expansion == expansion || !expansion)
                                ));
    }

    FindSingle(id: string): DataType {
        return this.data[0];
    }

    FindAll(): DataType[] {
        return this.data;
    }

}

export class LocalBattleGoalDataSource extends JsonDataSource<BattleGoal> {
    constructor(data: object) {
        super(data)
    }
}

@Injectable({
    providedIn: 'root'
})
export class DataService<DataType> {
    readonly dataSource: DataSource<DataType>;

    constructor (@Inject('BattlegoalDataSource') dataSource: DataSource<DataType>) {
        this.dataSource = dataSource;
    }

    Find (id?: string, expansion?: string): Observable<DataType[]> {
        return this.dataSource.Find(undefined, expansion);
    }

    async FindAll (): Promise<DataType[]> {
        return this.dataSource.FindAll();
    }
}

@Injectable({
    providedIn: 'root'
})
export class BattleGoalDataService extends DataService<BattleGoal> {

}

// @Injectable({
//     providedIn: 'root'
// })
// export class BattleGoalDataService {


//     constructor(private dataSource: JsonDataSource<BattleGoal>, private api: HttpClient) {

//     }

//     GetBattleGoal() {
//         return this.api.get('localhost:7000/battlegoals/aggressor');
//     }

//     GetAllBattleGoals() {
//         return this.api.get('http://localhost:7000/battlegoals/all');
//     }

//     Find(expansion: string) {
//         return this.dataSource.Find(undefined,expansion)
//     }
//     GetBattleGoals(expansion: string) {
        
//         return this.dataSource.Find(undefined,expansion)
//         return this.api.get(`http://localhost:7000/battlegoals?expansion=${expansion}`);
//     }
// }

@Injectable({
    providedIn: 'root'
})
export class LocalService {

    constructor() { }

    public saveData(key: string, value: string) {
        localStorage.setItem(key, value);
    }

    public getData(key: string): string | null {
        return localStorage.getItem(key)
    }
    public removeData(key: string) {
        localStorage.removeItem(key);
    }

    public clearData() {
        localStorage.clear();
    }
}