import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';

// Manejador del store NgRx
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/state/app.state';
import { selectListHeroes } from 'src/app/state/selectors/heroes.selectors';
import { Result } from 'src/app/core/interfaces/marvelResponseModel';


@Component({
    selector: 'app-hero-card',
    templateUrl: './hero-card.component.html',
    styleUrls: ['./hero-card.component.sass']
})
export class HeroCardComponent implements OnInit {

    allHeroes$: Observable<readonly Result[]> = new Observable();

    subDescript: string = 'Biography';
    subAparicion: string = 'Last Appearance';

    constructor(private router: Router, private store: Store<AppState>) { }

    ngOnInit(): void {
        // Obtenemos la lista de héroes a través del store
        this.allHeroes$ = this.store.select(selectListHeroes);
    }

    getHero = (heroId: any) => {

        // Cambiamos el tipo de dato
        heroId = Number(heroId);
        this.router.navigate(['character/', heroId]);
    }
}
