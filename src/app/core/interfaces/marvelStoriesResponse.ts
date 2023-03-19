/* Interfaz de respuesta de la API de Marvel para las historias */

export interface StoryDataWrapper {
    code: number;
    status: string;
    copyright: string;
    attributionText: string;
    attributionHTML: string;
    data: StoryDataContainer;
    etag: string;
}

export interface StoryDataContainer {
    offset: number;
    limit: number;
    total: number;
    count: number;
    results: Story[];
}

export interface Story {
    id: number;
    title: string;
    description: string;
    resourceURI: string;
    type: string;
    modified: Date;
    thumbnail: Image;
    creators: CreatorList;
    characters: CharacterList;
    comics: ComicList;
    series: SeriesList;
    events: EventList;
    originalIssue: ComicSummary;
}



export interface Image {
    path: string;
    extension: string;
}

export interface ComicList {
    available: number;
    returned: number;
    collectionURI: string;
    items: ComicSummary[];
}

export interface ComicSummary {
    resourceURI: string;
    name: string;
}

export interface SeriesList {
    available: number;
    returned: number;
    collectionURI: string;
    items: SeriesSummary[];
}

export interface SeriesSummary {
    resourceURI: string;
    name: string;
}

export interface EventList {
    available: number;
    returned: number;
    collectionURI: string;
    items: EventSummary[];
}

export interface EventSummary {
    resourceURI: string;
    name: string;
}


export interface CharacterList {
    available: number;
    returned: number;
    collectionURI: string;
    items: CharacterSummary[];
}

export interface CharacterSummary {
    resourceURI: string;
    name: string;
    role: string;
}

export interface CreatorList {
    available: number;
    returned: number;
    collectionURI: string;
    items: CreatorSummary[];
}

export interface CreatorSummary {
    resourceURI: string;
    name: string;
    role: string;
}
