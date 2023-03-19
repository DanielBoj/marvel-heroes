import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';

// Importamos los modelos de interfaces
import { Story } from 'src/app/core/interfaces/marvelStoriesResponse';

// Servicio para realizar las llamadas a la API
import { MarvelService } from 'src/app/services/marvel.service';

// variables en entorno
import { environment } from 'src/environments/environment';

// Importamos el store de NgRx para el modelos reactivos
import { Store } from '@ngrx/store';
import { loadStoriesSuccess } from 'src/app/state/actions/heroes.actions';
import { AppState } from 'src/app/state/app.state';
import { selectHeroIdValue, selectListStories } from 'src/app/state/selectors/heroes.selectors';


@Component({
    selector: 'app-stories',
    templateUrl: './stories.component.html',
    styleUrls: ['./stories.component.sass']
})
export class StoriesComponent implements OnInit {

    // Capturamos el ID del personaje de la URL
    heroId$: number = 0;

    // Variable env para seguir el link a las historias
    private apiKey: string = environment.apiKey;
    private hash: string = environment.hash;
    protected url: string = `?ts=1&apikey=${this.apiKey}&hash=${this.hash}`;

    storiesSubt: string = 'First Stories';
    typeSubt: string = 'Story Type';

    // Objeto para almacenar las historias
    stories$: Observable<any> = new Observable();

    constructor(private activatedRoute: ActivatedRoute,
        private marvelService: MarvelService,
        private router: Router,
        private store: Store<AppState>) {

        // Capturamos el parámetro de la URL
        //this.getIdFromParams();
    }


    ngOnInit(): void {
        // Cargamos el Id del héroe dsesde el store. Hay que parsearlo para poderlo usar
        this.store.select(selectHeroIdValue).forEach((heroId: number) => {
            this.heroId$ = heroId;
        });

        // Cargamos las historias del héroe en el store
        this.getStories(Number(this.heroId$));

        // Recuperamos las historias del héroe desde el store
        this.stories$ = this.store.select(selectListStories);
    }

    // Método para obtener las historias del héroe desde la API, almacenarlas en el store y cargarlas en el componente
    getStories = async (heroId: number) => {
        // Cargamos las historias del héroe desde la API y las almacenamos en el store
        await this.marvelService.getHeroStories(heroId).subscribe((stories: Story[]) => {

            // Cargamos las historias en el store
            this.store.dispatch(loadStoriesSuccess({ stories }));
        })
    }

    // Método para navegar a los datos json de la historia
    checkStory = (url: string) => {
        this.router.navigate([`${url}${this.url}`]);
    }

    // // Método para obtener el ID del personaje de la URL
    // getIdFromParams = () => {
    //     this.activatedRoute.params.subscribe(params => {
    //         this.heroId = params['id'];
    //     })
    // }
}
