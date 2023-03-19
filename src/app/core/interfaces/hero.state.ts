import { Result } from "./marvelResponseModel";

export interface HeroState {
    heroes: ReadonlyArray<Result>,
}

export interface HeroIdState {
    heroId: Readonly<number>,
}
