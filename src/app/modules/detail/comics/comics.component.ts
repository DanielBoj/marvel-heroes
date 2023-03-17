import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, map, startWith } from 'rxjs/operators';

// Importamos los modelos de interfaces
import { Comic } from 'src/app/core/interfaces/marvelComicResponse';

// Servicio para realizar las llamadas a la API
import { MarvelService } from 'src/app/services/marvel.service';



@Component({
    selector: 'app-comics',
    templateUrl: './comics.component.html',
    styleUrls: ['./comics.component.sass']
})
export class ComicsComponent implements OnInit {

    // Capturamos el ID del personaje de la URL
    heroId!: number;

    // Gestor para la animación del icono
    isHovered: boolean = false;

    dateTitle: string = 'Publication Date';

    // Gestión del filtrado de cómics
    // Lista de los valores de filtrado permitidos
    filterOpts: string[] = [];
    filteredOpts: Observable<string[]> = new Observable();
    // Controlador para el input de filtrado
    filter: FormControl = new FormControl('');
    filterInput: string = '';

    // Objeto para almacenar los cómics
    comics: Observable<Array<Comic>> = new Observable();

    // Control de llamadas de filtrado
    private subjectKeyUp = new Subject<any>();

    constructor(private marvelService: MarvelService, private activatedRoute: ActivatedRoute, private router: Router) {

        // Capturamos el parámetro de la URL
        this.getIdFromParams();

        // Cargamos los parámetros de filtrado
        this.filterOpts = [
            'None',
            'comic',
            'magazine',
            'trade paperback',
            'hardcover',
            'digest',
            'graphic novel',
            'digital comic',
            'infinite comic'
        ]
    }

    ngOnInit(): void {
        // Cargamos los cómics
        this.getComics(this.heroId);

        // Filtramos los valores de filtrado
        this.filteredOpts = this.filter.valueChanges.pipe(
            startWith(''),
            map(value => this._filter(value))
        );

        // Filtramos los cómics
        this.filter.defaultValue; // Para que no se filtre nada al cargar la página
        this.subjectKeyUp.pipe((
            debounceTime(600),

            // Actualizamos solo si hay cambios
            distinctUntilChanged((prev, next) =>
                prev === next)),
        ).subscribe((value) => {
            if (this.heroId === value || value.toLowerCase().includes('none')) {
                this.getComics(this.heroId);
            } else {
                this.getFilteredComics(this.heroId, value);
            }
        });


    }

    ngOnDestroy(): void {
        //Called once, before the instance is destroyed.
        //Add 'implements OnDestroy' to the class.
        this.subjectKeyUp.unsubscribe();
    }

    getComics = async (heroId: number) => {
        // No hace falta subscribe porque manejamos la asincronía en el template
        this.comics = await this.marvelService.getComics(heroId);

        this.subjectKeyUp.next(heroId);
    }

    getFilteredComics = async (heroId: number, filter: string) => {
        // No hace falta subscribe porque manejamos la asincronía en el template
        this.comics = await this.marvelService.getFilteredComics(heroId, filter);
    }

    checkComic = (url: string) => {
        this.router.navigate([`${url}`]);
    }

    getIdFromParams = () => {
        this.activatedRoute.params.subscribe(params => {
            this.heroId = params['id'];
        })
    }

    // Función para filtrar los valores de filtrado
    private _filter(value: string): string[] {
        // Convertimos los valores a minúsculas para evitar errores
        const filterValue: string = value.toLowerCase();

        return this.filterOpts.filter(option => option.toLowerCase().includes(filterValue));
    }

    // Muestra el input de filtrado
    showFilter = (opt: string) => {
        return opt ? opt : '';
    }

    onFilter = (filter: string) => {
        if (filter === '') {
            return;
        }

        // Obtenemos el filtro
        filter.toLowerCase();
        // Descomentar para testar
        // console.log(filter);

        /// Controlamos el filtro
        this.subjectKeyUp.next(filter);
    }

}
