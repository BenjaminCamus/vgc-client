import {Component, Renderer2, OnInit, HostListener} from '@angular/core';
import {Router}            from '@angular/router';
import {routerTransition} from '../../_animations/router.animations';
import {GameService}       from '../../_services/game.service';
import {GameLocalService}       from '../../_services/gameLocal.service';
import {UserGame} from "../../_models/userGame";
import {deepIndexOf, orderByName} from "../../functions";
import {UserGameFilter} from "../../_models/userGameFilter";
import {DatePipe} from "@angular/common";
import {FormatNamePipe} from "../../_pipes/formatName.pipe";
import {FilterPipe} from "../../_pipes/filter.pipe";
import {LengthPipe} from "../../_pipes/length.pipe";
import {TotalPipe} from "../../_pipes/total.pipe";
import {OrderByPipe} from "../../_pipes/orderBy.pipe";
import {opacityTransition} from "../../_animations/opacity.animations";
import {topNavTransition} from "../../_animations/topNav.animations";
import {environment} from "../../../environments/environment";

@Component({
    moduleId: module.id,
    providers: [GameService, FilterPipe, OrderByPipe, DatePipe, FormatNamePipe, LengthPipe, TotalPipe],
    selector: 'game-list',
    templateUrl: './game-list.component.html',
    animations: [routerTransition(), opacityTransition(), topNavTransition()],
    host: {'[@opacityTransition]': '', class: 'mainPage'}
})
export class GamesComponent implements OnInit {

    private environment = environment;
    loading: boolean = true;
    loadingAction: string = 'load';
    welcome: boolean = false;

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

    tableFields = ['game.name', 'userGame.platform', 'userGame.releaseDate', 'userGame.rating', 'userGame.progress', 'userGame.version',
        'userGame.cond', 'userGame.completeness',
        'userGame.pricePaid', 'userGame.priceAsked', 'userGame.purchaseDate', 'userGame.purchasePlace', 'userGame.purchaseContact',
        'userGame.priceResale', 'userGame.priceSold', 'userGame.saleDate', 'userGame.salePlace', 'userGame.saleContact'];

    displayFilters: boolean = false;
    displayMode: number = 0;
    orderField: string = 'game.name';
    orderOption: boolean = true;
    sliceStart: number = 0;
    sliceEnd: number = 0;
    sliceGap: number = 0;

    chartFields = [
        'userGame.platform', 'game.series', 'game.developers', 'game.publishers', 'game.modes', 'game.themes', 'game.genres',
        'userGame.rating', 'userGame.version', 'userGame.progress', 'userGame.cond', 'userGame.completeness',
        'userGame.price',
        'userGame.purchasePlace', 'userGame.purchaseContact', 'userGame.purchaseDate',
        'userGame.salePlace', 'userGame.saleContact', 'userGame.saleDate'
    ];
    chartField = 'userGame.platform';

    constructor(private gameService: GameService,
                private gameLocalService: GameLocalService,
                private router: Router,
                private renderer: Renderer2,
                private filterPipe: FilterPipe,
                private orderByPipe: OrderByPipe) {
    }


    @HostListener('document:keyup', ['$event'])
    handleKeyboardEvent(event: KeyboardEvent) {

        var lightbox = document.getElementsByClassName('lightbox');
        if (lightbox.length > 0) {
            return false;
        }

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

    paginate(event) {
        this.sliceStart = parseInt(event.first, 10);
        this.sliceEnd = parseInt(event.first, 10) + this.sliceGap;

        //event.rows = Number of rows to display in new page
        //event.page = Index of the new page
        //event.pageCount = Total number of pages
    }

    ngOnInit() {

        this.gameLocalService.getUserGames().then(
            userGames => {

                this.userGames = userGames;

                this.setSliceGap();

                if (!this.userGames || this.userGames.length == 0) {
                    this.loading = false;
                    this.getGames();
                }
                else {
                    this.userGamesDate = this.gameLocalService.getUserGamesDate();
                    this.reset();

                    this.loading = false;
                }
            },
            error => {
                this.loading = false;
                this.errorMessage = <any>error;
            });
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

                    this.setSliceGap();

                    this.userGames.sort(orderByName);

                    this.gameLocalService.setUserGames(this.userGames);
                    this.userGamesDate = this.gameLocalService.setUserGamesDate();

                    this.reset();

                    this.loading = false;
                }
            },
            error => {
                this.loading = false;
                this.errorMessage = <any>error;
            });

    }

    setSliceGap() {

        if (this.userGames.length > 100) {
            this.sliceGap = 50;
        }
        else if (this.userGames.length > 50) {
            this.sliceGap = 20;
        }
        else {
            this.sliceGap = 10;
        }
    }

    openNewUserGame() {
        this.closeUserGame();
        this.closeChart();
        this.displayNewUserGame = true;
    }

    closeNewUserGame() {
        this.displayNewUserGame = false;
    }

    openChart() {
        this.closeNewUserGame();
        this.closeUserGame();
        this.displayChart = true;
    }

    closeChart() {
        this.displayChart = false;
    }

    openUserGame(userGame) {
        this.closeNewUserGame();
        this.closeChart();
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

                if (index == 0 || index % this.sliceGap == 0) {
                    this.sliceStart = index;
                }
                else if ((index + 1) % this.sliceGap == 0) {
                    this.sliceStart = index + 1 - this.sliceGap;
                }
                else {
                    let userGameList = this.filterPipe.transform(this.userGames, this.userGameFilter);
                    if (index == userGameList.length - 1) {
                        this.sliceStart = Math.floor(index / this.sliceGap) * this.sliceGap;
                    }
                }

                this.sliceEnd = this.sliceStart + this.sliceGap;
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

        this.sliceStart = 0;
        this.sliceEnd = this.sliceGap;
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

    resetUserGameFilter() {

        this.userGameFilter = new UserGameFilter();
        this.reset();
        this.displayFilters = false;
    }

    private reset() {

        this.userGameFilter.setStats(this.userGames);
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

        let userGamesLength = this.userGames.length;

        if (event == 'submitted') {
            this.loadingAction = 'save';
            this.loading = true;
        }
        else if (event.substr(0, 7) == 'delete_') {
            this.closeUserGame();
            this.selectUserGame(null);

            var deleteUserGame = JSON.parse(event.substr(7));
            this.userGames = this.userGames.filter(function (el) {
                return el.id !== deleteUserGame.id;
            });

            this.reset();

            this.loading = false;
        }
        else if (event.substr(0, 4) == 'add_') {
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

            this.reset();

            this.loading = false;
        }

        if (this.sliceGap === userGamesLength) {
            this.sliceGap = this.userGames.length;
            this.sliceEnd = this.sliceStart + this.sliceGap;
        }
    }

    changeOrder(field) {

        if (field == 'random') {

            this.userGames = shuffle(this.userGames);
        }
    }
}

function shuffle(array) {

    var currentIndex = array.length, temporaryValue, randomIndex;

    // While there remain elements to shuffle...
    while (0 !== currentIndex) {

        // Pick a remaining element...
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;

        // And swap it with the current element.
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}
