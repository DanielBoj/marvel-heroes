/*
* Este componente implementa la funcionalidad de búsqueda de personajes.
* Usa los servicios de conexión a la API de Marvel y de compartir datos entre componentes.
* Implementa lógica para el autocompletado de las opciones de búsqueda.
* igualmente, pasa a los servicios de la API los parámetros opcionales para la búsqueda.
*Para evitar saturar la API, solo re realizará la búsqueda al presionar el icono de búsqueda o enter.
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
    namesOpt: string[] = new Array();
    // Total de personajes según la docu de Marvel
    limit: number = 1562;
    // Controlador de carga
    isLoading: boolean = true;

    // Observable para almacenar los nombres de los personajes filtrados
    filteredNames: Observable<string[]> = new Observable();

    // Controlador para el input de búsqueda
    search: FormControl = new FormControl();

    // Observable para almacenar los datos del personaje retornados por la API
    hero: Observable<Result> = new Observable();
    heroId: Observable<number> = new Observable();

    // String para implementar la búsqueda filtrada
    //options?: string[];

    // Controlamos el incio de las llamadas a la API
    private subjectKeyUp = new Subject<any>();

    // Caché última búsqueda
    private cache: SearchCache = {} as SearchCache;


    constructor(private marvelService: MarvelService, private dataService: DataService) { }

    ngOnInit(): void {

        this.cache = this.dataService.cache ? this.dataService.cache : {} as SearchCache;

        // Obtenemos los nombres de los personajes
        this.getNames();

        // Obtenemos los datos del personaje seleccionado del componente hijo
        if (this.dataService.getHeroId()) {

            // Obtenemos el ID del personaje
            this.heroId = this.dataService.getHeroId();

            // Obtenemos los datos del personaje
            this.getHeroById(Number(this.heroId));
        }


        // Filtramos los nombres de los personajes
        this.filteredNames = this.search.valueChanges
            .pipe(startWith(''),
                map(value => this._filter(value))
            );

        // Comprobamos si el usuario ha introducido un valor en el input de // búsqueda y añadimos condiciones para gestionar las llamadas a la API
        this.subjectKeyUp.pipe((
            debounceTime(600),

            // Solo actualiza el valor si cambia
            distinctUntilChanged()),
        ).subscribe((value) => {
            // Comprobamos si el valor introducido por el usuario es un string vacío
            if (value === '' || value === undefined || value === null || !this.namesOpt.map((name: string) => name.toLowerCase()).includes(value.toLowerCase())) {
                // Si el valor es un string vacío, no hacemos nada
                return;
            } else {
                //Si el valor no es un string vacío, actualizamos el nombre del héroe

                // Obtenemos los datos del personaje

                const hero = this.marvelService.getHero(value).subscribe((hero: any) => {
                    this.hero = hero;
                    let heroData: Result = {} as Result;

                    this.hero.forEach((hero: any) => {
                        heroData = hero;
                    });

                    // Compartimos los datos del personaje con el componente padre
                    this.dataService.setHero(heroData);

                    // Actualizamos el id del personaje
                    this.dataService.setHeroId(heroData.id);
                });
            }
        });
    }

    ngOnDestroy(): void {
        this.subjectKeyUp.unsubscribe();
        //this.dataService.cache = this.cache;
    }

    // Controlador para el input de búsqueda
    private _filter = (value: string): any => {
        // Convertimos el valor a minúsculas para que no haya problemas con los nombres introducidos por el usuario
        const filterValue = value.toLowerCase();

        // // Filtramos los nombres de los personajes
        return this.namesOpt.filter(option => option.toLowerCase().includes(filterValue));

    }

    // Método para obtener los nombres de los héroes a través del servicio de Marvel
    getNames = () => {
        // Controlamos el inicio de la llamada a la API
        let count: number = 0;

        while (count < 100 /*this.limit*/) {
            // Obtenemos los nombres de los héroes
            this.marvelService.getAllNames(count.toString()).subscribe((names: string[]) => {

                // Añadimos los nombres de los personajes a uan lista
                this.namesOpt = this.namesOpt.concat(names as string[]);

                // Uncoment to test
                // console.log(this.namesOpt);
            });
            count += 100;

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

    onFilter = (name: string) => {
        if (name !== '') {
            // Actualizamos el valor del input de búsqueda a través del controlador
            name.toLowerCase();
            this.subjectKeyUp.next(name);
        } else {
            return;
        }
    }

    showFilter = (opt: string) => {
        return opt ? opt : '';
    }
}
