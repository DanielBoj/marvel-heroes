/*
 * Esta interface define el modelo de la respuesta de la API de Marvel
 */

import { Comic } from "./marvelComicResponse";
import { Story } from "./marvelStoriesResponse";

export interface Response {
    attributionHTML: string; // Atribución HTML
    attributionText: string; // Atribución texto
    code: number; // Código de respuesta
    copyright: string; // Copyright
    data: Data; // Datos de la respuesta
    etag: string; // Etag
    status: string; // Estado de la respuesta
}

export interface Data {
    count: number; // Número de elementos devueltos
    limit: number; // Número de elementos solicitados
    offset: number; // Número de elementos saltados
    results: Result[]; // Resultados de la búsqueda
    total: number; // Número total de elementos
}

export interface Result {
    next(hero: Result): unknown;
    asObservable(): unknown;
    id: number; // Identificador del elemento
    name: string; // Nombre del elemento
    description: string; // Descripción del elemento
    modified: Date | string; // Fecha de modificación
    thumbnail: Thumbnail // Imagen del elemento
    resourceURI: string; // URL del elemento
    comics: Comics; // Comics en los que aparece el elemento
    series: Comics; // Series en las que aparece el elemento
    stories: Stories; // Historias en las que aparece el elemento
    events: Comics; // Eventos en los que aparece el elemento
    urls: URL[]; // URLs del elemento
}

export interface Comics {
    available: number; // Número de comics disponibles
    collectionURI: string; // URL de los comics
    items: ComicsItem[]; // Comics
    returned: number; // Número de comics devueltos
}

export interface ComicsItem {
    resourceURI: string; // URL del comic
    name: string; // Nombre del comic
}

export interface Stories {
    available: number; // Número de historias disponibles
    collectionURI: string; // URL de las historias
    items: StoriesItem[]; // Historias
    returned: number; // Número de historias devueltas
}

export interface StoriesItem {
    resourceURI: string; // URL de la historia
    name: string; // Nombre de la historia
    type: ItemType; // Tipo de historia
}

export enum ItemType {
    Cover = 'cover',
    Empty = '',
    InteriorStory = 'interiorStory',
}

export interface Thumbnail {
    path: string; // Path de la imagen
    extension: string; // Extensión de la imagen
}

export enum Extension {
    GIF = 'gif',
    JPG = 'jpg',
}

export interface URL {
    type: URLType // Tipo de URL
    url: string; // URL
}

export enum URLType {
    Comiclink = 'comiclink',
    Detail = 'detail',
    Wiki = 'wiki',
}

// export interface HeroData {
//     id: number; // Identificador del elemento
//     name: string; // Nombre del elemento
//     description: string; // Descripción del elemento
//     modified: Date | string; // Fecha de modificación
//     thumbnail: string // Imagen del elemento
//     resourceURI: string; // URL del elemento
//     comics: Array<any>; // Comics en los que aparece el elemento
//     series: Array<any>; // Series en las que aparece el elemento
//     stories: Array<any>; // Historias en las que aparece el elemento
//     events: Array<any>; // Eventos en los que aparece el elemento
//     urls: string; // URLs del elemento
// }
