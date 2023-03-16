import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

// Router
import { RouterModule } from '@angular/router';

// Components
import { DetailComponent } from './component/detail.component';

// Material
import { MaterialModule } from 'src/app/material/material.module';
import { PartialsModule } from "../components/partials/partials.module";
import { ComicsComponent } from './comics/comics.component';
import { StoriesComponent } from './stories/stories.component';

import { FlexLayoutModule } from '@angular/flex-layout';



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
        FlexLayoutModule
    ]
})
export class DetailModule { }
