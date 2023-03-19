import { Comic } from "./marvelComicResponse";
import { Story } from "./marvelStoriesResponse";

export interface ComicsState {
    comics: ReadonlyArray<Comic>;
}

export interface StoriesState {
    stories: ReadonlyArray<Story>,
}
