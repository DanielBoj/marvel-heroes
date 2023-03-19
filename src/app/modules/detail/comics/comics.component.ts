/* Implementa las funcionalidades para cargar y mostrar los cómics protagonizados por un personaje y para poderlos filtrar por tipo. */

import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';

// Interfaces
import { Comic } from 'src/app/core/interfaces/marvelComicResponse';

// Importamos el store de NgRx para el modelos reactivos
import { Store } from '@ngrx/store';
import * as heroesActions from 'src/app/state/actions/heroes.actions';
import * as heroesSelectors from 'src/app/state/selectors/heroes.selectors';
import { AppState } from 'src/app/state/app.state';

// Tipos de cómics
import { ComicTypes } from 'src/app/core/types/filter.opts';




@Component({
    selector: 'app-comics',
    templateUrl: './comics.component.html',
    styleUrls: ['./comics.component.sass']
})
export class ComicsComponent implements OnInit {

    // Capturamos el ID del personaje de la URL
    heroId: number = 0;

    // Gestor para la animación del icono
    isHovered: boolean = false;

    dateTitle: string = 'Publication Date';

    // Gestión del filtrado de cómics
    // Lista de los valores de filtrado permitidos
    filterOpts: string[] = [];
    filteredOpts$: Observable<string[]> = new Observable();

    // Controlador para el input de filtrado
    filter: FormControl = new FormControl('');

    // Objeto para almacenar los cómics
    comics$: Observable<Comic[]> = new Observable();

    // Control de respuesta sin resultados y carga de datos
    areNoResults: boolean = false;
    // Carga de estados iniciales
    loading$: Observable<boolean> = new Observable();



    constructor(
        private router: Router,
        private store: Store<AppState>
    ) { }

    ngOnInit(): void {

        // Carga de estados iniciales
        this.loading$ = this.store.select(heroesSelectors.selectLoadingComics);

        // Cargamos las opciones de tipo de cómic
        this.filterOpts = ComicTypes;

        // Cargamos el Id del héroe dsesde el store. Hay que parsearlo para poderlo usar
        this.setHeroId();

        // Para que no se filtre nada al cargar la página
        this.filter.defaultValue;

        // Cargamos los cómics
        if (this.heroId !== 0) {
            this.getComics(this.heroId);
        }
        this.comics$ = this.store.select(heroesSelectors.selectListComics);

        // Filtramos los valores de filtrado
        this.filteredOpts$ = this.filter.valueChanges.pipe(
            startWith(''),
            map(value => this._filter(value))
        );
    }

    /* Controlador */
    // Función para filtrar los valores de filtrado
    private _filter(value: string): string[] {
        // Convertimos los valores a minúsculas para evitar errores
        const filterValue: string = value.toLowerCase();

        return this.filterOpts.filter(option => option.toLowerCase().includes(filterValue));
    }

    /* Métodos */

    // Método para obtener todos los cómics relacionados con un héroe a través de la id de este llamando a la API
    getComics = async (heroId: number) => {

        // Cambiamos el tipo de dato
        const idString = heroId.toString();

        // Cargamos los datos en desde la API en el store
        this.store.dispatch(heroesActions.loadComics({ id: idString }))
    }

    // Método para obtener todos los cómics relacionados con un héroe a través de la id de este llamando a la API y filtrados por el tipo de cómic
    getFilteredComics = async (heroId: number, filter: string) => {

        // Cambiamos el tipo de dato
        const idString = heroId.toString();

        // Cargamos los datos en el store desde la API
        this.store.dispatch(heroesActions.loadComicsByType({ id: idString, opt: filter }));
    }

    // Método para navegar a la página de detalle de Marvel un cómic
    checkComic = (url: string) => {
        this.router.navigate([`${url}`]);
    }

    // Muestra el input de filtrado
    showFilter = (opt: string) => {
        return opt ? opt : '';
    }

    // Método para controlar el valor de filtrado para obtener los cómics según este
    onFilter = (filter: string) => {
        if (filter === '') {
            return;
        }

        // Obtenemos el filtro
        filter.toLowerCase();
    }

    // Método para actualizar el valor de filtrado y obtener los cómics según este
    onSearch = (event: any) => {
        // Obtenemos el filtro en minúsculas para evitar errores
        event.target.value.toLowerCase();

        // Realizamos la carga de datos en el motor de busqueda: Si el filtro es none o vacío, cargamos todos los cómics
        if (this.filterOpts.includes(event.target.value) && event.target.value !== 'none') {

            // Llamamos a la API y cargamos los datos en el store
            this.getFilteredComics(this.heroId, event.target.value);

            // Obtenemos el resultado de la store
            this.comics$ = this.store.select(heroesSelectors.selectListComics);
        } else {

            // Llamamos a la API y cargamos los datos en el store
            this.getComics(this.heroId);

            // Obtenemos los datos del store
            this.comics$ = this.store.select(heroesSelectors.selectListComics);
        }
    }

    // Método para cargar la id del héroe desde el store
    setHeroId = () => {

        //Obtenemos el valor del store
        this.store.select(heroesSelectors.selectHeroIdValue).forEach((heroId: number) => this.heroId = heroId);
    }
}
