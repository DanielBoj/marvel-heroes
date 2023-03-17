import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';


// Router
import { RouterModule } from '@angular/router';

// Components
import { DetailComponent } from './component/detail.component';

// Material
import { MaterialModule } from 'src/app/material/material.module';
import { PartialsModule } from "../components/partials/partials.module";
import { ComicsComponent } from './comics/comics.component';
import { StoriesComponent } from './stories/stories.component';

// Gestión del flex
import { FlexLayoutModule } from '@angular/flex-layout';

// Font Awesome
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';



@NgModule({
    declarations: [
        DetailComponent,
        ComicsComponent,
        StoriesComponent
    ],
    exports: [
        DetailComponent
    ],
    imports: [
        CommonModule,
        RouterModule,
        MaterialModule,
        PartialsModule,
        FlexLayoutModule,
        FontAwesomeModule,
        FormsModule,
        ReactiveFormsModule,
    ]
})
export class DetailModule { }
