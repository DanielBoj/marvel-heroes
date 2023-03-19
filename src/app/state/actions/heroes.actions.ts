/* Implementaos las acciones que vamos a utilizar en el proyecto para cargar los estados en el store */

// Imports de modelos de interfaces
import { createAction, props } from "@ngrx/store";
import { Result } from "src/app/core/interfaces/marvelResponseModel";
import { Comic } from "src/app/core/interfaces/marvelComicResponse";
import { Story } from "src/app/core/interfaces/marvelStoriesResponse";

// Acciones para la carga de los nombres de los héroes
export const loadNames = createAction(
    '[Search] Load names',
);

export const loadNamesSuccess = createAction(
    '[Search] Load names success',
    props<{ names: string[] }>()
);

// Acciones para la carga de los héroes
export const loadHero = createAction(
    '[Search] Load hero',
    props<{ name: string, }>()
);

export const loadHeroSuccess = createAction(
    '[Search] Load hero success',
    props<{ heroes: Result[] }>()
);

export const loadHeroById = createAction(
    '[Search] Load hero by id',
    props<{ id: number, }>()
);

export const loadHeroByIdSuccess = createAction(
    '[Search] Load hero by id success',
    props<{ hero: Result }>()
);

// Acciones para la carga de los comics y las historias
export const loadComics = createAction(
    '[Detail] Load comics',
    props<{ id: number, }>()
);

export const loadComicsSuccess = createAction(
    '[Detail] Load comics success',
    props<{
        comics: Comic[],
    }>()
);

export const loadComicsByType = createAction(
    '[Detail] Load comics by type',
    props<{ id: number, opt: string, }>()
);

export const loadComicsByTypeSuccess = createAction(
    '[Detail] Load comics by type success',
    props<{ comics: Comic[] }>()
);

export const loadStories = createAction(
    '[Detail] Load stories',
    props<{ id: number, }>()
);

export const loadStoriesSuccess = createAction(
    '[Detail] Load stories success',
    props<{ stories: Story[] }>()
);


// Acciones para la captura del id del héroe
export const captureHeroId = createAction(
    '[Detail] Capture hero id',
    props<{ heroId: number, }>()
);

export const captureHeroIdSuccess = createAction(
    '[Detail] Capture hero id success',
    props<{ heroId: number }>()
);

