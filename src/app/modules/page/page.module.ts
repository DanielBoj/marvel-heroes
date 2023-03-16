import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

// Router
import { RouterModule } from '@angular/router';

// Módulos personalizados
import { PartialsModule } from '../components/partials/partials.module';
import { CharactersModule } from '../characters/characters.module';
import { DetailModule } from '../detail/detail.module';

// Components
import { PageComponent } from './page.component';



@NgModule({
    declarations: [
        PageComponent,
    ],
    imports: [
        CommonModule,
        RouterModule,
        // Módulos personalizados
        PartialsModule,
        CharactersModule,
        DetailModule
    ],
    exports: [
        PageComponent
    ]
})
export class PageModule { }
