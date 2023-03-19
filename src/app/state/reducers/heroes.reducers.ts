/* Implementa las funciones asociadas a las acciones para manejar el estado de la aplicación */

// Imports para manejar el estado de la aplicación
import { createReducer, on } from '@ngrx/store';
import { captureHeroId, captureHeroIdSuccess, loadComics, loadComicsSuccess, loadHero, loadHeroSuccess, loadNames, loadNamesSuccess, loadStories, loadStoriesSuccess } from '../actions/heroes.actions';

// Imports de modelos de interfaces
import { NamesState } from 'src/app/core/interfaces/names.state';
import { HeroIdState, HeroState } from 'src/app/core/interfaces/hero.state';
import { ComicsState, StoriesState } from 'src/app/core/interfaces/comics.state';

// Estado inicial de la aplicación
export const initialState: NamesState = {
    loading: false,
    names: [],
}

export const heroState: HeroState = {
    heroes: [],
}

export const comicsState: ComicsState = {
    comics: [],

}

export const storiesState: StoriesState = {
    stories: [],
}

export const heroIdState: HeroIdState = {
    heroId: 0,
}

// Reducers para manejar el estado de la aplicación

// Reducer para la lista de nombres de los héroes
export const namesReducer = createReducer(
    initialState,
    on(loadNames, (state) => {
        return {
            ...state,
            loading: true,
        }
    }),
    on(loadNamesSuccess, (state, nameList) => {
        return {
            ...state,
            loading: false,
            names: nameList.names
        }
    })
);

// Reducer para la lista de héroes
export const heroesReducer = createReducer(
    heroState,
    on(loadHero, (state) => {
        return {
            ...state,
            heroes: [],
        }
    }),
    on(loadHeroSuccess, (state, heroList) => {
        return {
            ...state,
            heroes: heroList.heroes
        }
    })
);

// Reducer para la lista de comics
export const comicsReducer = createReducer(
    comicsState,
    on(loadComics, (comics) => {
        return {
            ...comics,
            comics: []
        }
    }),
    on(loadComicsSuccess, (comics, comicsList) => {
        return {
            ...comics,
            comics: comicsList.comics,
        }
    })
);

// Reducer para la lista de historias
export const storiesReducer = createReducer(
    storiesState,
    on(loadStories, (stories) => {
        return {
            ...stories,
            stories: []
        }
    }),
    on(loadStoriesSuccess, (stories, storiesList) => {
        return {
            ...stories,
            stories: storiesList.stories,
        }
    })
);

// Reducer para el id del héroe
export const heroIdReducer = createReducer(
    heroIdState,
    on(captureHeroId, (heroId) => {
        return {
            ...heroId,
            heroId: 0
        }
    }),
    on(captureHeroIdSuccess, (heroId, heroIdList) => {
        return {
            ...heroId,
            heroId: heroIdList.heroId,
        }
    })
);
