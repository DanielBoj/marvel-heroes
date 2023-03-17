// Imports
import { Result } from './marvelResponseModel';
import { Comic } from './marvelComicResponse';
import { Data } from './marvelResponseModel';
import { Story } from './marvelStoriesResponse';


export interface MarvelCache {
    names?: string[];
    characters?: Result[];
    comics?: Comic[];
    creators?: Data;
    events?: Data;
    series?: Data;
    stories?: Story[];
}
