import {Component, Input, OnInit} from "@angular/core";
import {trigger, animate, style, transition} from '@angular/animations';
import {Game} from "../../_models/game";
import {Lightbox} from 'ngx-lightbox';

@Component({
    moduleId: module.id,
    selector: 'game-images',
    templateUrl: './game-images.component.html',
    animations: [
        trigger('transition', [
            transition('void => *', [
                style({opacity: 0}),
                animate(1000, style({opacity: 1}))
            ]),
            transition('* => void', [
                style({opacity: 1}),
                animate(1000, style({opacity: 0}))
            ])
        ])
    ]
})
export class GameImagesComponent {

    @Input() game: Game;
    private _album: any[] = [];

    constructor(private _lightbox: Lightbox) {
    }

    ngOnInit() {

        const src = 'http://images.igdb.com/igdb/image/upload/t_original/' + this.game.cover.cloudinaryId + '.jpg';
        const caption = this.game.name;
        const thumb = 'http://images.igdb.com/igdb/image/upload/t_cover_big/' + this.game.cover.cloudinaryId + '.jpg';

        const album = {
            src: src,
            caption: caption,
            thumb: thumb
        };

        this._album.push(album);

        for (let i in this.game.screenshots) {

            const sc = this.game.screenshots[i];
            const src = 'http://images.igdb.com/igdb/image/upload/t_original/' + sc.cloudinaryId + '.jpg';
            const caption = this.game.name + ' • ' + (parseInt(i,10)+1) + '/' + this.game.screenshots.length;
            const thumb = 'http://images.igdb.com/igdb/image/upload/t_thumb/' + sc.cloudinaryId + '.jpg';

            const album = {
                src: src,
                caption: caption,
                thumb: thumb
            };

            this._album.push(album);
        }
    }

    open(index: number): void {

        this._lightbox.open(this._album, index);
    }
}