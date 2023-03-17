import { createAction, props } from "@ngrx/store";
import { Result } from "src/app/core/interfaces/marvelResponseModel";
import { Comic } from "src/app/core/interfaces/marvelComicResponse";
import { Story } from "src/app/core/interfaces/marvelStoriesResponse";

export const loadHero = createAction(
    '[Search] Load hero',
    props<{ name: string }>()

);

export const loadHeroSuccess = createAction(
    '[Search] Load hero success',
    props<{ hero: Result }>()
);

export const loadHeroFailure = createAction(
    '[Search] Load hero failure',
    props<{ error: any }>()
);

export const loadHeroById = createAction(
    '[Search] Load hero by id',
    props<{ heroId: number }>()
);

export const loadHeroByIdSuccess = createAction(
    '[Search] Load hero by id success',
    props<{ hero: Result }>()
);

export const loadHeroByIdFailure = createAction(
    '[Search] Load hero by id failure',
    props<{ error: any }>()
);

export const loadComics = createAction(
    '[Detail] Load comics',
    props<{ heroId: number }>()
);

export const loadComicsSuccess = createAction(
    '[Detail] Load comics success',
    props<{ comics: Comic }>()
);

export const loadComicsFailure = createAction(
    '[Detail] Load comics failure',
    props<{ error: any }>()
);

export const loadStories = createAction(
    '[Detail] Load stories',
    props<{ heroId: number }>()
);

export const loadStoriesSuccess = createAction(
    '[Detail] Load stories success',
    props<{ stories: Story }>()
);

export const loadStoriesFailure = createAction(
    '[Detail] Load stories failure',
    props<{ error: any }>()
);

export const captureHeroId = createAction(
    '[Detail] Capture hero id',
    props<{ heroId: number }>()
);

export const captureHeroIdSuccess = createAction(
    '[Detail] Capture hero id success',
    props<{ heroId: number }>()
);

export const captureHeroIdFailure = createAction(
    '[Hero Card] Capture hero id failure',
    props<{ error: any }>()
);

