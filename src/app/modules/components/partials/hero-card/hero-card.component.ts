import { Component, Input } from '@angular/core';
import { Result } from 'src/app/core/interfaces/marvelResponseModel';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';

@Component({
    selector: 'app-hero-card',
    templateUrl: './hero-card.component.html',
    styleUrls: ['./hero-card.component.sass']
})
export class HeroCardComponent {

    @Input() allHeroes?: Observable<Result[]>;

    subDescript: string = 'Biography';
    subAparicion: string = 'Last Appearance';

    constructor(private router: Router) { }

    getHero = (heroId: any) => {

        // Cambiamos el tipo de dato
        heroId = Number(heroId);
        this.router.navigate(['character/', heroId]);
    }


}
