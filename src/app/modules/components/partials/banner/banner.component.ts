import { Component } from '@angular/core';

import { environment } from 'src/environments/environment.development';

@Component({
    selector: 'app-banner',
    templateUrl: './banner.component.html',
    styleUrls: ['./banner.component.sass']
})
export class BannerComponent {

    bannerImg: string = `${environment.imgPath}/Marvel_Logo.png`;

}
