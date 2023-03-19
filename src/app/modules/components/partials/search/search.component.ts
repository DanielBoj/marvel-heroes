/* Este componente implementa la funcionalidad de búsqueda de personajes.

Usa los servicios de conexión a la API de Marvel y de compartir datos entre componentes.

Implementa lógica para el autocompletado de las opciones de búsqueda.
igualmente, pasa a los servicios de la API los parámetros opcionales para la búsqueda.

Para evitar saturar la API, solo re realizará la búsqueda al presionar el icono de búsqueda o enter. */

import { Component, OnInit } from '@angular/core';
import { Observable, of } from 'rxjs';

// Importamos el servicio para obtener los datos de los personajes
import { MarvelService } from 'src/app/services/marvel.service';

// Importamos el store de NgRx para el modelos reactivos
import { Store } from '@ngrx/store';
import * as heroesActions from 'src/app/state/actions/heroes.actions';
import * as heroesSelectors from 'src/app/state/selectors/heroes.selectors';
import { AppState } from 'src/app/state/app.state';


@Component({
    selector: 'app-search',
    templateUrl: './search.component.html',
    styleUrls: ['./search.component.sass']
})
export class SearchComponent implements OnInit {

    // Observable para almacenar los nombres de los personajes
    namesOpt$: Observable<string[]> = new Observable;

    // Total de personajes según la docu de Marvel
    limit: number = 1562;

    // Observable para almacenar los nombres de los personajes filtrados
    filteredNames: Observable<string[]> = new Observable();

    // Observable para almacenar los datos del personaje retornados por la API
    hero$: Observable<any> = new Observable();
    heroId: number = 0;

    // Carga de datos
    loading$: Observable<boolean> = new Observable();


    constructor(private store: Store<AppState>, private marvelService: MarvelService) {

        // Cargamos la id del último personaje seleccionado
        this.setHeroId();

        // Cargamos los datos del último personaje seleccionado
        this.checkHero();
    }

    ngOnInit(): void {
    }

    /* Métodos */

    // Método para obtener un héroe en concreto a través del servicio de Marvel refiriendo su ID
    getHeroById = async (id: number) => {
        if (id > 0) {
            // Cargamos los datos al store
            const idString: string = id.toString();
            this.store.dispatch(heroesActions.loadHeroById({ id: idString })),
                // Obtenemos los datos del personaje
                this.hero$ = this.store.select(heroesSelectors.selectHeroId);
        } else {
            return;
        }
    }


    // Método para mostrar el nombre del personaje seleccionado de forma correcta
    showFilter = (opt: string) => {
        return opt ? opt : '';
    }

    // Método para obtener un héroe en concreto a través del servicio de Marvel refiriendo su nombre
    onSearch = (event: Event) => {

        // // Obtenemos los datos del personaje
        let name = ((event.target as HTMLInputElement).value);

        if (name.length > 0) {
            this.store.dispatch(heroesActions.loadHero({ name: name }));
        }
    }

    // Método para cargar la id del héroe desde el store
    setHeroId = () => {

        //Obtenemos el valor del store
        this.store.select(heroesSelectors.selectHeroIdValue).forEach((heroId: number) => this.heroId = heroId);
    }

    // Comprobamos si existe un personaje seleccionado y lo cargamos
    checkHero = () => {

        // Si ele id no es el valor por defecto, lanzamos la función para obtener el personaje
        if (this.heroId > 0) {
            this.getHeroById(this.heroId);
        } else {
            return;
        }
    }
}
