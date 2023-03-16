import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';

// Importamos los modelos de interfaces
import { Story } from 'src/app/core/interfaces/marvelStoriesResponse';

// Servicio para realizar las llamadas a la API
import { MarvelService } from 'src/app/services/marvel.service';

// variables en entorno
import { environment } from 'src/environments/environment';


@Component({
    selector: 'app-stories',
    templateUrl: './stories.component.html',
    styleUrls: ['./stories.component.sass']
})
export class StoriesComponent implements OnInit {

    // Capturamos el ID del personaje de la URL
    heroId!: number;

    // Variable env para seguir el link a las historias
    private apiKey: string = environment.apiKey;
    private hash: string = environment.hash;
    protected url: string = `?ts=1&apikey=${this.apiKey}&hash=${this.hash}`;

    storiesSubt: string = 'First Stories';
    typeSubt: string = 'Story Type';

    // Objeto para almacenar las historias
    stories?: Observable<Array<Story>>;

    constructor(private activatedRoute: ActivatedRoute, private marvelService: MarvelService, private router: Router) {

        // Capturamos el parámetro de la URL
        this.activatedRoute.params.subscribe(params => {
            this.heroId = params['id'];
        })
    }


    ngOnInit(): void {
        this.getStories(this.heroId);
    }

    getStories = async (heroId: number) => {
        // No hace falta subscribe porque manejamos la asincronía en el template
        this.stories = await this.marvelService.getHeroStories(heroId);

        // Descomentar para testar
        // console.log(this.stories);
    }

    checkStory = (url: string) => {
        this.router.navigate([`${url}${this.url}`]);
    }

}
