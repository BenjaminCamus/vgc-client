import {Game} from "./game";
import {Platform} from "./platform";
import {Contact} from "./contact";
import {Place} from "./place";

export class UserGame {
    game: Game = new Game;
    platform: Platform = new Platform;

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
}