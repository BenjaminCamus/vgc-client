import {Component, Renderer2, OnInit, HostListener} from '@angular/core';
import {Router}            from '@angular/router';
import {routerTransition} from '../../_animations/router.animations';
import {GameService}       from '../../_services/game.service';
import {GameLocalService}       from '../../_services/gameLocal.service';
import {UserGame} from "../../_models/userGame";
import {deepIndexOf, orderByName, orderByCount} from "../../functions";
import {UserGameFilter} from "../../_models/userGameFilter";
import {DatePipe} from "@angular/common";
import {FormatNamePipe} from "../../_pipes/formatName.pipe";
import {FilterPipe} from "../../_pipes/filter.pipe";
import {LengthPipe} from "../../_pipes/length.pipe";
import {TotalPipe} from "../../_pipes/total.pipe";
import {OrderByPipe} from "../../_pipes/orderBy.pipe";

@Component({
    moduleId: module.id,
    providers: [GameService, FilterPipe, OrderByPipe, DatePipe, FormatNamePipe, LengthPipe, TotalPipe],
    selector: 'game-list',
    templateUrl: './game-list.component.html',
    animations: [routerTransition()],
    host: {'[@routerTransition]': '', class: 'mainPage'}
})
export class GamesComponent implements OnInit {

    loading: boolean = false;
    loadingAction: string;

    title = 'VGC';

    errorMessage: string;

    private subscription;
    private numCall = 0;
    private totalCalls = 0;
    private packNumber = 20;
    total = 0;
    userGames: UserGame[] = [];
    userGameFilter: UserGameFilter = new UserGameFilter();

    userGamesDate;
    selectedUserGame: UserGame;
    selectedUserGame1: UserGame;
    selectedUserGame2: UserGame;
    transitionState = 'next';
    prevUserGame: UserGame;
    nextUserGame: UserGame;

    displayUserGame: boolean = false;
    displayNewUserGame: boolean = false;
    displayChart: boolean = false;

    userGameFields = [];

    tableFields = ['progress', 'game.name', 'platform.name', 'version', 'cond', 'completeness', 'rating',
        'pricePaid', 'priceAsked', 'purchaseDate', 'purchasePlace', 'purchaseContact',
        'priceResale', 'priceSold', 'saleDate', 'salePlace', 'saleContact'];

    displayFilters: boolean = false;
    displayMode: number = 0;
    orderField: string = 'purchaseDate';
    orderOption: boolean = false;

    filters = {
        tags: {
            purchasePlace: [],
            salePlace: [],
            purchaseContact: [],
            saleContact: [],
            platforms: [],
            series: [],
            developers: [],
            publishers: [],
            modes: [],
            themes: [],
            genres: []

        },
        count: {
            purchasePlace: [],
            salePlace: [],
            purchaseContact: [],
            saleContact: [],
            platforms: [],
            series: [],
            developers: [],
            publishers: [],
            modes: [],
            themes: [],
            genres: [],

            version: [],
            progress: [],
            cond: [],
            completeness: []

        }
    }

    constructor(private gameService: GameService,
                private gameLocalService: GameLocalService,
                private router: Router,
                private renderer: Renderer2,
                private filterPipe: FilterPipe,
                private orderByPipe: OrderByPipe) {

        var ug = new UserGame();
        this.userGameFields = ug.fields;
    }

    @HostListener('document:keyup', ['$event'])
    handleKeyboardEvent(event: KeyboardEvent) {
        switch (event.key) {
            case 'ArrowLeft':
                this.navUserGame(true);
                break;
            case 'ArrowRight':
                this.navUserGame();
                break;
            case '+':
                this.openNewUserGame();
                break;
            case 'Escape':
                this.closeUserGame();
                this.closeNewUserGame();
                break;
            case 'Enter':
                if (!this.displayUserGame && this.selectedUserGame && !this.displayNewUserGame && !this.displayFilters) {
                    this.openUserGame(this.selectedUserGame);
                }
                break;
        }
    }

    ngOnInit() {
        this.loading = false;

        this.userGames = this.gameLocalService.getUserGames();
        this.userGamesDate = this.gameLocalService.getUserGamesDate();
        this.setFilters();

        if (this.userGames.length == 0) {
            this.getGames();
        }
    }

    ngOnDestroy() {
        if (this.subscription) {
            this.subscription.unsubscribe();
        }
    }

    getGames() {

        if (!this.loading) {

            this.userGames = [];
            this.numCall = 0;
            this.total = 0;
            this.loadingAction = 'sync';
            this.loading = true;

            this.subscription = this.gameService.countUserGames().subscribe(
                count => {

                    this.totalCalls = Math.floor(count / this.packNumber);
                    this.total = count;
                    this.getGamesPack();

                },
                error => {
                    this.loading = false;
                    this.errorMessage = <any>error;
                });
        }
    }

    private getGamesPack() {

        this.subscription = this.gameService.getUserGames(this.numCall * this.packNumber, this.packNumber).subscribe(
            userGames => {

                this.userGames.push.apply(this.userGames, userGames);

                if (this.numCall < this.totalCalls) {
                    this.numCall++;
                    this.getGamesPack();
                }
                else {

                    this.userGames.sort(orderByName);

                    this.gameLocalService.setUserGames(this.userGames);
                    this.userGamesDate = this.gameLocalService.setUserGamesDate();

                    this.setFilters();

                    this.loading = false;
                }
            },
            error => {
                this.loading = false;
                this.errorMessage = <any>error;
            });

    }

    openNewUserGame() {
        this.closeUserGame();
        this.displayNewUserGame = true;
    }

    closeNewUserGame() {
        this.displayNewUserGame = false;
    }

    openUserGame(userGame) {
        this.closeNewUserGame();
        this.selectUserGame(userGame);
        this.displayUserGame = true;
    }

    selectUserGame(userGame) {

        this.selectedUserGame = userGame;

        if (!userGame) {
            this.selectedUserGame1 = null;
            this.selectedUserGame2 = null;
            this.closeUserGame();
            return false;
        }

        if (this.selectedUserGame1) {
            this.selectedUserGame1 = null;
            this.selectedUserGame2 = userGame;
        }
        else {
            this.selectedUserGame2 = null;
            this.selectedUserGame1 = userGame;

        }

        var userGameList = this.filterPipe.transform(this.userGames, this.userGameFilter);
        userGameList = this.orderByPipe.transform(userGameList, this.orderField, this.orderOption);

        if (userGame && userGameList.length > 1) {

            var index = deepIndexOf(userGameList, userGame);

            if (index > -1) {

                var prevIndex;
                var nextIndex;

                if (index === 0) {
                    prevIndex = userGameList.length - 1;
                    nextIndex = 1;
                }
                else if (index === userGameList.length - 1) {
                    prevIndex = userGameList.length - 2;
                    nextIndex = 0;
                }
                else {
                    prevIndex = index - 1;
                    nextIndex = index + 1;
                }

                this.prevUserGame = userGameList[prevIndex];
                this.nextUserGame = userGameList[nextIndex];
            }
        }
        else {

            this.prevUserGame = null;
            this.nextUserGame = null;
        }
    }

    userGameHover(userGame: UserGame) {
        if (!this.displayUserGame) {
            this.selectUserGame(userGame);
        }
    }

    resetSelectedUserGame() {
        var userGameList = this.filterPipe.transform(this.userGames, this.userGameFilter);
        userGameList = this.orderByPipe.transform(userGameList, this.orderField, this.orderOption);

        if (userGameList.length > 0 && (!this.selectedUserGame || deepIndexOf(userGameList, this.selectedUserGame) == -1)) {
            this.selectUserGame(userGameList[0]);
        }
    }

    navUserGame(prev = false) {
        var state = prev ? 'prev' : 'next';

        if (this[state + 'UserGame']) {
            this.transitionState = state;
            this.selectUserGame(this[state + 'UserGame']);
        }
    }

    closeUserGame() {
        this.displayUserGame = false;
    }

    private setFilters() {

        this.filters.tags.purchasePlace = [];
        this.filters.tags.salePlace = [];
        this.filters.tags.purchaseContact = [];
        this.filters.tags.saleContact = [];
        this.filters.tags.platforms = [];
        this.filters.tags.series = [];
        this.filters.tags.developers = [];
        this.filters.tags.publishers = [];
        this.filters.tags.modes = [];
        this.filters.tags.themes = [];
        this.filters.tags.genres = [];

        this.filters.count.purchasePlace = [];
        this.filters.count.salePlace = [];
        this.filters.count.purchaseContact = [];
        this.filters.count.saleContact = [];
        this.filters.count.platforms = [];
        this.filters.count.series = [];
        this.filters.count.developers = [];
        this.filters.count.publishers = [];
        this.filters.count.modes = [];
        this.filters.count.themes = [];
        this.filters.count.genres = [];

        this.filters.count.version = [];
        this.filters.count.progress = [];
        this.filters.count.cond = [];
        this.filters.count.completeness = [];

        var minRating = 20;
        var maxRating = 0;
        var minPrice = 1000000000;
        var maxPrice = 0;
        var minReleaseYear = 1000000000;
        var maxReleaseYear = 0;
        var minPurchaseYear = 1000000000;
        var maxPurchaseYear = 0;

        for (let userGame of this.userGames) {

            // Rating
            if (userGame.rating < minRating) {
                minRating = userGame.rating;
            }

            if (userGame.rating > maxRating) {
                maxRating = userGame.rating;
            }

            // Release Year
            if (userGame.releaseDate && userGame.releaseDate.getFullYear() < minReleaseYear) {
                minReleaseYear = userGame.releaseDate.getFullYear();
            }

            if (userGame.releaseDate && userGame.releaseDate.getFullYear() > maxReleaseYear) {
                maxReleaseYear = userGame.releaseDate.getFullYear();
            }

            // Purchase Year
            if (userGame.purchaseDate && userGame.purchaseDate.getFullYear() < minPurchaseYear) {
                minPurchaseYear = userGame.purchaseDate.getFullYear();
            }

            if (userGame.purchaseDate && userGame.purchaseDate.getFullYear() > maxPurchaseYear) {
                maxPurchaseYear = userGame.purchaseDate.getFullYear();
            }

            // Price
            var minP = Math.min(userGame.priceAsked, userGame.pricePaid, userGame.priceResale, userGame.priceSold);
            if (minP < minPrice) {
                minPrice = minP;
            }

            var maxP = Math.max(userGame.priceAsked, userGame.pricePaid, userGame.priceResale, userGame.priceSold);
            if (maxP > maxPrice) {
                maxPrice = maxP;
            }

            // UserGame Tags
            var tagTypes = ['platforms', 'purchaseContact', 'saleContact'];
            for (let type of tagTypes) {

                let ugParam = type == 'platforms' ? 'platform' : type;

                if (userGame[ugParam]) {
                    if (!this.filters.count[type][userGame[ugParam].id]) {

                        this.filters.tags[type].push(userGame[ugParam]);
                        this.filters.count[type][userGame[ugParam].id] = 0;
                    }

                    this.filters.count[type][userGame[ugParam].id]++;
                }
            }

            // UserGame Places
            var tagTypes = ['purchasePlace', 'salePlace'];
            for (let type of tagTypes) {

                if (userGame[type]) {
                    if (!this.filters.count[type][userGame[type]]) {

                        this.filters.tags[type].push(userGame[type]);
                        this.filters.count[type][userGame[type]] = 0;
                    }

                    this.filters.count[type][userGame[type]]++;
                }
            }

            // Game Tags
            for (let tagType of ['series', 'developers', 'publishers', 'modes', 'themes', 'genres']) {
                if (userGame.game[tagType] && userGame.game[tagType].length > 0) {

                    for (let tag of userGame.game[tagType]) {

                        if (!this.filters.count[tagType][tag.id]) {

                            this.filters.tags[tagType].push(tag);
                            this.filters.count[tagType][tag.id] = 0;
                        }

                        this.filters.count[tagType][tag.id]++;
                    }
                }
            }

            if (!this.filters.count.version[userGame.version]) {
                this.filters.count.version[userGame.version] = 0;
            }
            this.filters.count.version[userGame.version]++;

            if (!this.filters.count.progress[userGame.progress]) {
                this.filters.count.progress[userGame.progress] = 0;
            }
            this.filters.count.progress[userGame.progress]++;

            if (!this.filters.count.cond[userGame.cond]) {
                this.filters.count.cond[userGame.cond] = 0;
            }
            this.filters.count.cond[userGame.cond]++;

            if (!this.filters.count.completeness[userGame.completeness]) {
                this.filters.count.completeness[userGame.completeness] = 0;
            }
            this.filters.count.completeness[userGame.completeness]++;
        }

        // orderByCount
        this.filters.tags.platforms.sort(orderByCount(this.filters.count.platforms));
        this.filters.tags.series.sort(orderByCount(this.filters.count.series));
        this.filters.tags.developers.sort(orderByCount(this.filters.count.developers));
        this.filters.tags.publishers.sort(orderByCount(this.filters.count.publishers));
        this.filters.tags.purchaseContact.sort(orderByCount(this.filters.count.purchaseContact));
        this.filters.tags.saleContact.sort(orderByCount(this.filters.count.saleContact));
        this.filters.tags.purchasePlace.sort();
        this.filters.tags.salePlace.sort();

        this.userGameFilter.ratingRange = [minRating, maxRating];
        this.userGameFilter.minRating = minRating;
        this.userGameFilter.maxRating = maxRating;

        this.userGameFilter.releaseYearRange = [minReleaseYear, maxReleaseYear];
        this.userGameFilter.minReleaseYear = minReleaseYear;
        this.userGameFilter.maxReleaseYear = maxReleaseYear;

        this.userGameFilter.purchaseYearRange = [minPurchaseYear, maxPurchaseYear];
        this.userGameFilter.minPurchaseYear = minPurchaseYear;
        this.userGameFilter.maxPurchaseYear = maxPurchaseYear;

        this.userGameFilter.priceAskedRange = [minPrice, maxPrice];
        this.userGameFilter.pricePaidRange = [minPrice, maxPrice];
        this.userGameFilter.priceResaleRange = [minPrice, maxPrice];
        this.userGameFilter.priceSoldRange = [minPrice, maxPrice];
        this.userGameFilter.minPrice = minPrice;
        this.userGameFilter.maxPrice = maxPrice;

        this.resetSelectedUserGame();
    }


    toggleTag(type, active, tag = null) {

        switch (type) {

            case 'platforms':
            case 'purchasePlaces':
            case 'salePlaces':
            case 'purchaseContacts':
            case 'saleContacts':
            case 'progresses':
            case 'conds':
            case 'versions':
            case 'completenesss':

                if (active) {
                    this.userGameFilter.addElement(type, tag);
                }
                else {
                    this.userGameFilter.removeElement(type, tag);
                }
                break;

            case 'series':
            case 'developers':
            case 'publishers':
            case 'modes':
            case 'themes':
            case 'genres':

                if (active) {
                    this.userGameFilter.game.addTag(type, tag);
                }
                else {
                    this.userGameFilter.game.removeTag(type, tag);
                }
                break;
        }

        this.resetSelectedUserGame();
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

    detailStateUpdate(event) {

        if (event == 'submitted') {
            this.loadingAction = 'save';
            this.loading = true;
        }
        else if (event.substr(0, 7) == 'delete_') {
            this.closeUserGame();
            this.selectUserGame(null);

            var deleteUserGame = JSON.parse(event.substr(7));
            this.userGames = this.userGames.filter(function (el) {
                return el.game.id !== deleteUserGame.game.id;
            });

            this.setFilters();

            this.loading = false;
        }
        else if (event.substr(0, 4) == 'add_') {
            this.userGameFilter = new UserGameFilter();
            this.closeNewUserGame();
            this.closeUserGame();

            var userGame = JSON.parse(event.substr(4));

            if (userGame.purchaseDate) {
                userGame.purchaseDate = new Date(userGame.purchaseDate);
            }
            if (userGame.saleDate) {
                userGame.saleDate = new Date(userGame.saleDate);
            }
            if (userGame.releaseDate) {
                userGame.releaseDate = new Date(userGame.releaseDate);
            }

            let index = this.userGames.findIndex(function (cur) {
                return userGame.id === cur.id;
            });
            if (index === -1) {
                this.userGames.push(userGame);
            }
            else {
                this.userGames[index] = userGame;
            }

            this.selectUserGame(userGame);

            this.setFilters();

            this.loading = false;
        }
    }
}