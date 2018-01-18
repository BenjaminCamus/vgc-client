import {Game} from "./game";
import {Platform} from "./platform";
import {Contact} from "./contact";
import {Place} from "./place";

export class UserGame {
    game: Game = new Game;
    platform: Platform = new Platform;
    releaseDate: Date;

    rating: number;
    box: boolean = true;
    manual: boolean = true;
    version: string = 'FRA';
    progress: number = 2;

    priceAsked: number;
    pricePaid: number;
    priceResale: number;
    priceSold: number;

    purchaseDate: Date;
    saleDate: Date;

    purchasePlace: Place;
    salePlace: Place;

    purchaseContact: Contact;
    saleContact: Contact;

    note: string;

    fields = [];

    constructor() {

        this.fields['progress'] = {type: 'string', label: 'Progression'};
        this.fields['platform.name'] = {type: 'string', label: 'Plateforme'};
        this.fields['game.name'] = {type: 'string', label: 'Titre'};
        this.fields['version'] = {type: 'string', label: 'Verion'};
        this.fields['state'] = {type: 'state', label: 'Etat'};
        this.fields['rating'] = {type: 'string', label: 'Note'};
        this.fields['pricePaid'] = {type: 'price', label: 'Payé'};
        this.fields['priceAsked'] = {type: 'price', label: 'Demandé'};
        this.fields['purchaseDate'] = {type: 'date', label: 'Date Achat'};
        this.fields['purchasePlace'] = {type: 'name', label: 'Lieu Achat'};
        this.fields['purchaseContact'] = {type: 'name', label: 'Vendeur'};
        this.fields['priceResale'] = {type: 'price', label: 'Estimation'};
        this.fields['priceSold'] = {type: 'price', label: 'Vendu', hiddenMD: true};
        this.fields['saleDate'] = {type: 'date', label: 'Date Vente', hiddenMD: true};
        this.fields['salePlace'] = {type: 'name', label: 'Lieu Vente', hiddenMD: true};
        this.fields['saleContact'] = {type: 'name', label: 'Acheteur', hiddenMD: true};

        for (let field in this.fields) {
            this.fields[field].name = field;
        }
    }
}