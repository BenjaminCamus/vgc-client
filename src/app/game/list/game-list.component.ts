import {Component, Renderer, OnInit, OnDestroy, OnChanges, SimpleChanges, ViewChild} from '@angular/core';
import {Router}            from '@angular/router';
import {SlimLoadingBarService} from 'ng2-slim-loading-bar';
import {ModalComponent} from 'ng2-bs3-modal/ng2-bs3-modal';
import {routerTransition} from '../../_animations/router.animations';
import {GameService}       from '../../_services/game.service';
import {GameLocalService}       from '../../_services/gameLocal.service';
import {UserGame} from "../../_models/userGame";
import {Company} from "../../_models/company";
import {deepIndexOf, orderByName, orderByCount} from "../../functions";
import {Platform} from "../../_models/platform";
import {UserGameFilter} from "../../_models/userGameFilter";
import {Place} from "../../_models/place";
import {DatePipe} from "@angular/common";
import {FormatNamePipe} from "../../_pipes/formatName.pipe";

@Component({
    moduleId: module.id,
    providers: [GameService, DatePipe, FormatNamePipe],
    selector: 'game-list',
    templateUrl: './game-list.component.html',
    animations: [routerTransition()],
    host: {'[@routerTransition]': 'state', class: 'mainPage'}
})
export class GamesComponent implements OnInit {

    errorMessage: string;

    private subscription;
    private userGames: UserGame[] = [];
    private userGameFilter: UserGameFilter = new UserGameFilter();

    userGameFields = [
        {name: 'platform.name', type: 'string', label: 'Plateforme'},
        {name: 'game.name', type: 'string', label: 'Titre'},
        {name: 'state', type: 'state', label: 'Etat'},
        {name: 'pricePaid', type: 'price', label: 'Prix Payé'},
        {name: 'priceAsked', type: 'price', label: 'Prix Demandé'},
        {name: 'purchaseDate', type: 'date', label: 'Date Achat'},
        {name: 'purchaseContact', type: 'contact', label: 'Contact Achat'},
        {name: 'priceResale', type: 'price', label: 'Estimation Vente'},
        {name: 'priceSold', type: 'price', label: 'Prix Vente', hiddenMD: true},
        {name: 'saleDate', type: 'date', label: 'Date Vente', hiddenMD: true},
        {name: 'saleContact', type: 'contact', label: 'Contact Vente', hiddenMD: true}
    ];

    userGameValues = [];

    displayFilters: boolean = false;
    displayMode: number = 0;
    orderField: string = 'game.name';
    orderOption: boolean = true;

    purchasePlaceTags: Place[] = [];
    salePlaceTags: Place[] = [];
    purchaseContactTags: Place[] = [];
    saleContactTags: Place[] = [];
    platformTags: Platform[] = [];
    developerTags: Company[] = [];
    publisherTags: Company[] = [];

    purchasePlaceCount: number[] = [];
    salePlaceCount: number[] = [];
    purchaseContactCount: number[] = [];
    saleContactCount: number[] = [];
    platformCount: number[] = [];
    developerCount: number[] = [];
    publisherCount: number[] = [];

    @ViewChild('modal') modal: ModalComponent;

    constructor(private gameService: GameService,
                private gameLocalService: GameLocalService,
                private router: Router,
                private slimLoadingBarService: SlimLoadingBarService,
                private renderer: Renderer,
                private datePipe: DatePipe,
                private formatNamePipe: FormatNamePipe) {
    }

    ngOnInit() {
        this.slimLoadingBarService.reset();

        this.userGames = this.gameLocalService.getUserGames();
        this.setFilters();

        this.getGames();
    }

    ngOnDestroy() {
        if (this.subscription) {
            this.subscription.unsubscribe();
        }
    }

    getGames() {

        if (this.slimLoadingBarService.progress == 0) {

            this.slimLoadingBarService.start();

            this.subscription = this.gameService.getUserGames().subscribe(
                userGames => {

                    userGames.sort(orderByName);
                    this.userGames = userGames;

                    this.gameLocalService.setUserGames(this.userGames);

                    this.setFilters();

                    this.slimLoadingBarService.complete();
                },
                error => {
                    this.slimLoadingBarService.complete();
                    this.errorMessage = <any>error;
                });
        }
    }

    private setFilters() {

        this.purchasePlaceTags = [];
        this.salePlaceTags = [];
        this.purchaseContactTags = [];
        this.saleContactTags = [];
        this.platformTags = [];
        this.developerTags = [];
        this.publisherTags = [];

        this.purchasePlaceCount = [];
        this.salePlaceCount = [];
        this.purchaseContactCount = [];
        this.saleContactCount = [];
        this.platformCount = [];
        this.developerCount = [];
        this.publisherCount = [];

        var minRating = 20;
        var maxRating = 0;
        var minPrice = 1000000000;
        var maxPrice = 0;

        for (let userGame of this.userGames) {

            // Formatted Values
            if (!this.userGameValues[userGame.game.id]) {
                this.userGameValues[userGame.game.id] = [];
            }
            if (!this.userGameValues[userGame.game.id][userGame.platform.id]) {
                this.userGameValues[userGame.game.id][userGame.platform.id] = [];
            }

            for (let field of this.userGameFields) {
                this.userGameValues[userGame.game.id][userGame.platform.id][field.name] = this.getFieldValue(userGame, field);
            }

            // Rating
            if (userGame.rating < minRating) {
                minRating = userGame.rating;
            }

            if (userGame.rating > maxRating) {
                maxRating = userGame.rating;
            }

            var minP = Math.min(userGame.priceAsked, userGame.pricePaid, userGame.priceResale, userGame.priceSold);
            if (minP < minPrice) {
                minPrice = minP;
            }

            var maxP = Math.max(userGame.priceAsked, userGame.pricePaid, userGame.priceResale, userGame.priceSold);
            if (maxP > maxPrice) {
                maxPrice = maxP;
            }

            // Tags
            var tagTypes = ['platform', 'purchasePlace', 'salePlace', 'purchaseContact', 'saleContact'];
            for (let type of tagTypes) {
                if (userGame[type]) {
                    if (deepIndexOf(this[type + 'Tags'], userGame[type]) < 0) {

                        this[type + 'Tags'].push(userGame[type]);
                        this[type + 'Count'][userGame[type].id] = 0;
                    }

                    this[type + 'Count'][userGame[type].id]++;
                }
            }


            // Developers
            if (userGame.game.developers && userGame.game.developers.length > 0) {

                for (let developer of userGame.game.developers) {

                    if (deepIndexOf(this.developerTags, developer) < 0) {

                        this.developerTags.push(developer);
                        this.developerCount[developer.id] = 0;
                    }

                    this.developerCount[developer.id]++;
                }
            }

            // Publishers
            if (userGame.game.publishers && userGame.game.publishers.length > 0) {

                for (let publisher of userGame.game.publishers) {

                    if (deepIndexOf(this.publisherTags, publisher) < 0) {

                        this.publisherTags.push(publisher);
                        this.publisherCount[publisher.id] = 0;
                    }

                    this.publisherCount[publisher.id]++;
                }
            }

            // UserGame Local Storage
            this.gameLocalService.setUserGame(userGame);
        }

        // orderByCount
        this.platformTags.sort(orderByCount(this.platformCount));
        this.developerTags.sort(orderByCount(this.developerCount));
        this.publisherTags.sort(orderByCount(this.publisherCount));

        this.userGameFilter.ratingRange = [minRating, maxRating];
        this.userGameFilter.minRating = minRating;
        this.userGameFilter.maxRating = maxRating;

        this.userGameFilter.priceAskedRange = [minPrice, maxPrice];
        this.userGameFilter.pricePaidRange = [minPrice, maxPrice];
        this.userGameFilter.priceResaleRange = [minPrice, maxPrice];
        this.userGameFilter.priceSoldRange = [minPrice, maxPrice];
        this.userGameFilter.minPrice = minPrice;
        this.userGameFilter.maxPrice = maxPrice;
    }


    toggleTag(type, active, tag) {

        switch (type) {

            case 'platforms':
            case 'purchasePlaces':
            case 'salePlaces':
            case 'purchaseContacts':
            case 'saleContacts':
            case 'progresses':
            case 'versions':

                if (active) {
                    this.userGameFilter.addElement(type, tag);
                }
                else {
                    this.userGameFilter.removeElement(type, tag);
                }
                break;

            case 'developer':
            case 'publisher':

                if (active) {
                    this.userGameFilter.game.addCompany(type, tag);
                }
                else {
                    this.userGameFilter.game.removeCompany(type, tag);
                }
                break;
        }
    }

    getFieldValue(userGame, field) {
        if (field.name.indexOf('.') > -1) {
            var fieldSplit = field.name.split('.');
            var value = userGame[fieldSplit[0]][fieldSplit[1]];
        }
        else {
            var value = userGame[field.name];
        }

        if (!value && field.type != 'state') {
            return '•';
        }

        switch (field.type) {
            case 'price':
                value += ' €';
                break;
            case 'date':
                value = this.datePipe.transform(value, 'yyyy-MM-dd');
                break;
            case 'contact':
                value = this.formatNamePipe.transform(value);
                break;
            case 'state':
                if (userGame.box) {
                    if (userGame.manual) {
                        value = 'Complet';
                    }
                    else {
                        value = 'Boîte sans livret';
                    }
                }
                else {
                    if (userGame.manual) {
                        value = 'Livret sans boîte';
                    }
                    else {
                        value = 'Loose';
                    }
                }
                break;
        }

        return value;
    }

    setOrderField(orderField: string) {
        if (this.orderField == orderField) {
            this.orderOption = !this.orderOption;
        }
        else {
            this.orderField = orderField;
            this.orderOption = true;
        }

    }

    setItemClass(e) {
        if (e.value) {
            this.renderer.setElementProperty(e.target, 'className', 'gameBox visible_anim');
        } else {
            this.renderer.setElementProperty(e.target, 'className', 'gameBox');
        }
    }
}