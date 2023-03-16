import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';

// Importamos los modelos de interfaces
import { Comic } from 'src/app/core/interfaces/marvelComicResponse';

// Servicio para realizar las llamadas a la API
import { MarvelService } from 'src/app/services/marvel.service';

// variables en entorno
import { environment } from 'src/environments/environment';

@Component({
    selector: 'app-comics',
    templateUrl: './comics.component.html',
    styleUrls: ['./comics.component.sass']
})
export class ComicsComponent implements OnInit {

    // Capturamos el ID del personaje de la URL
    heroId!: number;

    // Variable env para seguir el link a las historias
    private apiKey: string = environment.apiKey;
    private hash: string = environment.hash;
    protected url: string = `?ts=1&apikey=${this.apiKey}&hash=${this.hash}`;

    dateTitle: string = 'Publication Date';

    // Objeto para almacenar los cómics
    comics?: Observable<Array<Comic>>;

    constructor(private marvelService: MarvelService, private activatedRoute: ActivatedRoute, private router: Router) {

        // Capturamos el parámetro de la URL
        this.activatedRoute.params.subscribe(params => {
            this.heroId = params['id'];
        })
    }

    ngOnInit(): void {
        this.getComics(this.heroId);
    }

    getComics = async (heroId: number) => {
        // No hace falta subscribe porque manejamos la asincronía en el template
        this.comics = await this.marvelService.getComics(heroId);
    }

    checkComic = (url: string) => {
        this.router.navigate([`${url}${this.url}`]);
    }

}
