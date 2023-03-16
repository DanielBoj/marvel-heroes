import { NgModule, isDevMode } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

// Formularios
import { ReactiveFormsModule } from '@angular/forms';
import { FormsModule } from '@angular/forms';

// Librería para manejar las peticiones HTTP
import { HttpClientModule } from '@angular/common/http';

// Librería NgRx para manejar el estado de la aplicación
import { StoreModule } from '@ngrx/store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';

// Librería para manejar los iconos de la aplicación
import { FontAwesomeModule, FaIconLibrary } from '@fortawesome/angular-fontawesome';

// Librería para manejar el scroll infinito y permitir la carga de datos de forma escalonada
import { InfiniteScrollModule } from 'ngx-infinite-scroll';

// Libreríás para flexbox
import { FlexLayoutModule } from '@angular/flex-layout';

// Modulos personalizados de la aplicación
import { PageModule } from './modules/page/page.module';

// Módulo de gestión de Angular Material
import { MaterialModule } from './material/material.module';

import { faInstagram as fabInstagram } from '@fortawesome/free-brands-svg-icons';
import { faFacebook as fabFacebook } from '@fortawesome/free-brands-svg-icons';
import { faTwitter as fabTwitter } from '@fortawesome/free-brands-svg-icons';
import { faMagnifyingGlass as fasMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import { DataService } from './services/data.service';


@NgModule({
    declarations: [
        AppComponent,
    ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        BrowserAnimationsModule,
        // Modulo principal de la librería NgRx para manejar el estado de la aplicación
        StoreModule.forRoot({}, {}),//TODO
        // Modulo para manejar las herramientas de debug de NgRx en el Browser
        StoreDevtoolsModule.instrument({ name: 'TEST' }), // TODO
        // Formularios
        ReactiveFormsModule,
        FormsModule,
        // Modulo para manejar los iconos de la aplicación
        FontAwesomeModule,
        // Modulo para manejar el scroll infinito
        InfiniteScrollModule,
        // Modulo para manejar el flexbox
        FlexLayoutModule,
        HttpClientModule,
        // Modulos personalizados
        PageModule,
        // Módulo de gestión de Angular Material
        MaterialModule,
        // Iconos Font Awesome
        FontAwesomeModule
    ],
    providers: [DataService],
    bootstrap: [AppComponent]
})
export class AppModule {
    constructor(library: FaIconLibrary) {
        library.addIcons(
            fabInstagram,
            fabFacebook,
            fabTwitter,
            fasMagnifyingGlass
        );
    }
}
