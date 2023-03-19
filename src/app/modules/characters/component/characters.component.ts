/* Implementa la lógica para mostrar la caja de títulos bajo la que se representa el personaje, simplemente realiza funciones de enrutamiento */

import { Component } from '@angular/core';

// Servicio para compartir los datos de los personajes
import { Router } from '@angular/router';



@Component({
    selector: 'app-characters',
    templateUrl: './characters.component.html',
    styleUrls: ['./characters.component.sass']
})
export class CharactersComponent {

    // Variables para el título y subtítulo de la página
    title = 'In times of despair...';
    subtitle = 'Search for your destined saviour!';
    heroId?: number;


    // Inyectamos los servicios para trabajar con los datos de la API y compartir los datos de los personajes
    constructor(private router: Router) { }


}
