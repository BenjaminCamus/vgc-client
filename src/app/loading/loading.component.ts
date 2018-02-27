import {Component, OnInit} from "@angular/core";
import {Input, HostListener} from "@angular/core/src/metadata/directives";

@Component({
    moduleId: module.id,
    selector: 'loading',
    templateUrl: './loading.component.html',
})
export class LoadingComponent implements OnInit {

    @Input() action: string;

    private image: string;
    private title: string;
    private subtitle: string;

    constructor() {
    }

    @HostListener('document:keyup', ['$event'])
    handleKeyboardEvent(event: KeyboardEvent) {
        this.randomBgIndex();
    }

    ngOnInit(): void {
        this.randomBgIndex();

        switch (this.action) {
            case 'login':
                this.title = 'Connexion en cours';
                break;
            case 'register':
                this.title = 'Inscription en cours';
                break;
            default:
                this.title = 'Sauvegarde en cours';
                break;

        }

        this.subtitle = 'Veuillez ne pas éteindre la console ni retirer la cartouche';
    }

    randomBgIndex() {
        let rand = Math.floor(Math.random() * 187) + 1;
        let str = "" + rand;
        let pad = "000";
        let imageId = pad.substring(0, pad.length - str.length) + str;

        this.image = 'assets/img/pixel-bg/pixel-background-'+imageId+'.gif';
    }
}