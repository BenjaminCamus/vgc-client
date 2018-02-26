import {Component, ElementRef, trigger, style, animate, transition} from "@angular/core";
import {Input, HostListener} from "@angular/core/src/metadata/directives";
import {ViewChild} from "@angular/core/src/metadata/di";
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

        // If UserGame
        if (data
            && data.game
            && data.game.screenshots
            && data.game.screenshots.length > 0) {

            this.game = data.game;
        }

        // ElseIf Games (for IGDB search)
        else if (data
            && data[0]
            && data[0].screenshots
            && data[0].screenshots.length > 0) {

            this.game = data[0];
        }
        else {
            this.game = null;
        }

        if (this.game) {
            let rand = Math.floor(Math.random() * this.game.screenshots.length);
            let imageId = this.game.screenshots[rand].cloudinaryId;

            let image = 'http://images.igdb.com/igdb/image/upload/t_original/' + imageId + '.jpg';

            if (this.image) {
                this.image = null;
                this.image2 = image;
            }
            else {
                this.image = image;
                this.image2 = null;
            }
        }
        else {
            let rand = Math.floor(Math.random() * 187) + 1;
            let str = "" + rand;
            let pad = "000";
            let imageId = pad.substring(0, pad.length - str.length) + str;

            this.image = 'assets/img/pixel-bg/pixel-background-'+imageId+'.gif';
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