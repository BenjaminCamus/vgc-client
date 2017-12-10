import {Component, Renderer, OnInit, ViewChild} from '@angular/core';
import {Router}            from '@angular/router';
import {SlimLoadingBarService} from 'ng2-slim-loading-bar';
import {ModalComponent} from 'ng2-bs3-modal/ng2-bs3-modal';
import {routerTransition} from '../../_animations/router.animations';
import {GameService}       from '../../_services/game.service';
import {UserGame} from "../../_models/userGame";
import {Company} from "../../_models/company";
import {deepIndexOf, orderByName, orderByCount} from "../../functions";
import {Platform} from "../../_models/platform";
import {UserGameFilter} from "../../_models/userGameFilter";
import {Place} from "../../_models/place";

@Component({
    moduleId: module.id,
    providers: [GameService],
    selector: 'game-list',
    templateUrl: './game-list.component.html',
    animations: [routerTransition()],
    host: {'[@routerTransition]': 'state', class: 'mainPage'}
})
export class GamesComponent implements OnInit {

    loading: boolean = false;

    state = "none";

    @ViewChild('modal')
    modal: ModalComponent;

    errorMessage: string;
    userGames: UserGame[] = [];
    userGameFilter: UserGameFilter = new UserGameFilter();
    displayFilters: boolean = false;
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

    constructor(private gameService: GameService,
                private router: Router,
                private slimLoadingBarService: SlimLoadingBarService,
                private renderer: Renderer,) {
    }

    ngOnInit() {
        if (localStorage.getItem('userGames')) {
            this.userGames = JSON.parse(localStorage.getItem('userGames'));
            this.setFilters();
        }
        else {
            this.getGames();
        }
    }

    getGames() {

        if (!this.loading) {

            this.loading = true;

            this.slimLoadingBarService.start();

            this.developerTags = [];
            this.publisherTags = [];
            this.userGames = [];

            this.gameService.getUserGames()
                .subscribe(
                    userGames => {

                        userGames.sort(orderByName);
                        this.userGames = userGames;

                        localStorage.setItem('userGames', JSON.stringify(this.userGames));

                        this.setFilters();

                        this.loading = false;
                        this.slimLoadingBarService.complete();
                    },
                    error => {
                        this.slimLoadingBarService.complete();
                        this.errorMessage = <any>error;
                    });
        }
    }

    private setFilters() {

        var minRating = 20;
        var maxRating = 0;
        var minPrice = 1000000000;
        var maxPrice = 0;

        for (let userGame of this.userGames) {

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

            // userGame local storage
            localStorage.setItem('game/'+userGame.platform.slug+'/'+userGame.game.slug, JSON.stringify(userGame));

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

    setItemClass(e) {
        if (e.value) {
            this.renderer.setElementProperty(e.target, 'className', 'gameBox visible_anim');
        } else {
            this.renderer.setElementProperty(e.target, 'className', 'gameBox');
        }
    }
}