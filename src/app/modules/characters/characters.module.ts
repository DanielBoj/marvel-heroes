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

// NgRx
import { StoreModule } from '@ngrx/store';
import { ROOT_REDUCERS } from 'src/app/state/app.state';



@NgModule({
    declarations: [
        CharactersComponent
    ],
    imports: [
        CommonModule,
        RouterModule,
        MaterialModule,
        // Módulos personalizados
        PartialsModule,
        // NgRx
        StoreModule.forFeature('characters', ROOT_REDUCERS)
    ],
    exports: [
        CharactersComponent
    ]
})
export class CharactersModule { }
