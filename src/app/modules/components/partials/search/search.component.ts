/*
* Este componente implementa la funcionalidad de búsqueda de personajes.
* Usa los servicios de conexión a la API de Marvel y de compartir datos entre componentes.
* Implementa lógica para el autocompletado de las opciones de búsqueda.
* igualmente, pasa a los servicios de la API los parámetros opcionales para la búsqueda.
*/

import { Component, OnInit, OnDestroy } from '@angular/core';
import { Observable, Subject, of } from 'rxjs';
import { debounceTime, distinctUntilChanged, map, startWith, switchMap } from 'rxjs/operators';

// Formularios
import { FormControl } from '@angular/forms';

// Importamos los modelos de interfaces
import { Result } from 'src/app/core/interfaces/marvelResponseModel';
// Importamos el servicio para obtener los datos de los personajes
import { DataService } from 'src/app/services/data.service';
import { MarvelService } from 'src/app/services/marvel.service';
import { SearchCache } from 'src/app/core/interfaces/pageCacheModel';

@Component({
    selector: 'app-search',
    templateUrl: './search.component.html',
    styleUrls: ['./search.component.sass']
})
export class SearchComponent implements OnInit, OnDestroy {

    // Control de animación del icono de búsqueda
    isHovered: boolean = false;

    // Observable para almacenar los nombres de los personajes
    namesOpt?: Observable<string[]>;

    // Observable para almacenar los nombres de los personajes filtrados
    filteredNames?: Observable<string[]>;

    // Controlador para el input de búsqueda
    search: FormControl = new FormControl('');

    // Variable para almacenar el valor del input de búsqueda
    heroName: string = '';

    // Observable para almacenar los datos del personaje retornados por la API
    hero?: Observable<Result>;
    heroId?: number;

    // String para implementar la búsqueda filtrada
    options?: string[];

    // Controlamos el incio de las llamadas a la API
    private subjectKeyUp = new Subject<any>();

    // Caché última búsqueda
    private cache: SearchCache = {} as SearchCache;


    constructor(private marvelService: MarvelService, private dataService: DataService) { }

    ngOnInit(): void {

        this.cache = this.dataService.cache ? this.dataService.cache : {} as SearchCache;

        this.restoreSearch();

        // Comprobamos si el usuario ha introducido un valor en el input de // búsqueda y añadimos condiciones para gestionar las llamadas a la API
        this.subjectKeyUp.pipe((
            debounceTime(600),

            // Solo actualiza el valor si cambia
            distinctUntilChanged((prev, next) => prev === next)),
        ).subscribe((value) => {
            // Comprobamos si el valor introducido por el usuario es un string vacío
            if (value === '') {
                // Si el valor es un string vacío, no hacemos nada
                return;
            } else {
                // Si el valor no es un string vacío, obtenemos los datos del personaje
                this.getHero(value);

                // Compartimos los datos del personaje con el componente padre
                this.dataService.setHero(this.hero as unknown as Result);

                // Guardamos la cache
                if (this.heroId !== undefined) {
                    this.cache.id = this.heroId;
                    console.log(this.cache);
                }
            }
        });

        // Reinicializamos el observable con los nombres de los personajes
        this.filteredNames = this.namesOpt;

        // Filtramos los nombres de los personajes
        this.filteredNames = this.search.valueChanges
            .pipe(startWith(''),
                map(value => this._filter(value))
            );

        // Obtenemos la ID del personaje
        this.dataService.getHero().subscribe(hero => {
            this.heroId = hero.id;
            // Descomentar para testar
            // console.log(hero.id);
        });
    }

    ngOnDestroy(): void {
        this.subjectKeyUp.unsubscribe();
        this.dataService.cache = this.cache;
    }

    // Controlador para el input de búsqueda
    private _filter = (value: string): any => {
        // Convertimos el valor a minúsculas para que no haya problemas con los nombres introducidos por el usuario
        const filterValue = value.toLowerCase();

        // // Filtramos los nombres de los personajes
        this.getNames(filterValue);
        return this.options?.filter(option => option.toLowerCase().includes(filterValue));

    }

    // Método para obtener los nombres de los héroes a través del servicio de Marvel
    getNames = async (name: string) => {

        if (name !== '') {
            // Obtenemos los nombres de los héroes
            this.namesOpt = await this.marvelService.getName(name).subscribe((names: string[]) => {
                this.options = names as string[];
                // Uncoment to test
                //console.log(names);
            });
            this.subjectKeyUp.next(name);
        }

    }

    getHero = async (name: string) => {
        if (name !== '') {
            this.hero = await this.marvelService.getHero(name)
                .subscribe((hero: any) => {
                    this.hero = hero;

                    // Uncoment to test
                    // console.log(hero);
                });
        } else {
            return;
        }
    }

    getHeroById = async (id: number) => {
        if (id > 0) {
            this.hero = await this.marvelService.getHeroById(id)
                .subscribe((hero: any) => {
                    this.hero = hero;

                    // Uncoment to test
                    // console.log(hero);
                });
        } else {
            return;
        }
    }

    onSearch = (name: string) => {

        if (name !== '') {
            // Obtenemos el personaje
            name.toLowerCase;
            // Uncoment to test
            // console.log(name);

            // Controlamos el inicio de la llamada a la API
            this.subjectKeyUp.next(name);
        } else {
            return;
        }
    }

    restoreSearch = () => {
        console.log(`trying to restore search with id: ${this.cache.id}`);
        if (this.cache.id > 0) {
            this.getHeroById(this.cache.id);
        }
    }
}
