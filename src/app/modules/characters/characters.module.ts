import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

// Router
import { RouterModule } from '@angular/router';

// Components
import { CharactersComponent } from './component/characters.component';

// Módulos personalizados
import { PartialsModule } from '../components/partials/partials.module';

// Módulos de Angular Material
import { MaterialModule } from 'src/app/material/material.module';



@NgModule({
    declarations: [
        CharactersComponent
    ],
    imports: [
        CommonModule,
        RouterModule,
        MaterialModule,
        // Módulos personalizados
        PartialsModule
    ],
    exports: [
        CharactersComponent
    ]
})
export class CharactersModule { }
