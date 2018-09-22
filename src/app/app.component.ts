import {Component} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';

@Component({
    moduleId: module.id,
    selector: 'app-root',
    templateUrl: './app.component.html'
})
export class AppComponent {

    private defaultLang = 'fr';
    translate;
    flag = 'gb';

    constructor(translate: TranslateService) {

        translate.setDefaultLang(this.defaultLang);
        translate.use(this.defaultLang);
        this.translate = translate;
    }

    get currentUser(): any {
        return JSON.parse(localStorage.getItem('currentUser'));
    }

    switchLanguage() {

        var lang = this.defaultLang;

        switch (this.translate.currentLang) {

            case 'en':
                lang = 'fr';
                this.flag = 'gb';
                break;
            case 'fr':
                lang = 'en';
                this.flag = 'fr';
                break;
        }

        this.translate.use(lang);
    }
}
