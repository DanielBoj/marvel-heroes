/*  Servicio principal de la APP.
Contiene los métodos para realizar las peticiones HTTP a la API de Marvel
*/

import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';

// Módulo para realizar las peticiones HTTP
import { HttpClient } from '@angular/common/http';

// Interfaces
import { Response, Data, Result, StoriesItem } from '../core/interfaces/marvelResponseModel';
import { MarvelCache } from '../core/interfaces/marvelCacheModel';

// Variables de entorno
import { environment } from '../../environments/environment';
import { CharacterSummary, Comic, ComicDataWrapper } from '../core/interfaces/marvelComicResponse';
import { Story, StoryDataWrapper } from '../core/interfaces/marvelStoriesResponse';


@Injectable({
    providedIn: 'root'
})
export class MarvelService {

    private url: string = environment.apiUrl;
    private apiKey: string = environment.apiKey;
    private hash: string = environment.hash;

    // Opciones para filtrar las peticiones de búsqueda
    private opts = {
        heroOpts: [
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

    // Caché para almacenar los datos de forma interna en la aplicación
    cache: MarvelCache = {
        names: [],
        characters: undefined,
        comics: undefined,
        stories: undefined,
    };

    constructor(private http: HttpClient) { }


    // Método para cargar las listas de nombres candidatos
    getName = (heroName: string): Observable<string[]> => {
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

    // Método para obtener los datos de un personaje en concreto según su nombre
    getHero = (heroName: string): Observable<Result[]> => {

        // Descargamos la cantidad de peticiones innecesarias
        if (heroName === null) {
            return of([]);
        }

        // // Formateamos el nombre del personaje para evitar errores en la búsqueda
        const words = heroName.split(' ');
        heroName = words.map((word: string) => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');

        // // Comprobamos la memoria caché
        if (this.cache.characters?.map((character: Result) => character.name.toLowerCase()).includes(heroName.toLowerCase())) {
            return of(this.cache.characters?.find((character: Result) => character.name.toLowerCase().includes(heroName.toLowerCase())) as any);
        }

        // Si no, obtenemos los datos de la API de Marvel
        // Construimos la URL para la peteción a la API
        let url = `${this.url}characters?nameStartsWith=${heroName}&ts=1&apikey=${this.apiKey}&hash=${this.hash}`;

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
                response.data.results.forEach((character: Result) => {
                    character.modified = new Date(character.modified).toLocaleDateString();
                });

                // Si obtenemos una respuesta correcta, devolvemos los datos
                return response.data.results;
            } else {
                throw new Error('Lo siento, no hemos podido obtener los datos');
            }
        }));
    }

    // Método para obtener los datos de un personaje en concreto a través de su ID
    getHeroById = (heroId: string): Observable<Result[]> => {

        // Comprobamos la memoria caché
        if (this.cache.characters?.forEach((character: Result) => {
            return character.id === Number(heroId);
        })) {
            return of(this.cache.characters?.find((character: Result) =>
                character.id === Number(heroId)) as any);
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
                    if (!this.cache.characters?.map((character: Result) => character.id === Number(heroId))) {
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

    // Método para obtener las historias de un personaje en concreto
    getHeroStories = (heroId: string): Observable<Story[]> => {

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

    // Método para obtener los cómics en los que aparece un personaje en concreto
    getComics = (heroId: string): Observable<Comic[]> => {

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

                    try {
                        comic.dates[0].date = dateFormatter.format(new Date(comic.dates[0].date));
                    } catch (e) {
                        console.log(e);
                    }

                });

                // Devolvemos el objeto con las fechas parseadas
                return comics;
            } else {
                throw new Error('Lo siento, no hemos podido obtener los datos');
            }
        }));
    }

    // Método para obtener los cómics en los que aparece un personaje en concreto filtrados segun el tipo de cómic
    getFilteredComics = (heroId: string, filter: string): Observable<Comic[]> => {
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

                // Parseamos la fecha a un string
                let comics = response.data.results;

                comics.forEach((comic: Comic) => {

                    // Formateador de fechas
                    const dateFormatter = new Intl.DateTimeFormat('es-ES', {
                        dateStyle: 'medium',
                    });

                    try {
                        comic.dates[0].date = dateFormatter.format(new Date(comic.dates[0].date));
                    } catch (e) {
                        console.log(e);
                    }
                });

                // Devolvemos el objeto con las fechas parseadas
                return comics;
            } else {
                throw new Error('Lo siento, no hemos podido obtener los datos');
            }
        }));
    }
}
