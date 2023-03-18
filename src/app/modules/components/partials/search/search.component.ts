/*
* Este componente implementa la funcionalidad de búsqueda de personajes.
* Usa los servicios de conexión a la API de Marvel y de compartir datos entre componentes.
* Implementa lógica para el autocompletado de las opciones de búsqueda.
* igualmente, pasa a los servicios de la API los parámetros opcionales para la búsqueda.
*Para evitar saturar la API, solo re realizará la búsqueda al presionar el icono de búsqueda o enter.
*/

import { Component, OnInit, OnDestroy } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, map, startWith } from 'rxjs/operators';

// Formularios
import { FormControl } from '@angular/forms';

// Importamos los modelos de interfaces
import { Result } from 'src/app/core/interfaces/marvelResponseModel';
// Importamos el servicio para obtener los datos de los personajes
import { DataService } from 'src/app/services/data.service';
import { MarvelService } from 'src/app/services/marvel.service';

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
    heroes: Observable<Result[]> = new Observable();
    heroId: Observable<number> = new Observable();

    // Controlamos el incio de las llamadas a la API
    private subjectKeyDown = new Subject<any>();


    constructor(private marvelService: MarvelService, private dataService: DataService) { }

    ngOnInit(): void {

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
    }

    ngOnDestroy(): void {
        this.subjectKeyDown.unsubscribe();
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

        // Controlamos el fin de la llamada a la API
        this.isLoading = false;
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
            //this.subjectKeyDown.next(name);
        } else {
            return;
        }
    }

    showFilter = (opt: string) => {
        return opt ? opt : '';
    }

    onChange = (event: any, name?: string) => {

        // Llamar al método para obtener los datos del personaje:
        // Si el usuario entra un nombre, realiza la búsqueda de forma automática
        // Si el usuario selecciona un nombre de la lista de sugerencias, realiza la búsqueda al presionar el icono de búsqueda
        // Si el usuario presiona enter, realiza la búsqueda
        if (name !== undefined) {
            console.log('existe');
            this.heroes = this.marvelService.getHero(name)
                .pipe((
                    debounceTime(600)),
                    distinctUntilChanged(),
                ).subscribe((hero: any) => {
                    this.heroes = hero;

                    // Enviamos los datos del personaje al servicio de datos
                    this.dataService.setHero(hero);
                });
        } else {
            this.heroes = this.marvelService.getHero(event.target.value)
                .pipe((
                    debounceTime(600)),
                    distinctUntilChanged(),
                ).subscribe((hero: any) => {
                    this.heroes = hero;

                    // Enviamos los datos del personaje al servicio de datos
                    this.dataService.setHero(hero);
                });
        }
    }
}
