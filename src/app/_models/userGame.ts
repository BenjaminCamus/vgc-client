import {Game} from "./game";
import {Platform} from "./platform";
import {Contact} from "./contact";

export class UserGame {
    id: string = '';
    game: Game = new Game;
    platform: Platform = new Platform;
    releaseDate: Date;

    rating: number;
    version: string = 'FRA';
    progress: number = 0;
    cond: number = 2;
    completeness: number = 3;

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

    fields = [];

    createdAt: any;
    updatedAt: any;

    constructor() {

        this.fields['game.name'] = {type: 'string', label: 'Titre'};
        this.fields['game.series'] = {type: 'tags', label: 'Série'};
        this.fields['game.developers'] = {type: 'tags', label: 'Développeur'};
        this.fields['game.publishers'] = {type: 'tags', label: 'Editeur'};
        this.fields['game.modes'] = {type: 'tags', label: 'Mode'};
        this.fields['game.themes'] = {type: 'tags', label: 'Thème'};
        this.fields['game.genres'] = {type: 'tags', label: 'Genre'};
        this.fields['game.rating'] = {type: 'rating', label: 'Note IGDB'};
        this.fields['game.igdbUrl'] = {type: 'url', label: 'Page IGDB'};

        this.fields['platform.name'] = {type: 'string', label: 'Plateforme'};

        this.fields['releaseDate'] = {type: 'date', label: 'Date de sortie'};
        this.fields['progress'] = {type: 'progress', label: 'Progression'};
        this.fields['cond'] = {type: 'cond', label: 'État'};
        this.fields['version'] = {type: 'string', label: 'Version'};
        this.fields['completeness'] = {type: 'completeness', label: 'Jeu'};
        this.fields['rating'] = {type: 'rating', label: 'Note'};
        this.fields['pricePaid'] = {type: 'price', label: 'Payé'};
        this.fields['priceAsked'] = {type: 'price', label: 'Demandé'};
        this.fields['purchaseDate'] = {type: 'date', label: 'Date Achat'};
        this.fields['purchasePlace'] = {type: 'string', label: 'Lieu Achat'};
        this.fields['purchaseContact'] = {type: 'name', label: 'Vendeur'};
        this.fields['priceResale'] = {type: 'price', label: 'Estimation'};
        this.fields['priceSold'] = {type: 'price', label: 'Vendu', hiddenMD: true};
        this.fields['saleDate'] = {type: 'date', label: 'Date Vente', hiddenMD: true};
        this.fields['salePlace'] = {type: 'string', label: 'Lieu Vente', hiddenMD: true};
        this.fields['saleContact'] = {type: 'name', label: 'Acheteur', hiddenMD: true};

        for (let field in this.fields) {
            this.fields[field].name = field;
        }
    }
}
