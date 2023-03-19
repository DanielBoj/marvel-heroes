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

// Importamos el store de NgRx para el modelos reactivos
import { Store } from '@ngrx/store';
import { captureHeroIdSuccess, loadHeroSuccess } from 'src/app/state/actions/heroes.actions';
import { AppState } from 'src/app/state/app.state';
import { selectHeroIdValue, selectListHeroes } from 'src/app/state/selectors/heroes.selectors';



@Component({
    selector: 'app-detail',
    templateUrl: './detail.component.html',
    styleUrls: ['./detail.component.sass']
})
export class DetailComponent implements OnInit {

    descSubt: string = 'Biography';
    appearanceSubt: string = 'Last Appearance';

    // Captura del parámetro de la URL
    heroId!: number;

    // Observable para almacenar los datos del personaje retornados por la API
    hero$: Observable<any> = new Observable();


    constructor(
        private marvelService: MarvelService,
        private activatedRoute: ActivatedRoute,
        private router: Router,
        private location: Location,
        private dataService: DataService,
        private store: Store<AppState>) {

        // Capturamos el parámetro de la URL
        this.getIdFromParams();
    }

    ngOnInit(): void {

        // Inicializamos cargando los datos datos del personaje
        this.getHeroById(this.heroId);
        // Obtenemos los datos del store
        this.hero$ = this.store.select(selectListHeroes);

        // Enviamos el ID del personaje al store
        this.store.dispatch(captureHeroIdSuccess({ heroId: this.heroId }));
    }

    ngOnDestroy(): void {
        // Enviamos el ID del personaje al servicio de datos
        this.dataService.setHeroId(this.heroId);

    }

    // Método para obtener los datos del personaje, además, generaremos un objeto para poder extraer los datos y usarlos en la vista
    getHeroById = async (heroId: number) => {
        if (heroId > 0) {
            this.hero$ = await this.marvelService.getHeroById(heroId);
            return await this.marvelService.getHeroById(heroId).subscribe(
                (hero: Result[]) => {
                    // Cargamos la información en el store
                    this.store.dispatch(loadHeroSuccess({ heroes: hero }));
                }
            );

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
