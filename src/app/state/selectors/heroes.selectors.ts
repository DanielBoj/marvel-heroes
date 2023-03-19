/* Implementa las funciones para recuperar la información almacenada en el store */

// Imports para manejar el estado de la aplicación
import { createSelector } from '@ngrx/store';

// Imports de modelos de interfaces
import { AppState } from '../app.state';

// Selector para cargar la lista de nombres de los héroes
export const selectNames = (state: AppState) => state.names;

// Capturamos las propiedades hijos del estado
export const selectListNames = createSelector(
    selectNames,
    (state) => state.names
);

// Selector para cargar la lista de héroes
export const selectHeroes = (state: AppState) => state.heroes;

// Capturamos las propiedades hijos del estado
export const selectListHeroes = createSelector(
    selectHeroes,
    (state) => state.heroes
);

// Selector para cargar la lista de comics
export const selectComics = (state: AppState) => state.comics;

// Capturamos las propiedades hijos del estado
export const selectListComics = createSelector(
    selectComics,
    (state) => state.comics
);

export const selectListComicsById = createSelector(
    selectComics,
    (state) => state.comics
);

export const selectLoadingComics = createSelector(
    selectComics,
    (state) => state.loading
);

// Selector para cargar la lista de historias
export const selectStories = (state: AppState) => state.stories;

export const selectListStories = createSelector(
    selectStories,
    (state) => state.stories
);

// Selector para cargar el id del héroe
export const selectHeroId = (state: AppState) => state.heroId;

export const selectHeroIdValue = createSelector(
    selectHeroId,
    (state) => state.heroId
);

// Selector para cargar la url del héroe
export const selectHeroUrl = (state: AppState) => state.heroUrl;

export const selectHeroUrlValue = createSelector(
    selectHeroUrl,
    (state) => state.heroUrl
);
