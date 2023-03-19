/* Contiene todos los estados de la aplicación para su exportación */

import { ActionReducerMap } from "@ngrx/store";
import { NamesState } from "../core/interfaces/names.state";

// Importamos los reducers
import { comicsReducer, heroIdReducer, heroesReducer, namesReducer, storiesReducer } from "./reducers/heroes.reducers";
import { HeroIdState, HeroState } from "../core/interfaces/hero.state";
import { ComicsState, StoriesState } from "../core/interfaces/comics.state";

export interface AppState {
    names: NamesState,
    heroes: HeroState,
    comics: ComicsState,
    stories: StoriesState,
    heroId: HeroIdState
}


export const ROOT_REDUCERS: ActionReducerMap<AppState> = {
    names: namesReducer,
    heroes: heroesReducer,
    comics: comicsReducer,
    stories: storiesReducer,
    heroId: heroIdReducer,
}
