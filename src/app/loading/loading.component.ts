import {Component, OnInit} from "@angular/core";
import {Input} from "@angular/core/src/metadata/directives";

@Component({
    moduleId: module.id,
    selector: 'loading',
    templateUrl: './loading.component.html',
})
export class LoadingComponent implements OnInit {

    @Input() status: string;

    private title: string;
    private subtitle: string;

    constructor() {
    }

    ngOnInit(): void {
        switch (this.status) {
            default:
                this.title = 'Sauvegarde en cours';
                this.subtitle = 'Veuillez ne pas éteindre la console ni retirer la cartouche';
                break;

        }
    }
}