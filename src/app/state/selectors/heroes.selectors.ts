/* Implementa las funciones para recuperar la información almacenada en el store */

// Imports para manejar el estado de la aplicación
import { createFeatureSelector, createSelector } from '@ngrx/store';

// Imports de modelos de interfaces
import { AppState } from '../app.state';
import { NamesState } from 'src/app/core/interfaces/names.state';
import { HeroIdState, HeroState } from 'src/app/core/interfaces/hero.state';
import { ComicsState, StoriesState } from 'src/app/core/interfaces/comics.state';

// Selector para cargar la lista de nombres de los héroes
export const selectNames = (state: AppState) => state.names;

// Capturamos las propiedades hijos del estado
export const selectListNames = createSelector(
    selectNames,
    (state: NamesState) => state.names
);

export const selectLoadingNames = createSelector(
    selectNames,
    (state: NamesState) => state.loading
);

// Selector para cargar la lista de héroes
export const selectHeroes = (state: AppState) => state.heroes;

// Capturamos las propiedades hijos del estado
export const selectListHeroes = createSelector(
    selectHeroes,
    (state: HeroState) => state.heroes
);

// Selector para cargar la lista de comics
export const selectComics = (state: AppState) => state.comics;

// Capturamos las propiedades hijos del estado
export const selectListComics = createSelector(
    selectComics,
    (state: ComicsState) => state.comics
);

export const selectListComicsById = createSelector(
    selectComics,
    (state: ComicsState) => state.comics
);

// Selector para cargar la lista de historias
export const selectStories = (state: AppState) => state.stories;

export const selectListStories = createSelector(
    selectStories,
    (state: StoriesState) => state.stories
);

// Selector para cargar el id del héroe
export const selectHeroId = (state: AppState) => state.heroId;

export const selectHeroIdValue = createSelector(
    selectHeroId,
    (state: HeroIdState) => state.heroId
);
