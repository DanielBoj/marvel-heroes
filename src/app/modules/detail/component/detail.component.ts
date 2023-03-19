/* Implementa la lógica de la página de detalles del personaje realizando la captura de elementos del store y enrutando con los componentes hijos Historias y Cómics */

import { Component, OnInit } from '@angular/core';

// Importamos el módulo para poder capturar los parámetros de la URL
import { ActivatedRoute, Router } from '@angular/router';


// Importamos los modelos de interfaces
import { Result } from 'src/app/core/interfaces/marvelResponseModel';
import { Observable } from 'rxjs/internal/Observable';

// Para poder volver atrás con código del mismo framework
import { Location } from '@angular/common';

// Importamos el store de NgRx para el modelos reactivos
import { Store, select } from '@ngrx/store';
import * as heroesActions from 'src/app/state/actions/heroes.actions';
import * as heroesSelectors from 'src/app/state/selectors/heroes.selectors';
import { AppState } from 'src/app/state/app.state';


@Component({
    selector: 'app-detail',
    templateUrl: './detail.component.html',
    styleUrls: ['./detail.component.sass']
})
export class DetailComponent implements OnInit {

    descSubt: string = 'Biography';
    appearanceSubt: string = 'Last Appearance';

    // Captura del parámetro de la URL
    heroId!: number;

    // Observable para almacenar los datos del personaje retornados por la API
    hero$: Observable<Result[]> = new Observable();
    heroUrl$: Observable<string> = new Observable();

    // Navegación
    router: Router = new Router();

    constructor(
        private activatedRoute: ActivatedRoute,
        //private router: Router,
        private location: Location,
        private store: Store<AppState>) {

        // Capturamos el parámetro de la URL de la página
        this.getIdFromParams();

    }

    ngOnInit(): void {

        // Inicializamos cargando los datos datos del personaje
        this.getHeroById(this.heroId);

        // Obtenemos los datos del store
        this.hero$ = this.store.select(heroesSelectors.selectListHeroes);

        // Enviamos el ID del personaje al store
        this.store.dispatch(heroesActions.captureHeroIdSuccess({ heroId: this.heroId }));

        // Enviamos la URL de la página del personaje en Marvel al store
        // this.store.dispatch(heroesActions.captureHeroUrlSuccess({ heroUrl: url }));
        this.setHeroUrl();

        // Obtenemos la URL del personaje
        this.getHeroUrl();
    }

    // Método para obtener los datos del personaje, además, generaremos un objeto para poder extraer los datos y usarlos en la vista
    getHeroById = async (heroId: number) => {
        if (heroId > 0) {

            // cambiamos el tipo de dato
            const idString = heroId.toString();

            // Cargamos los datos en el store
            this.store.dispatch(heroesActions.loadHeroById({ id: idString }));
        } else {
            console.log('Error: Could not find a suitable hero ID');
            return;
        }
    }

    // Método para volver a la última página visitada al hacer click en el botón de atrás
    getBack = () => {
        this.location.back();
    }

    // Método para obtener el parámetro de la URL
    getIdFromParams = () => {
        this.activatedRoute.params.subscribe(params => {
            this.heroId = params['id'];
        })
    }

    // Método para obtener la URL del personaje y subirla al store y poder recuperarla en la vista
    getHeroUrl = () => {
        this.heroUrl$ = this.store.select(heroesSelectors.selectHeroUrlValue);
    }

    setHeroUrl = () => {

        // Obtenemos la URL del personaje
        this.hero$.forEach((hero) => {
            hero.map((hero) => this.store.dispatch(heroesActions.captureHeroUrlSuccess({ heroUrl: hero.urls[3].url })));
        });


    }

    // Método para navegar a la página de Marvel del Héroe
    checkHero = (url: string) => {
        window.location.href = url;
    }
}
