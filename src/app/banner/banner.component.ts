import {Component, ElementRef, Input, HostListener, ViewChild} from "@angular/core";
import {trigger, animate, style, transition} from '@angular/animations';
import {Game} from "../_models/game";

@Component({
    moduleId: module.id,
    selector: 'banner',
    templateUrl: './banner.component.html',
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
export class BannerComponent {

    game: Game;
    image: string;
    image2: string;

    @Input() set data(data: any) {

        // If Game
        if (data
            && data.name) {

            this.game = data;
        }

        // ElseIf UserGame
        else if (data
            && data.game) {

            this.game = data.game;
        }

        // ElseIf Games (for IGDB search)
        else if (data
            && data[0]
            && data[0].name) {

            this.game = data[0];
        }
        else {
            this.game = null;
        }

        let image = '';

        if (this.game && this.game.screenshots && this.game.screenshots.length > 0) {
            let rand = Math.floor(Math.random() * this.game.screenshots.length);
            let imageId = this.game.screenshots[rand].cloudinaryId;

            image = 'http://images.igdb.com/igdb/image/upload/t_original/' + imageId + '.jpg';
        }
        else {
            let rand = Math.floor(Math.random() * 222) + 1;
            let str = "" + rand;
            let pad = "000";
            let imageId = pad.substring(0, pad.length - str.length) + str;

            image = 'assets/img/pixel-bg/pixel-background-' + imageId + '.gif';
        }

        if (this.image != '') {
            this.image = '';
            this.image2 = image;
        }
        else {
            this.image = image;
            this.image2 = '';
        }
    }


    // Banner Resize
    @Input() resize: boolean = false;

    bannerMarginLeft: number;
    bannerWidth: number;
    bannerHeight: number;

    @ViewChild('gameBanner') gameBanner: ElementRef;

    @HostListener('window:scroll', ['$event']) onWindowScroll(event) {
        this.resizeBanner();
    }

    @HostListener('window:resize', ['$event']) onResize(event) {
        this.resizeBanner();
    }

    resizeBanner() {

        if (this.resize) {
            if (window.pageYOffset > this.gameBanner.nativeElement.offsetHeight) {
                this.bannerMarginLeft = 0;
                this.bannerWidth = 0;
                this.bannerHeight = 0;

            }
            else {
                this.bannerMarginLeft = -window.pageYOffset / 2;
                this.bannerWidth = this.gameBanner.nativeElement.offsetWidth + window.pageYOffset;
                this.bannerHeight = this.gameBanner.nativeElement.offsetHeight + window.pageYOffset + 70;

            }
        }
    }

}