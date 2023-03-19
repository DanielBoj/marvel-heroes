/* Implementa la lógica para mostrar los datos de un personaje tras ser seleccionado en el input de búsqueda por un usuario */

import { Component, Input, OnInit } from '@angular/core';
import { Observable } from 'rxjs';

// Manejador del store NgRx
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/state/app.state';
import { selectListHeroes } from 'src/app/state/selectors/heroes.selectors';


@Component({
    selector: 'app-hero-card',
    templateUrl: './hero-card.component.html',
    styleUrls: ['./hero-card.component.sass']
})
export class HeroCardComponent implements OnInit {

    // Almacena la lista de héroes a mostrar
    allHeroes$: Observable<any> = new Observable();

    // Títulos
    subt: string = 'Last Modified';
    button: string = 'Get Details';

    constructor(private store: Store<AppState>) { }

    ngOnInit(): void {
        // Obtenemos la lista de héroes a través del store
        this.allHeroes$ = this.store.select(selectListHeroes);

    }
}
