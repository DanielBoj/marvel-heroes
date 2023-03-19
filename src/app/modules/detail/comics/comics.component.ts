import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, Subject } from 'rxjs';
import { map, startWith } from 'rxjs/operators';

// Importamos los modelos de interfaces
import { Comic } from 'src/app/core/interfaces/marvelComicResponse';

// Servicio para realizar las llamadas a la API
import { MarvelService } from 'src/app/services/marvel.service';

// Importamos el store de NgRx para el modelos reactivos
import { Store } from '@ngrx/store';
import { loadComicsSuccess } from 'src/app/state/actions/heroes.actions';
import { AppState } from 'src/app/state/app.state';
import { selectHeroIdValue, selectListComics } from 'src/app/state/selectors/heroes.selectors';



@Component({
    selector: 'app-comics',
    templateUrl: './comics.component.html',
    styleUrls: ['./comics.component.sass']
})
export class ComicsComponent implements OnInit {

    // Capturamos el ID del personaje de la URL
    heroId$: number = 0;

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
    comics$: Observable<readonly Comic[]> = new Observable();

    // Control de respuesta sin resultados
    areNoResults: boolean = false;

    constructor(private marvelService: MarvelService,
        private activatedRoute: ActivatedRoute,
        private router: Router,
        private store: Store<AppState>) {

        // Capturamos el parámetro de la URL
        // this.getIdFromParams();
        // Cargamos los parámetros de filtrado
        this.filterOpts = [
            'None',
            'comic',
            'magazine',
            'trade paperback',
            'hardcover',
            'digest',
            'graphic novel',
            'digital comic',
            'infinite comic'
        ]
    }

    ngOnInit(): void {
        // Cargamos el Id del héroe dsesde el store. Hay que parsearlo para poderlo usar
        this.store.select(selectHeroIdValue).forEach((heroId: number) => {
            this.heroId$ = heroId;
        });

        // Para que no se filtre nada al cargar la página
        this.filter.defaultValue;

        // Cargamos los cómics
        if (this.heroId$ !== 0) {
            this.getComics(this.heroId$);
        }
        this.comics$ = this.store.select(selectListComics);

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
        // Realizamos la llamada a la API y subimos el resultado al store
        await this.marvelService.getComics(heroId).subscribe(
            (comics: Comic[]) => {
                // Cargamos la información en el store
                this.store.dispatch(loadComicsSuccess({ comics: comics }));
            }
        )
    }

    // Método para obtener todos los cómics relacionados con un héroe a través de la id de este llamando a la API y filtrados por el tipo de cómic
    getFilteredComics = async (heroId: number, filter: string) => {

        // Realizamos la llamada a la API y subimos el resultado al store
        await this.marvelService.getFilteredComics(heroId, filter).subscribe(
            (comics: Comic[]) => {
                if (comics.length === 0) {
                    return this.areNoResults = true;
                }

                // Cargamos la información en el store
                this.areNoResults = false;
                return this.store.dispatch(loadComicsSuccess({ comics: comics }));
            }
        );
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
            this.getFilteredComics(this.heroId$, event.target.value);
            // Obtenemos el resultado de la store
            this.comics$ = this.store.select(selectListComics);
        } else {

            // Llamamos a la API y cargamos los datos en el store
            this.getComics(this.heroId$);
            // Obtenemos los datos del store
            this.comics$ = this.store.select(selectListComics);
        }
    }
}
