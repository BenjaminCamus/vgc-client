import {Component, Input, OnInit} from "@angular/core";
import {Game} from "../../_models/game";
import {Lightbox} from 'ngx-lightbox';
import {environment} from "../../../environments/environment";

@Component({
    moduleId: module.id,
    selector: 'game-images',
    templateUrl: './game-images.component.html'
})
export class GameImagesComponent {

    @Input() game: Game;
    private album: any[] = [];

    private coverThumb;

    constructor(private _lightbox: Lightbox) {
    }

    ngOnInit() {

        let caption = this.game.name;
        let src = environment.imagesUrl + 't_original/' + this.game.cover.cloudinaryId + '.jpg';
        this.coverThumb = environment.imagesUrl + 't_cover_big/' + this.game.cover.cloudinaryId + '.jpg';

        let pic = {
            caption: caption,
            src: src,
            thumb: this.coverThumb
        };

        this.album.push(pic);

        for (let i in this.game.screenshots) {

            let sc = this.game.screenshots[i];
            let caption = this.game.name + ' • ' + (parseInt(i, 10) + 1) + '/' + this.game.screenshots.length;
            let src = environment.imagesUrl + 't_original/' + sc.cloudinaryId + '.jpg';
            let thumb = environment.imagesUrl + 't_thumb/' + sc.cloudinaryId + '.jpg';

            let pic = {
                caption: caption,
                src: src,
                thumb: thumb
            };

            this.album.push(pic);
        }
    }

    open(index: number): void {

        this._lightbox.open(this.album, index);
    }
}