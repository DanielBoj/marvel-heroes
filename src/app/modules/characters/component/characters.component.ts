import { Component, OnInit } from '@angular/core';
import { Subject, Observable } from 'rxjs';
import { concatMap, debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';

// Modelos de interfaces
import { Category, MarvelRequestOptions } from 'src/app/core/interfaces/marvelRequestModel';
import { ImageVariant } from 'src/app/core/interfaces/marvelImageModel';
import { Response, Data, Result } from 'src/app/core/interfaces/marvelResponseModel';
import { MarvelCache } from 'src/app/core/interfaces/marvelCacheModel';

// Servicio para obtener los datos de la API de Marvel
import { MarvelService } from 'src/app/services/marvel.service';
// Servicio para compartir los datos de los personajes
import { DataService } from 'src/app/services/data.service';
import { Router } from '@angular/router';



@Component({
    selector: 'app-characters',
    templateUrl: './characters.component.html',
    styleUrls: ['./characters.component.sass']
})
export class CharactersComponent implements OnInit {

    // Variables para el título y subtítulo de la página
    title = 'In times of despair...';
    subtitle = 'Search for your destined saviour!';

    // Observable para almacenar los personajes
    allCharacters?: Observable<Result> | any;

    // Variable para almacenar los datos de un personaje obtenidor por la API
    hero: Result = {} as Result;
    heroId?: number;

    // Opciones de la petición a la API
    options!: MarvelRequestOptions;


    // Manejador para las peticiones de búsqueda
    searchValue: string = '';


    // Inyectamos los servicios para trabajar con los datos de la API y compartir los datos de los personajes
    constructor(private marvelService: MarvelService, private dataService: DataService, private router: Router) { }

    // Método que se ejecuta al iniciar el componente
    ngOnInit(): void {

        // Obtenemos los datos del personaje seleccionado del componente hijo
        this.dataService.getHero().subscribe(hero => {
            this.hero = hero;
            this.heroId = hero.id
        });
    }

}
