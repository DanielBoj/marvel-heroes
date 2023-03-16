import { Component, OnInit } from '@angular/core';

// Importamos el servicio de peticiones a la API de Marvel
import { MarvelService } from 'src/app/services/marvel.service';

// Importamos el módulo para poder capturar los parámetros de la URL
import { ActivatedRoute, Router } from '@angular/router';


// Importamos los modelos de interfaces
import { Result, HeroData, Stories, StoriesItem } from 'src/app/core/interfaces/marvelResponseModel';



@Component({
    selector: 'app-detail',
    templateUrl: './detail.component.html',
    styleUrls: ['./detail.component.sass']
})
export class DetailComponent implements OnInit {

    descSubt: string = 'Biography';
    appearanceSubt: string = 'Last Appearance';
    modifiedStringDate: string = '';

    // Captura del parámetro de la URL
    heroId!: number;

    // Observable para almacenar los datos del personaje retornados por la API
    hero?: HeroData;

    constructor(private marvelService: MarvelService, private activatedRoute: ActivatedRoute, private router: Router) {

        // Capturamos el parámetro de la URL
        this.activatedRoute.params.subscribe(params => {
            this.heroId = params['id'];
        })
    }

    ngOnInit(): void {
        this.getHeroById(this.heroId);
    }

    // Método para obtener los datos del personaje, además, generaremos un objeto para poder extraer los datos y usarlos en la vista
    getHeroById = async (heroId: number) => {
        if (heroId > 0) {
            this.hero = await this.marvelService.getHeroById(heroId)
                .subscribe((hero: Result[]) => {

                    // Creamos un objeto para almacenar los datos del personaje
                    let heroData: HeroData = {
                        id: hero[0].id,
                        name: hero[0].name,
                        description: hero[0].description,
                        modified: hero[0].modified,
                        thumbnail: hero[0].thumbnail.path + '.' + hero[0].thumbnail.extension,
                        resourceURI: hero[0].resourceURI,
                        comics: hero[0].comics.items,
                        series: hero[0].series.items,
                        stories: hero[0].stories.items,
                        events: hero[0].events.items,
                        urls: hero[0].urls[0].url
                    }

                    // Asignamos el objeto creado a nuestro objeto de personaje
                    this.hero = heroData;

                    // Formateador de fechas
                    const dateFormatter = new Intl.DateTimeFormat('es-ES', {
                        dateStyle: 'medium',
                    });
                    this.modifiedStringDate = dateFormatter.format(new Date(this.hero.modified));
                });
        } else {
            return;
        }
    }
}
