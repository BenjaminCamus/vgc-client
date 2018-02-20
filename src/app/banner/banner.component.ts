import {Component, ElementRef} from "@angular/core";
import {Input, HostListener} from "@angular/core/src/metadata/directives";
import {UserGame} from "../_models/userGame";
import {ViewChild} from "@angular/core/src/metadata/di";

@Component({
    moduleId: module.id,
    selector: 'banner',
    templateUrl: './banner.component.html',
})
export class BannerComponent {

    image: string;
    defaultImage: string = 'gko0jchtb85kbsc1dg9l';

    _userGames: any;
    @Input() set userGames(userGames: any) {
        this._userGames = userGames;
        this.setImage();
    }

    setImage() {
        if (this._userGames
            && this._userGames[0]
            && this._userGames[0].game
            && this._userGames[0].game.screenshots
            && this._userGames[0].game.screenshots[0]
            && this._userGames[0].game.screenshots[0].cloudinaryId) {
            this.image = this._userGames[0].game.screenshots[0].cloudinaryId;
        }
        else if (this._userGames
            && this._userGames[0]
            && this._userGames[0].screenshots
            && this._userGames[0].screenshots[0]
            && this._userGames[0].screenshots[0].cloudinaryId) {
            this.image = this._userGames[0].screenshots[0].cloudinaryId;
        }
        else {
            this.image = this.defaultImage;
        }

    }


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
        var height = this.gameBanner.nativeElement.offsetHeight + window.pageYOffset + 70;
        height = height < 0 ? 0 : height;

        if (height <= 0) {
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