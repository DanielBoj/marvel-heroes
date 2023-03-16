import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, map } from 'rxjs';
import { Result } from '../core/interfaces/marvelResponseModel';
import { SearchCache } from '../core/interfaces/pageCacheModel';


@Injectable({
    providedIn: 'root'
})
export class DataService {

    sourceHero: BehaviorSubject<Result> = new BehaviorSubject<Result>({ name: '', id: 0 } as Result);

    currentHero: Observable<Result> = this.sourceHero.asObservable();

    currentHeroId: Observable<number> = 0 as unknown as Observable<number>;

    cache?: SearchCache;

    constructor() { }

    setHero(hero: Result) {
        if (hero.id > 0) {
            this.sourceHero.next(hero)
        }
        // Descomentar para testar
        // console.log(this.sourceHero);
        this.currentHeroId = hero.id as unknown as Observable<number>;
    }

    getHero() {
        return this.currentHero as Observable<Result>;
    }
}
