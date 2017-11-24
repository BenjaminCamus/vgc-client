import {Game} from "./game";
import {Platform} from "./platform";
import {Contact} from "./contact";
import {Place} from "./place";

export class UserGame {
    game: Game = new Game;
    platform: Platform = new Platform;
    platforms: Platform[] = [];

    rating: number;
    box: boolean = true;
    manual: boolean = true;
    version: string = 'FRA';
    progress: number = 2;

    priceAsked: number;
    pricePaid: number;
    priceResale: number;
    priceSold: number;

    purchaseDate: Object;
    saleDate: Object;

    purchasePlace: Place;
    salePlace: Place;

    purchaseContact: Contact;
    saleContact: Contact;

    note: string;

    addPlatform(platform: Platform) {
        this.platforms.push(platform);

        this.platforms = this.platforms.filter(function(elem, index, self) {
            return index == self.indexOf(elem);
        });

        return this;
    }

    removePlatform(platform: Platform) {
        var index = this.platforms.indexOf(platform, 0);
        if (index > -1) {
            this.platforms.splice(index, 1);
        }

        return this;
    }
}