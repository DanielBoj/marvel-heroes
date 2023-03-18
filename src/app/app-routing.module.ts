import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// Components
import { CharactersComponent } from './modules/characters/component/characters.component';
import { DetailComponent } from './modules/detail/component/detail.component';
import { PageComponent } from './modules/page/page.component';

const routes: Routes = [
    {
        path: '', redirectTo: '/home',
        pathMatch: 'full'
    },
    {
        path: 'home', component: PageComponent,
        title: 'Home',
        pathMatch: 'full'
    },
    {
        path: 'character', component: CharactersComponent,
        title: 'Characters',
        pathMatch: 'full'
    },
    {
        path: 'character/:id', component: DetailComponent,
        title: 'Character Details',
        pathMatch: 'full'
    },
    {
        path: '**',
        pathMatch: 'full',
        redirectTo: 'home'
    },
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule { }
