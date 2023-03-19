/* Esta interface define el modelo de la petición que se realiza a la API de Marvel */

export interface MarvelRequestOptions {
    limit: number; // Número de elementos a devolver
    offset: number; // Número de elementos a saltar
    orderBy?: string; // Orden de los elementos
    nameStartsWith?: string; // Nombre del personaje a buscar
    titleStartsWith?: string; // Nombre del comic a buscar
}

export type Category = 'characters' | 'comics' | 'creators' | 'events' | 'series' | 'stories'; // Tipos de categorías de la API de Marvel
