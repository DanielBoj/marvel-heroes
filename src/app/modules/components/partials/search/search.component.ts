/* Este componente implementa la funcionalidad de búsqueda de personajes.

Usa los servicios de conexión a la API de Marvel y de compartir datos entre componentes.

Implementa lógica para el autocompletado de las opciones de búsqueda.
igualmente, pasa a los servicios de la API los parámetros opcionales para la búsqueda.

Para evitar saturar la API, solo re realizará la búsqueda al presionar el icono de búsqueda o enter. */

import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';

// Formularios
import { FormControl } from '@angular/forms';

// Importamos el servicio para obtener los datos de los personajes
import { MarvelService } from 'src/app/services/marvel.service';

// Importamos el store de NgRx para el modelos reactivos
import { Store, select } from '@ngrx/store';
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
    namesOpt: string[] = new Array();
    // Total de personajes según la docu de Marvel
    limit: number = 1562;

    // Observable para almacenar los nombres de los personajes filtrados
    filteredNames: Observable<string[]> = new Observable();

    // Controlador para el input de búsqueda
    search: FormControl = new FormControl();

    // Observable para almacenar los datos del personaje retornados por la API
    hero$: Observable<any> = new Observable();
    heroId: number = 0;

    // Carga de datos
    loading$: Observable<boolean> = new Observable();


    constructor(private store: Store<AppState>) {

        // Cargamos la id del último personaje seleccionado
        this.setHeroId();

        // Cargamos los datos del último personaje seleccionado
        this.checkHero();
    }

    ngOnInit(): void {

        // Carga de estados iniciales
        this.loading$ = this.store.select(heroesSelectors.selectLoadingNames);

        // Obtenemos la lista de nombres
        this.getNames();

        // Filtramos los nombres de los personajes
        this.filteredNames = this.search.valueChanges
            .pipe(startWith(''),
                map(value => this._filter(value))
            );
    }

    /* Controladores */
    // Controlador para el input de búsqueda
    private _filter = (value: string): any => {
        // Convertimos el valor a minúsculas para que no haya problemas con los nombres introducidos por el usuario
        const filterValue = value.toLowerCase();

        // Filtramos los nombres de los personajes
        if (value.length > 2) {
            return [...new Set(this.namesOpt.filter(option => option.toLowerCase().includes(filterValue)))];
        } else {
            return [];
        }
    }

    /* Métodos */
    // Método para obtener los nombres de los héroes a través del servicio de Marvel
    // Como la respuesta está limitada a 100 resultados, se realiza una llamada a la API por cada 100 resultados definiendo un offset para no cargar datos respetidos hasta llegar al límite de 1562 personajes
    getNames = () => {
        // Controlamos el inicio de la llamada a la API
        let count: number = 0;

        while (count < this.limit) {
            // Obtenemos los nombres de los héroes
            const countAsString = count.toString();
            // Cargamos los nombres en el store
            this.store.dispatch(heroesActions.loadNames({ offset: countAsString }));

            // Obtenemos los nombres de los personajes a través del store
            this.store.select(heroesSelectors.selectListNames).subscribe((names: string[]) => {
                this.namesOpt = this.namesOpt.concat(names as string[]);
            });

            // Actualizamos el contador para definir el offset de las llamadas recurrentes
            count += 100;
        }
    }

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

    // Método para dinamizar el filtrado de los nombres de los personajes
    onFilter = (name: string) => {
        if (name !== '') {

            // Actualizamos el valor del input de búsqueda a través del controlador
            name.toLowerCase();
        } else {
            return;
        }
    }

    // Método para mostrar el nombre del personaje seleccionado de forma correcta
    showFilter = (opt: string) => {
        return opt ? opt : '';
    }

    // Método para obtener un héroe en concreto a través del servicio de Marvel refiriendo su nombre
    onChange = (event: any, name?: string) => {

        // Llamar al método para obtener los datos del personaje:
        // Si el usuario entra un nombre, realiza la búsqueda de forma automática
        // Si el usuario selecciona un nombre de la lista de sugerencias, realiza la búsqueda al presionar el icono de búsqueda
        // Si el usuario presiona enter, realiza la búsqueda
        if (name !== undefined) {
            this.store.dispatch(heroesActions.loadHero({ name: name }));
        } else {
            this.store.dispatch(heroesActions.loadHero({ name: event.target.value }));
        }
    }

    // Método para cargar la id del héroe desde el store
    setHeroId = () => {

        //Obtenemos el valor del store
        this.store.select(heroesSelectors.selectHeroIdValue).forEach((heroId: number) => this.heroId = heroId);
    }

    // Comprobamos si existe un personaje seleccionado y lo cargamos
    checkHero = () => {
        if (this.heroId > 0) {
            this.getHeroById(this.heroId);
        } else {
            return;
        }
    }
}
