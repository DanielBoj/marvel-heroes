import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';

// Interfaces
import { ImageThumbnail, ImageVariant } from '../core/interfaces/marvelImageModel';
import { MarvelRequestOptions, Category } from '../core/interfaces/marvelRequestModel';
import { MarvelResponseModel, MarvelData, MarvelCache } from '../core/interfaces/marvelResponseModel';

// Variables de entorno
import { environment } from '../../environments/environment';


@Injectable({
  providedIn: 'root'
})
export class MarvelService {

  constructor(private http: HttpClient) { }

  cache: MarvelCache = {};
  url: string = environment.apiUrl;
  apiKey: string = environment.apiKey;

  /**
   * Método para obtener la URI de la imagen
   *
   * @param thumbnail Objeto que contendrá las propiedades para el path y la extensión de la imagen
   * @param variant Parámetro de entrada -> Enumerador para definir el tamaño de la imagen
   * @returns URI de la imagen
   */
  getImage = (thumbnail: ImageThumbnail, variant: ImageVariant = ImageVariant.full) => {
    return thumbnail && `{thumbnail.path}/${variant}.${thumbnail.extension}`;
  }

  /**
   *
   *
   * @param category Contiene el recurso que queremos solicitar a la API
   * @param options Opciones para la búsqueda según los criterios de la API
   * @returns La respuesta de la API con la información de los personajes
   */
  getData = (category: Category, options?: MarvelRequestOptions): Observable => {

    // Si la información ya está en caché y no se has solicitado nuevos datos, se devuelve la información de la caché, así evitamos hacer peticiones innecesarias
    if (this.cache[category] && options?.offset === 0 && !(options?.nameStartsWith || options?.titleStartsWith)) {
      return of(this.cache[category]);
    }

    // Construimos la URL para la peteción a la API
    let url = `${this.url}${category}?apikey=${this.apiKey}`;

    // Añadimos las opciones de búsqueda a la URL mediante un método String ForEach y una fatarrow function.
    if (options) {
      Object.entries(options).forEach(([key, value]) => url += `&${key}=${value}`);
    }

    return this.http.get(url).pipe(map(response => {
      if (response.status === 'Ok') {

        // Controlamos el caché para que no se sobreescriba la información de la caché a no ser que se soliciten nuevos datos
        if (!(options?.nameStartsWith || options?.titleStartsWith)) {
          if (this.cache[category]) {
            this.cache[category] = {
              ...response.data,
              results: [...(this.cache[category]?.results || []), ...response.data.results]
            };
          } else {
            this.cache[category] = response.data;
          }
        }

        // Si obtenemos una respuesta correcta, devolvemos los datos
        return response.data;

        // Si obtenemos una respuesta incorrecta, lanzamos un error
      } else {
        throw new Error('Something went wrong');
      }
    }));
  }
}
