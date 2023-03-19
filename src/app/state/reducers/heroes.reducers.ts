/* Implementa las funciones asociadas a las acciones para manejar el estado de la aplicación */

// Imports para manejar el estado de la aplicación
import { createReducer, on } from '@ngrx/store';
import * as heroesActions from '../actions/heroes.actions';

// Imports de modelos de interfaces
import * as heroesInterfaces from 'src/app/core/interfaces/heroes.state.interface';
import { of } from 'rxjs';


// Estados iniciales de la aplicación
export const initialState: heroesInterfaces.NamesState = {
    names: [],
}

export const heroState: heroesInterfaces.HeroState = {
    heroes: [],
}

export const comicsState: heroesInterfaces.ComicsState = {
    loading: true,
    comics: [],
}

export const storiesState: heroesInterfaces.StoriesState = {
    stories: [],
}

export const heroIdState: heroesInterfaces.HeroIdState = {
    heroId: 0,
}

export const heroUrlState: heroesInterfaces.HeroUrlState = {
    heroUrl: '',
}

// Reducers para manejar el estado de la aplicación

// Reducer para la lista de nombres de los héroes
export const namesReducer = createReducer(
    initialState,
    on(heroesActions.loadNames, (state) => ({ ...state, loading: true })),
    on(heroesActions.clearNames, (state) => {
        return {
            ...state,
            names: []
        }
    }),
    on(heroesActions.loadNamesSuccess, (state, nameList) => {
        return {
            ...state,
            names: nameList.names
        }
    }),
    on(heroesActions.loadNamesError, (state, error) => {
        console.log(error.payload);
        return {
            ...state,
            loading: false,
            names: []
        }
    }),
);

// Reducer para la lista de héroes
export const heroesReducer = createReducer(
    heroState,
    on(heroesActions.loadHero, (state) => ({ ...state, heroes: [] })),
    on(heroesActions.loadHeroSuccess, (state, heroList) => {
        return {
            ...state,
            heroes: heroList.heroes
        }
    }),
    on(heroesActions.loadHeroError, (state, error) => {
        console.log(error.payload);
        return {
            ...state,
            heroes: []
        }
    }),
);

// Reducer para la lista de comics
export const comicsReducer = createReducer(
    comicsState,
    on(heroesActions.loadComics, (comics) => ({ ...comics, comics: [] })),
    on(heroesActions.loadComicsSuccess, (comics, comicsList) => {
        return {
            ...comics,
            loading: false,
            comics: comicsList.comics,
        }
    }),
    on(heroesActions.loadComicsError, (comics, error) => {
        console.log(error.payload);
        return {
            ...comics,
            loading: false,
            comics: []
        }
    }),
);

// Reducer para la lista de historias
export const storiesReducer = createReducer(
    storiesState,
    on(heroesActions.loadStories, (stories) => ({ ...stories, stories: [] })),
    on(heroesActions.loadStoriesSuccess, (stories, storiesList) => {
        return {
            ...stories,
            stories: storiesList.stories,
        }
    })
);

// Reducer para el id del héroe
export const heroIdReducer = createReducer(
    heroIdState,
    on(heroesActions.captureHeroId, (heroId) => ({ ...heroId, heroId: 0 })),
    on(heroesActions.captureHeroIdSuccess, (heroId, heroIdList) => {
        return {
            ...heroId,
            heroId: heroIdList.heroId,
        }
    }),
    on(heroesActions.captureHeroIdError, (heroId, error) => {
        console.log(error.payload);
        return {
            ...heroId,
            heroId: 0
        }
    }),
);

// Reducer para la url del héroe
export const heroUrlReducer = createReducer(
    heroUrlState,
    on(heroesActions.captureHeroUrl, (heroUrl) => ({ ...heroUrl, heroUrl: '' })),
    on(heroesActions.captureHeroUrlSuccess, (heroUrl, heroUrlList) => {
        return {
            ...heroUrl,
            heroUrl: heroUrlList.heroUrl,
        }
    }),
    on(heroesActions.captureHeroUrlError, (heroUrl, error) => {
        console.log(error.payload);
        return {
            ...heroUrl,
            heroUrl: ''
        }
    }
    ),
);
