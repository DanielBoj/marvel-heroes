import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

// Router
import { RouterModule } from '@angular/router';

// Material
import { MaterialModule } from 'src/app/material/material.module';

// Font Awesome
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

import { ReactiveFormsModule } from '@angular/forms';
import { FormsModule } from '@angular/forms';

// Components
import { BannerComponent } from './banner/banner.component';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { SearchComponent } from './search/search.component';

import { HeroCardComponent } from './hero-card/hero-card.component';


import { LayoutModule } from '@angular/cdk/layout';
// import { MatToolbarModule } from '@angular/material/toolbar';
// import { MatButtonModule } from '@angular/material/button';
// import { MatSidenavModule } from '@angular/material/sidenav';
// import { MatIconModule } from '@angular/material/icon';
// import { MatListModule } from '@angular/material/list';



@NgModule({
    declarations: [
        BannerComponent,
        HeaderComponent,
        FooterComponent,
        SearchComponent,
        HeroCardComponent,

    ],
    imports: [
        CommonModule,
        RouterModule,
        MaterialModule,
        FontAwesomeModule,
        LayoutModule,
        // MatToolbarModule,
        // MatButtonModule,
        // MatSidenavModule,
        // MatIconModule,
        // MatListModule,
        ReactiveFormsModule,
        FormsModule
    ],
    exports: [
        BannerComponent,
        HeaderComponent,
        FooterComponent,
        SearchComponent,
        HeroCardComponent
    ]
})
export class PartialsModule { }
