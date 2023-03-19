/* Contiene todos los estados de la aplicación para su exportación */

import { ActionReducerMap } from "@ngrx/store";

// Importamos las interfaces de los estados
import * as heroesState from "../core/interfaces/heroes.state.interface";

// Importamos los reducers
import * as heroesReducers from "./reducers/heroes.reducers";

export interface AppState {
    names: heroesState.NamesState,
    heroes: heroesState.HeroState,
    comics: heroesState.ComicsState,
    stories: heroesState.StoriesState,
    heroId: heroesState.HeroIdState,
    heroUrl: heroesState.HeroUrlState,
}


export const ROOT_REDUCERS: ActionReducerMap<AppState> = {
    names: heroesReducers.namesReducer,
    heroes: heroesReducers.heroesReducer,
    comics: heroesReducers.comicsReducer,
    stories: heroesReducers.storiesReducer,
    heroId: heroesReducers.heroIdReducer,
    heroUrl: heroesReducers.heroUrlReducer,
}
