import { Component, OnInit } from '@angular/core';

// Importamos el servicio de BreakpointObserver para detectar si es un dispositivo móvil o no
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.sass']
})
export class AppComponent {
  title = 'marvel-heroes-app';
  public isMobile: boolean = false;
  public status: string = '';

  constructor(private responsive: BreakpointObserver) { }

  ngOnInit(): void {

    // Preparamos la página para poder detectar si es un dispositivo móvil o no y crear estilos responsivos si fuera necesario
    this.responsive.observe([Breakpoints.Handset, Breakpoints.Tablet]).subscribe((result) => {
      this.isMobile = false;
      this.responsive.observe([Breakpoints.Handset, Breakpoints.Tablet]).subscribe((result) => {
        this.isMobile = result.matches;
        this.status = this.isMobile ? 'Mobile' : 'Desktop';
      });
    });
  }
}
