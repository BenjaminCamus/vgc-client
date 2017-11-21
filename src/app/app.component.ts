import {Component} from '@angular/core';

@Component({
    moduleId: module.id,
    selector: 'app-root',
    templateUrl: './app.component.html'
})
export class AppComponent {

    title = 'COLLECTORAMA';

    get currentUser(): any {
        return JSON.parse(localStorage.getItem('currentUser'));
    }
}
