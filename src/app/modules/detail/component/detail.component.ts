import { Component, OnInit } from '@angular/core';

// Importamos el servicio de peticiones a la API de Marvel
import { MarvelService } from 'src/app/services/marvel.service';

// Servicio de manejo interno de datos
import { DataService } from 'src/app/services/data.service';

// Importamos el módulo para poder capturar los parámetros de la URL
import { ActivatedRoute, Router } from '@angular/router';


// Importamos los modelos de interfaces
import { Result } from 'src/app/core/interfaces/marvelResponseModel';
import { Observable } from 'rxjs/internal/Observable';

// Para poder volver atrás con código del mismo framework
import { Location } from '@angular/common';



@Component({
    selector: 'app-detail',
    templateUrl: './detail.component.html',
    styleUrls: ['./detail.component.sass']
})
export class DetailComponent implements OnInit {

    descSubt: string = 'Biography';
    appearanceSubt: string = 'Last Appearance';
    // modifiedStringDate: string = '';

    // Captura del parámetro de la URL
    heroId!: number;

    // Observable para almacenar los datos del personaje retornados por la API
    hero: Observable<Result[]> = new Observable();


    constructor(
        private marvelService: MarvelService,
        private activatedRoute: ActivatedRoute, private router: Router,
        private location: Location,
        private dataService: DataService) {

        // Capturamos el parámetro de la URL
        this.getIdFromParams();
    }

    ngOnInit(): void {
        // Cargamos los datos del personaje
        this.getHeroById(this.heroId);
    }

    ngOnDestroy(): void {
        // Enviamos el ID del personaje al servicio de datos
        this.dataService.setHeroId(this.heroId);
    }

    // Método para obtener los datos del personaje, además, generaremos un objeto para poder extraer los datos y usarlos en la vista
    getHeroById = async (heroId: number) => {
        if (heroId > 0) {
            this.hero = await this.marvelService.getHeroById(heroId);
        } else {
            console.log('Error: Could not find a suitable hero ID');
            return;
        }
    }

    getBack = () => {
        this.location.back();
    }

    getIdFromParams = () => {
        this.activatedRoute.params.subscribe(params => {
            this.heroId = params['id'];
        })
    }

    checkHero = (url: string) => {
        this.router.navigate([`${url}`]);
    }
}
