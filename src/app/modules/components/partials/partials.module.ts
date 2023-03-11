import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BannerComponent } from './banner/banner.component';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { SearchComponent } from './search/search.component';
import { ListComponent } from './list/list.component';



@NgModule({
  declarations: [
    BannerComponent,
    HeaderComponent,
    FooterComponent,
    SearchComponent,
    ListComponent
  ],
  imports: [
    CommonModule
  ]
})
export class PartialsModule { }
