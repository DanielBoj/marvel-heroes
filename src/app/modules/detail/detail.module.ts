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

// NgRx
import { StoreModule } from '@ngrx/store';
import { ROOT_REDUCERS } from 'src/app/state/app.state';



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
        StoreModule.forFeature('detail', ROOT_REDUCERS),
    ]
})
export class DetailModule { }
