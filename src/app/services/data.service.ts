import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, map } from 'rxjs';
import { Result } from '../core/interfaces/marvelResponseModel';


@Injectable({
    providedIn: 'root'
})
export class DataService {

    sourceHero: BehaviorSubject<Result[]> = new BehaviorSubject<Result[]>(undefined as unknown as Result[]);

    currentHero: Observable<Result[]> = this.sourceHero.asObservable();

    sourceHeroId: BehaviorSubject<number> = new BehaviorSubject<number>(0);

    currentHeroId: Observable<number> = 0 as unknown as Observable<number>;


    constructor() { }

    setHero(hero: Result[]) {
        // Solo actualizamos el valor si el id no es el default
        if (hero[0].id > 0) {
            this.sourceHero.next(hero)
        }

        // Descomentar para testar
        console.log(this.sourceHero);
    }

    getHero() {
        console.log(this.currentHero);
        return this.currentHero;
    }

    setHeroId(heroId: number) {
        this.sourceHeroId.next(heroId);
        this.currentHeroId = heroId as unknown as Observable<number>;
        console.log(this.currentHeroId);
    }

    getHeroId() {
        return this.currentHeroId as Observable<number>;
    }
}
