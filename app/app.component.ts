import { Component } from '@angular/core';
import { ServerService } from './services/server';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent {
    title = 'proyecto-fe';
    constructor(
        public server: ServerService) { }
}
