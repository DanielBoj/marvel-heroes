import { Component, Input } from '@angular/core';
import { Result } from 'src/app/core/interfaces/marvelResponseModel';
import { Router } from '@angular/router';

@Component({
    selector: 'app-hero-card',
    templateUrl: './hero-card.component.html',
    styleUrls: ['./hero-card.component.sass']
})
export class HeroCardComponent {

    @Input() hero: Result = { name: '' } as Result;

    subDescript: string = 'Biography';
    subAparicion: string = 'Last Appearance';

    constructor(private router: Router) { }

    getHero = (heroId: number) => {

        this.router.navigate(['character/', heroId]);
    }


}
