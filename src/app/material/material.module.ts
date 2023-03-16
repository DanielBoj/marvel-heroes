// Administramos los módulos de Angular Material desde un módulo independiente para aislar cualquier posible error y mantener el código más limpio

import { NgModule } from '@angular/core';

// Modulos de Angular Material
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatCardModule } from '@angular/material/card';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatTabsModule } from '@angular/material/tabs';


const matModules = [
    MatButtonModule,
    MatButtonToggleModule,
    MatCardModule,
    MatToolbarModule,
    MatGridListModule,
    MatIconModule,
    MatInputModule,
    MatListModule,
    MatMenuModule,
    MatAutocompleteModule,
    MatTabsModule,
]


@NgModule({
    imports: [matModules],
    exports: [matModules]
})
export class MaterialModule { }
