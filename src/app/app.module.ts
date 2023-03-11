import { NgModule, isDevMode } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { HttpClientModule } from '@angular/common/http';

// Librería NgRx para manejar el estado de la aplicación
import { StoreModule } from '@ngrx/store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';

// Librería para manejar los iconos de la aplicación
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

// Librería para manejar el scroll infinito y permitir la carga de datos de forma escalonada
import { InfiniteScrollModule } from 'ngx-infinite-scroll';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    // Modulo principal de la librería NgRx para manejar el estado de la aplicación
    StoreModule.forRoot({}, {}),//TODO
    // Modulo para manejar las herramientas de debug de NgRx en el Browser
    StoreDevtoolsModule.instrument({ name: 'TEST' }), // TODO
    // Modulo para manejar los iconos de la aplicación
    FontAwesomeModule,
    // Modulo para manejar el scroll infinito
    InfiniteScrollModule,
    HttpClientModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
