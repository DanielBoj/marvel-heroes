/* Usamos los efectos para interceptar las acciones y realizar operaciones asíncronas */
import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { EMPTY, of } from 'rxjs';
import { map, mergeMap, catchError, exhaustMap } from 'rxjs/operators';
import { MarvelService } from '../../services/marvel.service';

// Acciones
import * as heroesActions from '../actions/heroes.actions';

@Injectable()
export class HeroEffects {

    // Efecto para cargar la lista de nombres de héroes
    loadNames$ = createEffect(() => this.actions$.pipe(
        ofType('[Search] Load names'),
        mergeMap(({ offset: offset }) => this.marvelService.getAllNames(offset)
            .pipe(
                map(names => ({ type: '[Search] Load names success', names })),
                catchError(() => EMPTY)
            ))
    )
    );

    // Efecto para cargar los datos de los personajes
    getHero$ = createEffect(() =>
        this.actions$.pipe(
            ofType(heroesActions.loadHero),
            mergeMap(({ name: name }) => {
                return this.marvelService.getHero(name).pipe(
                    map(heroes => heroesActions.loadHeroSuccess({ heroes: heroes }),
                        catchError(error => of(heroesActions.loadHeroError({ payload: error })))
                    ))
            })
        )
    );

    // Efecto para cargar los personajes con un ID
    getHeroById$ = createEffect(() =>
        this.actions$.pipe(
            ofType(heroesActions.loadHeroById),
            mergeMap(({ id: id }) => {
                return this.marvelService.getHeroById(id).pipe(
                    map(heroes => heroesActions.loadHeroSuccess({ heroes: heroes }),
                        catchError(error => of(heroesActions.loadHeroError({ payload: error })))
                    ))
            })
        ));

    // Efecto para cargar los comics de un personaje
    getComics$ = createEffect(() =>
        this.actions$.pipe(
            ofType(heroesActions.loadComics),
            mergeMap(({ id: id }) => {
                return this.marvelService.getComics(id).pipe(
                    map(comics => heroesActions.loadComicsSuccess({ comics: comics }),
                        catchError(error => of(heroesActions.loadComicsError({ payload: error })))
                    ))
            })
        )
    );

    // Efecto para cargar los comics de un personaje filtrados por tipo	de cómic
    getFilteredComics$ = createEffect(() =>
        this.actions$.pipe(
            ofType(heroesActions.loadComicsByType),
            mergeMap(({ id: id, opt: opt }) => {
                return this.marvelService.getFilteredComics(id, opt).pipe(
                    map(comics => heroesActions.loadComicsSuccess({ comics: comics }),
                        catchError(error => of(heroesActions.loadComicsError({ payload: error })))
                    ))
            })
        )
    );

    // Efecto para cargar las historias de un personaje
    getStories$ = createEffect(() =>
        this.actions$.pipe(
            ofType(heroesActions.loadStories),
            mergeMap(({ id: id }) => {
                return this.marvelService.getHeroStories(id).pipe(
                    map(stories => heroesActions.loadStoriesSuccess({ stories: stories }),
                        catchError(error => of(heroesActions.loadComicsError({ payload: error })))
                    ))
            })
        )
    );


    // Inyectamos los servicios que vamos a utilizar y las acciones
    constructor(private actions$: Actions, private marvelService: MarvelService) { }
}
