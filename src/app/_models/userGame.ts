import {Game} from './game';
import {Platform} from './platform';
import {Contact} from './contact';
import {User} from './user';

export class UserGame {
    id = '';
    user: User;
    game: Game = new Game;
    platform: Platform = new Platform;
    releaseDate: Date;

    rating: number;
    version = 'FRA';
    progress = 'NEVER_PLAYED';
    cond = 'VERY_GOOD';
    completeness = 'COMPLETE';

    priceAsked: number;
    pricePaid: number;
    priceResale: number;
    priceSold: number;

    purchaseDate: Date;
    saleDate: Date;

    purchasePlace: string;
    salePlace: string;

    purchaseContact: Contact;
    saleContact: Contact;

    note: string;

    createdAt: any;
    updatedAt: any;

    fieldTypes = {
        platform: 'name',
        releaseDate: 'date',
        progress: 'progress',
        cond: 'cond',
        version: 'string',
        completeness: 'completeness',
        rating: 'rating',
        pricePaid: 'price',
        priceAsked: 'price',
        purchaseDate: 'date',
        purchasePlace: 'string',
        purchaseContact: 'name',
        priceResale: 'price',
        priceSold: 'price',
        saleDate: 'date',
        salePlace: 'string',
        saleContact: 'name'
    };
}
