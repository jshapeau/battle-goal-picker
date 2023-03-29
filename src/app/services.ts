import { HttpClient } from "@angular/common/http"
import { Injectable, Inject } from '@angular/core'
import { Observable, of } from 'rxjs'

import { BattleGoal, Item } from './types'

export interface DataSource<DataType> {
    find (name?: string[], expansion?: string[]): Observable<DataType[]>
    findAll (): Observable<DataType[]>
}

@Injectable({
    providedIn: 'root'
})


export class JsonDataSource<DataType extends Item> implements DataSource<DataType> {
    private data: DataType[]
    
    constructor(@Inject(Object) private JsonData: object) {
        this.data = this.parse(JsonData)
    }
    
    private parse(data: object): DataType[] {
        try {
            const result: DataType[] = data as DataType[]
            return result
        }
        catch(e) {
            //Needs proper error handling.
            console.log("ERROR: Improperly formatted data.")
            return []
        }
    }

    /**
     * Filters Item data as the intersection on parameters.
     * 
     * @param id Filter criteria for item name or id
     * @param expansion Filter criteria for item expansion
     * @returns Array representing the intersection of the provided paramters.
     */
    find(id?: string[], expansion?: string[] ): Observable<DataType[]> {
        return of(this.data.filter(item => 
                                    (id?.includes(item.name) || !id) &&
                                    (expansion?.includes(item.expansion) || !expansion)
                                ));
    }

    findSingle(id: string): DataType {
        return this.data[0]
    }

    findAll(): Observable<DataType[]> {
        return of(this.data)
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
    readonly dataSource: DataSource<DataType>

    constructor (@Inject('BattlegoalDataSource') dataSource: DataSource<DataType>) {
        this.dataSource = dataSource
    }

    /**
     * Fetches data from associated data source.
     * 
     * @param id Filter criteria for item name or id
     * @param expansion Filter criteria for item expansion
     * @returns Observable providing an array representing the intersection of the provided paramters.
     */
    // find(id?: string, expansion?: string): Observable<DataType[]> {
    //     return this.dataSource.find(undefined, expansion)
    // }

    find(id?: string[], expansion?: string[]): Observable<DataType[]> {
        return this.dataSource.find(undefined, expansion)
    }

    findAll(): Observable<DataType[]> {
        return this.dataSource.findAll()
    }
}

@Injectable({
    providedIn: 'root'
})
export class BattleGoalDataService extends DataService<BattleGoal> {}

@Injectable({
    providedIn: 'root'
})
export class LocalService {

    constructor() { }

    public saveData(key: string, value: any) {
        localStorage.setItem(key, JSON.stringify(value))
    }

    public getData(key: string): any {
        return JSON.parse(localStorage.getItem(key) ?? "null")
    }

    public removeData(key: string) {
        localStorage.removeItem(key)
    }

    public clearData() {
        localStorage.clear()
    }
}