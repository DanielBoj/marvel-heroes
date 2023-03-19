/*
* Este componente implementa la funcionalidad de búsqueda de personajes.
* Usa los servicios de conexión a la API de Marvel y de compartir datos entre componentes.
* Implementa lógica para el autocompletado de las opciones de búsqueda.
* igualmente, pasa a los servicios de la API los parámetros opcionales para la búsqueda.
*Para evitar saturar la API, solo re realizará la búsqueda al presionar el icono de búsqueda o enter.
*/

import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { debounceTime, distinctUntilChanged, map, startWith } from 'rxjs/operators';

// Formularios
import { FormControl } from '@angular/forms';

// Importamos los modelos de interfaces
import { Result } from 'src/app/core/interfaces/marvelResponseModel';
// Importamos el servicio para obtener los datos de los personajes
import { DataService } from 'src/app/services/data.service';
import { MarvelService } from 'src/app/services/marvel.service';

// Importamos el store de NgRx para el modelos reactivos
import { Store } from '@ngrx/store';
import { loadNames, loadNamesSuccess, loadHero, loadHeroSuccess } from 'src/app/state/actions/heroes.actions';
import { selectLoadingNames, selectListNames, selectHeroIdValue, selectHeroId, selectListHeroes } from 'src/app/state/selectors/heroes.selectors';
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
    hero$: Observable<readonly Result[]> = new Observable();
    heroId$: Observable<number> = new Observable();

    // Carga de datos
    loading$: Observable<boolean> = new Observable();

    // Controlamos el incio de las llamadas a la API
    //private subjectKeyDown = new Subject<any>();

    //TODO: Eliminar dataservice
    constructor(private marvelService: MarvelService,
        private dataService: DataService,
        private store: Store<AppState>) { }

    ngOnInit(): void {

        // // Obtenemos los nombres de los personajes
        // this.getNames();

        // Carga de estados iniciales
        this.loading$ = this.store.select(selectLoadingNames);

        // Obtenmos la lista de nombres
        this.getNames();
        // Obtenemos los nombres de los personajes a través del store
        this.store.dispatch(loadNames());

        // Cargamos la id del último personaje seleccionado
        this.heroId$ = this.store.select(selectHeroIdValue);

        // Obtenemos los datos del personaje seleccionado
        this.getHeroById(Number(this.heroId$));
        this.hero$ = this.store.select(selectListHeroes);

        // Obtenemos los datos del personaje seleccionado del componente hijo
        if (this.dataService.getHeroId()) {

            // Obtenemos el ID del personaje
            this.heroId$ = this.dataService.getHeroId();

            // Obtenemos los datos del personaje
            this.getHeroById(Number(this.heroId$));
        }


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

        // // Filtramos los nombres de los personajes
        return this.namesOpt.filter(option => option.toLowerCase().includes(filterValue));

    }

    /* Métodos */
    // Método para obtener los nombres de los héroes a través del servicio de Marvel
    getNames = () => {
        // Controlamos el inicio de la llamada a la API
        let count: number = 0;

        while (count < 100 /*this.limit*/) {
            // Obtenemos los nombres de los héroes
            //this.store.dispatch(loadNamesSuccess());
            this.marvelService.getAllNames(count.toString()).subscribe((names: string[]) => {

                // Añadimos los nombres de los personajes al store
                this.store.dispatch(loadNamesSuccess({ names: names }));

                // Añadimos los nombres de los personajes al array
                this.namesOpt = this.namesOpt.concat(names as string[]);
            });

            count += 100;
        }
    }

    // Método para obtener un héroe en concreto a través del servicio de Marvel refiriendo su ID
    getHeroById = async (id: number) => {
        if (id > 0) {
            this.hero$ = await this.marvelService.getHeroById(id)
                .subscribe((hero: any) => {
                    // Añadimos los datos del personaje al store
                    this.store.dispatch(loadHeroSuccess({ heroes: hero }));
                });
        } else {
            return;
        }
    }

    // Método para dinamizar el filtrado de los nombres de los personajes
    onFilter = (name: string) => {
        if (name !== '') {
            // Actualizamos el valor del input de búsqueda a través del controlador
            name.toLowerCase();
            //this.subjectKeyDown.next(name);
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
            return this.marvelService.getHero(name)
                .pipe((
                    debounceTime(600)),
                    distinctUntilChanged(),
                ).subscribe((hero: Result[]) => {

                    // Cargamos la información en el store
                    this.store.dispatch(loadHeroSuccess({ heroes: hero }));
                });
        } else {
            return this.marvelService.getHero(event.target.value)
                .pipe((
                    debounceTime(600)),
                    distinctUntilChanged(),
                ).subscribe((hero: Result[]) => {

                    // Enviamos la información al store
                    this.store.dispatch(loadHeroSuccess({ heroes: hero }));
                });
        }
    }
}
