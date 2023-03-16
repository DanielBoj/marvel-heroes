/*
* Servicio principal de la APP.
* Contiene los métodos para realizar las peticiones HTTP a la API de Marvel
*/

import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';

// Módulo para realizar las peticiones HTTP
import { HttpClient } from '@angular/common/http';

// Interfaces
import { ImageThumbnail, ImageVariant } from '../core/interfaces/marvelImageModel';
import { MarvelRequestOptions, Category } from '../core/interfaces/marvelRequestModel';
import { Response, Data, Result, MarvelCache, StoriesItem } from '../core/interfaces/marvelResponseModel';

// Variables de entorno
import { environment } from '../../environments/environment';
import { CharacterList, CharacterSummary, Comic, ComicDataWrapper } from '../core/interfaces/marvelComicResponse';
import { Story, StoryDataWrapper } from '../core/interfaces/marvelStoriesResponse';



@Injectable({
    providedIn: 'root'
})
export class MarvelService {

    private url: string = environment.apiUrl;
    private apiKey: string = environment.apiKey;
    private hash: string = environment.hash;

    // Opciones de búsqueda
    private opts = {
        heroOpts: [
            'limit=1',
            'orderBy=name',
        ],
        nameOpts: [
            'limit=100',
            'orderBy=name',
        ],
        allOpts: [
            'limit=100',
            'orderBy=name'
        ],
        storyOpts: [
            'limit=5',
            'orderBy=modified'
        ],
        comicOpts: [
            'limit=100',
            'orderBy=-onsaleDate'
        ]
    }


    cache: MarvelCache = {
        characters: undefined,
        comics: undefined,
        stories: undefined,
    };

    constructor(private http: HttpClient) { }

    // Método para obtener la URL de la imagen
    getImage = (thumbnail: ImageThumbnail, variant: ImageVariant = ImageVariant.full) => {
        return thumbnail && `{thumbnail.path}/${variant}.${thumbnail.extension}`;
    }

    // Método para obtener una lista con nombres de personajes que se usa para el autocomplete
    getName = (heroName: string): string[] | any => {
        if (heroName.length === 0) {
            return of([]);
        }

        // Comprobamos si ya tenemos los datos en caché
        if (this.cache.characters) {
            console.log('In cache');
            return of(this.cache.characters.map((character: Result) => character.name));
        }

        // // Construimos la URL para la peteción a la API
        let url = `${this.url}characters?nameStartsWith=${heroName}&ts=1&apikey=${this.apiKey}&hash=${this.hash}`;

        // Añadimos las opciones de búsqueda
        if (this.opts.nameOpts) {
            this.opts.nameOpts.forEach((option: string) => {
                url += `&${option}`;
            });
        }

        return this.http.get<Response>(url)
            .pipe(map(response => {

                // Solo ejecutamos el método si la respuesta es correcta
                if (response.status === 'Ok') {

                    // Cargamos datos en el cache
                    this.cache.characters = response.data.results;

                    // Si obtenemos una respuesta correcta, devolvemos los datos
                    return response.data.results.map((character: Result) => character.name);
                } else {
                    throw new Error('Lo siento, no hemos podido obtener los datos');
                }
            }));
    }

    // Método que permite obtener todos los personajes permitidos por una llamada a la API
    getAllCharacters = (options?: string[]): Observable<Result> | any => {

        // // Comprobamos la memoria caché para ver si ya tenemos los datos de los personajes
        if (this.cache.characters) {
            console.log('In cache');
            return of(this.cache.characters);
        }

        // Construimos la URL para la peteción a la API
        let url = `${this.url}characters?ts=1&apikey=${this.apiKey}&hash=${this.hash}`;

        // Añadimos las opciones de búsqueda
        if (this.opts.allOpts) {
            this.opts.allOpts.forEach((option: string) => {
                url += `&${option}`;
            });
        }

        // Obtenemos los datos de la API de Marvel
        return this.http.get<Response>(url).pipe(map((response: Response) => {

            // Solo ejecutamos el método si la respuesta es correcta
            if (response.status === 'Ok') {

                // Controlamos el caché
                this.cache.characters = response.data.results;

                // Si obtenemos una respuesta correcta, devolvemos los datos
                return response.data.results;

                // Si obtenemos una respuesta incorrecta, lanzamos un error
            } else {
                throw new Error('Lo siento, no hemos podido obtener los datos');
            }
        }
        ));
    }

    // Método para obtener los datos de un personaje en concreto
    getHero = (heroName: string): Observable<Result> | any => {

        if (heroName.length < 2) {
            return;
        }


        // Formateamos el nombre del personaje para evitar errores en la búsqueda
        const words = heroName.split(' ');
        heroName = words.map((word: string) => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');

        // Comprobamos la memoria caché
        if (this.cache.characters?.map((character: Result) => character.name).includes(heroName)) {
            console.log('In cache');
            return of(this.cache.characters?.find((character: Result) => character.name === heroName));
        }

        // Si no, obtenemos los datos de la API de Marvel
        // Construimos la URL para la peteción a la API
        let url = `${this.url}characters?&nameStartsWith=${heroName}&ts=1&apikey=${this.apiKey}&hash=${this.hash}`;

        // Añadimos las opciones de búsqueda
        if (this.opts.heroOpts) {
            this.opts.heroOpts.forEach((option: string) => {
                url += `&${option}`;
            });
        }

        // Obtenemos los datos de la API de Marvel
        return this.http.get<Response>(url).pipe(map((response: Response) => {

            // Solo ejecutamos el método si la respuesta es correcta
            if (response.status === 'Ok') {

                // Controlamos el caché
                response.data.results.forEach((character: Result) => {
                    if (!this.cache.characters?.map((character: Result) => character.name).includes(character.name)) {
                        this.cache.characters?.push(character);
                    }
                });

                // Si obtenemos una respuesta correcta, devolvemos los datos
                return response.data.results;
            } else {
                throw new Error('Lo siento, no hemos podido obtener los datos');
            }
        }));
    }

    getHeroById = (heroId: number): Observable<Result> | any => {

        // Comprobamos la memoria caché
        if (this.cache.characters?.map((character: Result) => character.id === heroId)) {
            console.log('In cache');
            return of(this.cache.characters?.find((character: Result) => character.id === heroId));
        }

        // Si no, obtenemos los datos de la API de Marvel
        // Construimos la URL para la peteción a la API
        let url = `${this.url}characters/${heroId}?&ts=1&apikey=${this.apiKey}&hash=${this.hash}`;

        // Añadimos las opciones de búsqueda
        if (this.opts.heroOpts) {
            this.opts.heroOpts.forEach((option: string) => {
                url += `&${option}`;
            });
        }

        // Obtenemos los datos de la API de Marvel
        return this.http.get<Response>(url).pipe(map((response: Response) => {

            // Solo ejecutamos el método si la respuesta es correcta
            if (response.status === 'Ok') {

                // Controlamos el caché
                response.data.results.forEach((character: Result) => {
                    if (!this.cache.characters?.map((character: Result) => character.name).includes(character.name)) {
                        this.cache.characters?.push(character);
                    }
                });

                // Si obtenemos una respuesta correcta, devolvemos los datos
                return response.data.results;
            } else {
                throw new Error('Lo siento, no hemos podido obtener los datos');
            }
        }));
    }

    getHeroStories = (heroId: number): Observable<Story[]> | any => {

        // Comprobamos la memoria caché
        if (this.cache.stories?.map((story: Story) => story.characters.items.map((item: CharacterSummary) => item.resourceURI).includes(`${this.url}characters/${heroId}`))) {
            console.log('In cache');
            return of(this.cache.stories?.filter((story: Story) => story.characters.items.map((item: CharacterSummary) => item.resourceURI).includes(`${this.url}characters/${heroId}`)));
        }

        // Si no, obtenemos los datos de la API de Marvel
        // Construimos la URL para la peteción a la API
        let url = `${this.url}characters/${heroId}/stories?&ts=1&apikey=${this.apiKey}&hash=${this.hash}`;

        // Añadimos las opciones de búsqueda
        if (this.opts.storyOpts) {
            this.opts.storyOpts.forEach((option: string) => {
                url += `&${option}`;
            });
        }

        // Obtenemos los datos de la API de Marvel
        return this.http.get<StoryDataWrapper>(url).pipe(map((response: any) => {

            // Solo ejecutamos el método si la respuesta es correcta
            if (response.status === 'Ok') {

                // Controlamos el caché
                response.data.results.forEach((story: Story) => {
                    if (!this.cache.stories?.map((story: Story) => story.id).includes(story.id)) {
                        this.cache.stories?.push(story);
                    }
                });


                // Si obtenemos una respuesta correcta, devolvemos los datos
                // Descomentar para testar
                // console.log(response.data.results);
                return response.data.results;

            } else {
                throw new Error('Lo siento, no hemos podido obtener los datos');
            }
        }));
    }

    getComics = (heroId: number): Observable<Comic[]> | any => {

        // Comprobamos la memoria caché, en este caso es algo más complejo que los anteriores. Debemos comprobar que el personaje está en el cómic, para ello comprobamos si el ID del personaje aparece en la lista de personajes del cómic
        if (this.cache.comics?.map((comic: Comic) => comic.characters.items.map((character: CharacterSummary) => character.resourceURI).includes(`${this.url}characters/${heroId}`))) {
            console.log('In cache');
            return of(this.cache.comics?.filter((comic: Comic) => comic.characters.items.map((character: CharacterSummary) => character.resourceURI).includes(`${this.url}characters/${heroId}`)));
        }

        // Si el cómic no está en caché, obtenemos los datos de la API de Marvel
        // Generamos la URL para la petición a la API
        let url = `${this.url}characters/${heroId}/comics?&ts=1&apikey=${this.apiKey}&hash=${this.hash}`;

        // Añadimos las opciones de búsqueda
        if (this.opts.comicOpts) {
            this.opts.comicOpts.forEach((option: string) => {
                url += `&${option}`;
            });
        }

        // Obtenemos los datos de la API de Marvel
        return this.http.get<ComicDataWrapper>(url).pipe(map((response: ComicDataWrapper) => {

            // Solo ejecutamos el método si la respuesta es correcta
            if (response.status === 'Ok') {

                // Controlamos el caché
                response.data.results.forEach((comic: Comic) => {
                    if (!this.cache.comics?.map((comic: Comic) => comic.id).includes(comic.id)) {
                        this.cache.comics?.push(comic);
                    }
                });

                // Si obtenemos una respuesta correcta, devolvemos los datos
                // Descomentar para testar
                // console.log(response.data.results);
                return response.data.results;
            } else {
                throw new Error('Lo siento, no hemos podido obtener los datos');
            }
        }));
    }

}
