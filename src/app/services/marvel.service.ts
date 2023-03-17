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
import { Response, Data, Result, StoriesItem } from '../core/interfaces/marvelResponseModel';
import { MarvelCache } from '../core/interfaces/marvelCacheModel';

// Variables de entorno
import { environment } from '../../environments/environment';
import { CharacterList, CharacterSummary, Comic, ComicDataWrapper, ComicDate } from '../core/interfaces/marvelComicResponse';
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

    // Límite de héroes según la Api de Marvel
    private namesLimit: number = 1562;

    cache: MarvelCache = {
        names: [],
        characters: undefined,
        comics: undefined,
        stories: undefined,
    };

    constructor(private http: HttpClient) { }

    // Método para obtener una lista con nombres de personajes que se usa para el autocomplete
    getAllNames = (offset: string): Observable<string[]> => {

        // Comprobamos si ya tenemos los datos en caché
        if (this.cache.names !== undefined && this.cache.names.length === this.namesLimit) {
            return of(this.cache.names);
        }

        // Construimos la URL para la peteción a la API
        let url = `${this.url}characters?limit=100&offset=${offset}ts=1&apikey=${this.apiKey}&hash=${this.hash}`;

        // Realizamos la llamada a la API
        return this.http.get<Response>(url)
            .pipe(map(response => {

                // Solo ejecutamos el método si la respuesta es correcta
                if (response.status === 'Ok') {

                    // Añadimos los datos a la caché
                    response.data.results.map((character: Result) => {
                        if (!this.cache.names?.includes(character.name)) {
                            this.cache.names?.push(character.name);
                        }
                    });

                    // Si obtenemos una respuesta correcta, devolvemos los datos. Mediante map iteramos por todos los resultados y obtenemos el nombre de cada personaje. Lo devolveremos en forma de array
                    return response.data.results.map((character: Result) => character.name);
                } else {
                    throw new Error('Lo siento, no hemos podido obtener los datos');
                }
            }));
    }

    getName = (heroName: string): string | any => {
        if (heroName.length === 0) {
            return of([]);
        }

        // Comprobamos si ya tenemos los datos en caché
        if (this.cache.characters) {
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

        // Descargamos la cantidad de peticiones innecesarias
        if (heroName === null || heroName === ' ') {
            return undefined;
        }

        // // Formateamos el nombre del personaje para evitar errores en la búsqueda
        const words = heroName.split(' ');
        heroName = words.map((word: string) => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');

        // // Comprobamos la memoria caché
        if (this.cache.characters?.map((character: Result) => character.name.toLowerCase()).includes(heroName.toLowerCase())) {
            return of(this.cache.characters?.find((character: Result) => character.name.toLowerCase().includes(heroName.toLowerCase())));
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
                    if (!this.cache.characters?.map((character: Result) => character.name.toLowerCase()).includes(character.name.toLowerCase())) {
                        this.cache.characters?.push(character);
                    }
                });

                // Parseamos la fecha a un formato legible
                response.data.results[0].modified = new Date(response.data.results[0].modified).toLocaleDateString();

                // Si obtenemos una respuesta correcta, devolvemos los datos
                return response.data.results;
            } else {
                throw new Error('Lo siento, no hemos podido obtener los datos');
            }
        }));
    }

    getHeroById = (heroId: number): Observable<Result[]> | any => {

        // Comprobamos la memoria caché
        if (this.cache.characters?.forEach((character: Result) => {
            return character.id === heroId;
        })) {
            return of(this.cache.characters?.find((character: Result) =>
                character.id === heroId));
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
                    if (!this.cache.characters?.map((character: Result) => character.id === heroId)) {
                        this.cache.characters?.push(character);
                    }
                });

                // Parseamos la fecha a un formato legible
                response.data.results[0].modified = new Date(response.data.results[0].modified).toLocaleDateString();

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
                return response.data.results;

            } else {
                throw new Error('Lo siento, no hemos podido obtener los datos');
            }
        }));
    }

    getComics = (heroId: number): Observable<Comic[]> | any => {

        // Comprobamos la memoria caché, en este caso es algo más complejo que los anteriores. Debemos comprobar que el personaje está en el cómic, para ello comprobamos si el ID del personaje aparece en la lista de personajes del cómic
        if (this.cache.comics?.map((comic: Comic) => comic.characters.items.map((character: CharacterSummary) => character.resourceURI).includes(`${this.url}characters/${heroId}`))) {
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

                // Parseamos la fecha a un string
                let comics = response.data.results;

                comics.forEach((comic: Comic) => {

                    // Formateador de fechas
                    const dateFormatter = new Intl.DateTimeFormat('es-ES', {
                        dateStyle: 'medium',
                    });

                    comic.dates[0].date = dateFormatter.format(new Date(comic.dates[0].date));
                });

                // Devolvemos el objeto con las fechas parseadas
                return comics;
            } else {
                throw new Error('Lo siento, no hemos podido obtener los datos');
            }
        }));
    }

    getFilteredComics = (heroId: number, filter: string): Observable<Comic[]> | any => {

        // Comprobamos la memoria caché, en este caso es algo más complejo que los anteriores. Debemos comprobar que el personaje está en el cómic, para ello comprobamos si el ID del personaje aparece en la lista de personajes del cómic
        if (this.cache.comics?.map((comic: Comic) => comic.characters.items.map((character: CharacterSummary) => character.resourceURI).includes(`${this.url}characters/${heroId}`))) {
            return of(this.cache.comics?.filter((comic: Comic) => comic.characters.items.map((character: CharacterSummary) => character.resourceURI).includes(`${this.url}characters/${heroId}`)));
        }

        // Si el cómic no está en caché, obtenemos los datos de la API de Marvel
        // Generamos la URL para la petición a la API
        let url = `${this.url}characters/${heroId}/comics?&ts=1&apikey=${this.apiKey}&hash=${this.hash}&format=${filter}`;

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

                // Parseamos la fecha a un string
                let comics = response.data.results;

                comics.forEach((comic: Comic) => {

                    // Formateador de fechas
                    const dateFormatter = new Intl.DateTimeFormat('es-ES', {
                        dateStyle: 'medium',
                    });

                    comic.dates[0].date = dateFormatter.format(new Date(comic.dates[0].date));
                });

                // Devolvemos el objeto con las fechas parseadas
                return comics;
            } else {
                throw new Error('Lo siento, no hemos podido obtener los datos');
            }
        }));
    }
}
