import {Component, Renderer, OnInit, OnDestroy, OnChanges, SimpleChanges, ViewChild, ElementRef} from '@angular/core';
import {Router}            from '@angular/router';
import {SlimLoadingBarService} from 'ng2-slim-loading-bar';
import {routerTransition} from '../../_animations/router.animations';
import {GameService}       from '../../_services/game.service';
import {GameLocalService}       from '../../_services/gameLocal.service';
import {UserGame} from "../../_models/userGame";
import {Tag} from "../../_models/tag";
import {deepIndexOf, orderByName, orderByCount} from "../../functions";
import {Platform} from "../../_models/platform";
import {UserGameFilter} from "../../_models/userGameFilter";
import {Place} from "../../_models/place";
import {DatePipe} from "@angular/common";
import {FormatNamePipe} from "../../_pipes/formatName.pipe";
import {FilterPipe} from "../../_pipes/filter.pipe";
import {LengthPipe} from "../../_pipes/length.pipe";
import {TotalPipe} from "../../_pipes/total.pipe";
import {HostListener} from "@angular/core/src/metadata/directives";
import {OrderByPipe} from "../../_pipes/orderBy.pipe";

@Component({
    moduleId: module.id,
    providers: [GameService, FilterPipe, OrderByPipe, DatePipe, FormatNamePipe, LengthPipe, TotalPipe],
    selector: 'game-list',
    templateUrl: './game-list.component.html',
    animations: [routerTransition()],
    host: {'[@routerTransition]': 'state', class: 'mainPage'}
})
export class GamesComponent implements OnInit {

    title = 'VGC';

    errorMessage: string;

    private subscription;
    private userGames: UserGame[] = [];
    private userGameFilter: UserGameFilter = new UserGameFilter();

    userGamesDate;
    selectedUserGame: UserGame;
    selectedUserGame1: UserGame;
    selectedUserGame2: UserGame;
    transitionState = 'next';
    prevUserGame: UserGame;
    nextUserGame: UserGame;

    displayUserGame: boolean = false;
    displayNewUserGame: boolean = false;

    userGameFields = [];

    tableFields = ['progress', 'game.name', 'version', 'state', 'rating',
        'pricePaid', 'priceAsked', 'purchaseDate', 'purchasePlace', 'purchaseContact',
        'priceResale', 'priceSold', 'saleDate', 'salePlace', 'saleContact'];

    displayFilters: boolean = false;
    displayMode: number = 0;
    orderField: string = 'game.name';
    orderOption: boolean = true;

    purchasePlaceTags: Place[] = [];
    salePlaceTags: Place[] = [];
    purchaseContactTags: Place[] = [];
    saleContactTags: Place[] = [];
    platformsTags: Platform[] = [];
    seriesTags: Tag[] = [];
    developersTags: Tag[] = [];
    publishersTags: Tag[] = [];
    modesTags: Tag[] = [];
    themesTags: Tag[] = [];
    genresTags: Tag[] = [];

    purchasePlaceCount: number[] = [];
    salePlaceCount: number[] = [];
    purchaseContactCount: number[] = [];
    saleContactCount: number[] = [];
    platformsCount: number[] = [];
    seriesCount: number[] = [];
    developersCount: number[] = [];
    publishersCount: number[] = [];
    modesCount: number[] = [];
    themesCount: number[] = [];
    genresCount: number[] = [];

    versionCount: number[] = [];
    progressCount: number[] = [];
    boxCount: number = 0;
    manualCount: number = 0;

    constructor(private gameService: GameService,
                private gameLocalService: GameLocalService,
                private router: Router,
                private slimLoadingBarService: SlimLoadingBarService,
                private renderer: Renderer,
                private filterPipe: FilterPipe,
                private orderByPipe: OrderByPipe) {

        var ug = new UserGame();
        this.userGameFields = ug.fields;
    }

    bannerMarginLeft: number;
    bannerWidth: number;
    bannerHeight: number;
    @ViewChild('gameBanner') gameBanner: ElementRef;
    @HostListener('window:scroll', ['$event']) onWindowScroll(event) {
        this.resizeBanner();
    }
    @HostListener('window:resize', ['$event'])
    onResize(event) {
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
                if (!this.displayUserGame && this.selectedUserGame) {
                    this.openUserGame(this.selectedUserGame);
                }
                break;
        }
    }

    ngOnInit() {
        this.slimLoadingBarService.reset();

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

        if (this.slimLoadingBarService.progress == 0) {

            this.slimLoadingBarService.start();

            this.subscription = this.gameService.getUserGames().subscribe(
                userGames => {

                    userGames.sort(orderByName);
                    this.userGames = userGames;

                    this.gameLocalService.setUserGames(this.userGames);
                    this.userGamesDate = this.gameLocalService.setUserGamesDate();

                    this.setFilters();

                    this.slimLoadingBarService.complete();
                },
                error => {
                    this.slimLoadingBarService.complete();
                    this.errorMessage = <any>error;
                });
        }
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

    navUserGame(prev = false) {
        var state = prev ? 'prev' : 'next';

        if (this[state+'UserGame']) {
            this.transitionState = state;
            this.selectUserGame(this[state+'UserGame']);
        }
    }

    closeUserGame() {
        this.displayUserGame = false;
    }

    private setFilters() {

        this.purchasePlaceTags = [];
        this.salePlaceTags = [];
        this.purchaseContactTags = [];
        this.saleContactTags = [];
        this.platformsTags = [];
        this.seriesTags = [];
        this.developersTags = [];
        this.publishersTags = [];
        this.modesTags = [];
        this.themesTags = [];
        this.genresTags = [];

        this.purchasePlaceCount = [];
        this.salePlaceCount = [];
        this.purchaseContactCount = [];
        this.saleContactCount = [];
        this.platformsCount = [];
        this.seriesCount = [];
        this.developersCount = [];
        this.publishersCount = [];
        this.modesCount = [];
        this.themesCount = [];
        this.genresCount = [];

        this.versionCount = [];
        this.progressCount = [];
        this.boxCount = 0;
        this.manualCount = 0;

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
            var tagTypes = ['platforms', 'purchasePlace', 'salePlace', 'purchaseContact', 'saleContact'];
            for (let type of tagTypes) {

                let ugParam = type == 'platforms' ? 'platform' : type;

                if (userGame[ugParam]) {
                    if (deepIndexOf(this[type + 'Tags'], userGame[ugParam]) < 0) {

                        this[type + 'Tags'].push(userGame[ugParam]);
                        this[type + 'Count'][userGame[ugParam].id] = 0;
                    }

                    this[type + 'Count'][userGame[ugParam].id]++;
                }
            }

            // Game Tags
            for (let tagType of ['series', 'developers', 'publishers', 'modes', 'themes', 'genres']) {
                if (userGame.game[tagType] && userGame.game[tagType].length > 0) {

                    for (let tag of userGame.game[tagType]) {

                        if (deepIndexOf(this[tagType + 'Tags'], tag) < 0) {

                            this[tagType + 'Tags'].push(tag);
                            this[tagType + 'Count'][tag.id] = 0;
                        }

                        this[tagType + 'Count'][tag.id]++;
                    }
                }
            }

            if (userGame.box) {
                this.boxCount++;
            }

            if (userGame.manual) {
                this.manualCount++;
            }

            if (!this.versionCount[userGame.version]) {
                this.versionCount[userGame.version] = 0;
            }
            this.versionCount[userGame.version]++;

            if (!this.progressCount[userGame.progress]) {
                this.progressCount[userGame.progress] = 0;
            }
            this.progressCount[userGame.progress]++;

            // UserGame Local Storage
            this.gameLocalService.setUserGame(userGame);
        }

        console.log(this.boxCount);
        console.log(this.manualCount);
        console.log(this.versionCount);
        console.log(this.progressCount);

        // orderByCount
        this.platformsTags.sort(orderByCount(this.platformsCount));
        this.seriesTags.sort(orderByCount(this.seriesCount));
        this.developersTags.sort(orderByCount(this.developersCount));
        this.publishersTags.sort(orderByCount(this.publishersCount));
        this.purchaseContactTags.sort(orderByCount(this.purchaseContactCount));
        this.saleContactTags.sort(orderByCount(this.saleContactCount));

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
    }


    toggleTag(type, active, tag = null) {

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

            case 'box':
            case 'manual':

                this.userGameFilter[type] = active;
                break;
        }
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

    detailStateUpdate(event) {

        if (event.substr(0, 7) == 'delete_') {
            this.closeUserGame();
            this.selectUserGame(null);

            var deleteUserGame = JSON.parse(event.substr(7));
            this.userGames = this.userGames.filter(function(el) {
                return el.game.id !== deleteUserGame.game.id;
            });
        }
        else if (event.substr(0, 4) == 'add_') {
            this.closeNewUserGame();

            var userGame = JSON.parse(event.substr(4));

            userGame.purchaseDate = new Date(userGame.purchaseDate);
            if (userGame.saleDate) {
                userGame.saleDate = new Date(userGame.saleDate);
            }
            if (userGame.releaseDate) {
                userGame.releaseDate = new Date(userGame.releaseDate);
            }

            this.userGames.push(userGame);
        }

        this.setFilters();
    }
}