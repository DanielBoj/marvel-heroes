/* Interfaces que usaremos con NgRx */
import { Result } from "./marvelResponseModel";
import { Comic } from "./marvelComicResponse";
import { Story } from "./marvelStoriesResponse";

export interface NamesState {
    names: Array<string>,
};

export interface HeroState {
    heroes: Array<Result>,
};

export interface HeroIdState {
    heroId: number,
};

export interface HeroUrlState {
    heroUrl: string,
};

export interface ComicsState {
    loading: boolean,
    comics: Array<Comic>;
};

export interface StoriesState {
    stories: Array<Story>,
};
