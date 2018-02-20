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

    _data: any;
    @Input() set data(data: any) {
        this._data = data;
        this.setImage();
    }

    setImage() {
        // If UserGame
        if (this._data
            && this._data.game
            && this._data.game.screenshots
            && this._data.game.screenshots[0]
            && this._data.game.screenshots[0].cloudinaryId) {
            this.image = this._data.game.screenshots[0].cloudinaryId;
        }
        // If Game[]
        else if (this._data
            && this._data[0]
            && this._data[0].screenshots
            && this._data[0].screenshots[0]
            && this._data[0].screenshots[0].cloudinaryId) {
            this.image = this._data[0].screenshots[0].cloudinaryId;
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