import {Component, OnInit} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import {GameLocalService} from "./_services/gameLocal.service";

@Component({
    moduleId: module.id,
    selector: 'app-root',
    templateUrl: './app.component.html'
})
export class AppComponent implements OnInit {

    private defaultLang = 'fr';
    flag = 'gb';
    welcome: boolean;

    constructor(private translate: TranslateService,
                private gameLocalService: GameLocalService) {

        translate.setDefaultLang(this.defaultLang);
        translate.use(this.defaultLang);
    }

    ngOnInit() {
        this.welcome = this.gameLocalService.getOption('welcomeShow');
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
