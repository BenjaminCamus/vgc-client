import {Component, OnInit, HostListener, OnDestroy} from '@angular/core';
import {routerTransition} from '../../_animations/router.animations';
import {GameService} from '../../_services/game.service';
import {GameLocalService} from '../../_services/gameLocal.service';
import {UserGame} from '../../_models/userGame';
import {deepIndexOf, orderByName} from '../../functions';
import {UserGameFilter} from '../../_models/userGameFilter';
import {DatePipe} from '@angular/common';
import {FormatNamePipe} from '../../_pipes/formatName.pipe';
import {FilterPipe} from '../../_pipes/filter.pipe';
import {LengthPipe} from '../../_pipes/length.pipe';
import {TotalPipe} from '../../_pipes/total.pipe';
import {OrderByPipe} from '../../_pipes/orderBy.pipe';
import {opacityTransition} from '../../_animations/opacity.animations';
import {topNavTransition} from '../../_animations/topNav.animations';
import {environment} from '../../../environments/environment';
import {ActivatedRoute, Router} from '@angular/router';
import {CarouselAnimations} from '../../_animations/carousel.animations';

@Component({
    moduleId: module.id,
    providers: [GameService, FilterPipe, OrderByPipe, DatePipe, FormatNamePipe, LengthPipe, TotalPipe],
    selector: 'game-list',
    templateUrl: './game-list.component.html',
    animations: [routerTransition(), opacityTransition(), topNavTransition(), CarouselAnimations.routeSlide],
    host: {'[@opacityTransition]': '', 'class': 'fakePage'}
})
export class GamesComponent implements OnInit, OnDestroy {

    public routeTrigger;
    public currentIndex = 0;

    private environment = environment;
    loading = true;
    loadingAction = 'load';
    welcome = false;

    title = 'VGC';

    private subscription;
    private numCall = 0;
    private totalCalls = 0;
    private packNumber = 20;
    total = 0;
    userGames: UserGame[] = [];
    userGameFilter: UserGameFilter = new UserGameFilter();

    userGamesDate;
    selectedUserGame: UserGame;

    displayChart = false;

    tableFields = ['game.name', 'userGame.platform', 'userGame.releaseDate', 'userGame.rating', 'userGame.progress', 'userGame.version',
        'userGame.cond', 'userGame.completeness',
        'userGame.pricePaid', 'userGame.priceAsked', 'userGame.purchaseDate', 'userGame.purchasePlace', 'userGame.purchaseContact',
        'userGame.priceResale', 'userGame.priceSold', 'userGame.saleDate', 'userGame.salePlace', 'userGame.saleContact'];

    displayFilters = false;
    orderField = 'game.name';

    private _displayMode = 0;

    get displayMode(): number {
        return this._displayMode;
    }
    set displayMode(value: number) {
        if (value !== this._displayMode) {
            this._displayMode = value;
            this.gameLocalService.setOption('displayMode', value);
        }
    }

    private _orderOption = false;

    get orderOption(): boolean {
        return this._orderOption;
    }
    set orderOption(value: boolean) {
        if (value !== this._orderOption) {
            this._orderOption = value;
            this.gameLocalService.setOption('orderOption', value);
        }
    }

    sliceStart = 0;
    sliceEnd = 0;
    sliceGap = 0;

    chartFields = [
        'userGame.platform', 'game.series', 'game.developers', 'game.publishers', 'game.modes', 'game.themes', 'game.genres',
        'userGame.rating', 'userGame.version', 'userGame.progress', 'userGame.cond', 'userGame.completeness',
        'userGame.price',
        'userGame.purchasePlace', 'userGame.purchaseContact', 'userGame.purchaseDate',
        'userGame.salePlace', 'userGame.saleContact', 'userGame.saleDate'
    ];
    chartField = 'userGame.platform';

    constructor(public router: Router,
                private route: ActivatedRoute,
                private gameService: GameService,
                public gameLocalService: GameLocalService,
                private filterPipe: FilterPipe,
                private orderByPipe: OrderByPipe) {
    }

    @HostListener('document:keyup', ['$event'])
    handleKeyboardEvent(event: KeyboardEvent) {

        const lightbox = document.getElementsByClassName('lightbox');
        if (lightbox.length > 0) {
            return false;
        }

        switch (event.key) {
            case 'ArrowLeft':
                this.navigateUserGame(this.currentIndex - 1);
                break;
            case 'ArrowRight':
                this.navigateUserGame(this.currentIndex + 1);
                break;
            case '+':
                this.router.navigate(['/games/new']);
                break;
            case 'Escape':
                if (this.displayFilters) {
                    this.displayFilters = false;
                } else if (this.displayChart) {
                    this.displayChart = false;
                } else {
                    this.router.navigate(['/games']);
                }
                break;
            case 'Enter':
                if (this.router.url === '/games' && this.selectedUserGame && !this.displayFilters && !this.displayChart) {
                    this.router.navigate(['/games/show/' + this.selectedUserGame.id]);
                }
                break;
        }
    }

    public setupRouting() {

        let index = 0;
        if (this.route.firstChild && this.route.firstChild.snapshot.params['id']) {
            let userGameList = this.filterPipe.transform(this.userGames, this.userGameFilter);
            userGameList = this.orderByPipe.transform(userGameList, this.orderField, this.orderOption);
            const userGame = new UserGame();
            userGame.id = this.route.firstChild.snapshot.params['id'];
            const i = deepIndexOf(userGameList, userGame);
            if (i > -1) {
                index = i;
                this.selectUserGame(userGameList[index]);
            }
        }
    }

    public setRouteIndex(index) {

        this.routeTrigger = {
            value: index,
            params: {
                offsetEnter: this.currentIndex > index ? -100 : 100,
                offsetLeave: this.currentIndex > index ? 100 : -100
            }
        };

        this.currentIndex = index;
    }

    navigateUserGame(index) {
        let userGameList = this.filterPipe.transform(this.userGames, this.userGameFilter);
        userGameList = this.orderByPipe.transform(userGameList, this.orderField, this.orderOption);

        if (index === -1) {
            index = userGameList.length - 1;
        } else if (index === userGameList.length) {
            index = 0;
        }

        if (index === 0 || index % this.sliceGap === 0) {
            this.sliceStart = index;
        } else if ((index + 1) % this.sliceGap === 0) {
            this.sliceStart = index + 1 - this.sliceGap;
        } else {
            if (index === userGameList.length - 1) {
                this.sliceStart = Math.floor(index / this.sliceGap) * this.sliceGap;
            }
        }

        this.sliceEnd = this.sliceStart + this.sliceGap;


        if (this.router.url.indexOf('/games/show') === 0) {
            this.router.navigate(['/games/show/' + userGameList[index].id]);
        } else {
            this.selectUserGame(userGameList[index]);
        }
    }

    paginate(event) {
        this.sliceStart = parseInt(event.first, 10);
        this.sliceEnd = parseInt(event.first, 10) + this.sliceGap;
        // event.rows = Number of rows to display in new page
        // event.page = Index of the new page
        // event.pageCount = Total number of pages
    }

    ngOnInit() {
        this.gameLocalService.getUserGames().then(
            userGames => {
                this.userGames = userGames;
                this.setSliceGap();
                if (!this.userGames || this.userGames.length === 0) {
                    this.loading = false;
                    this.getGames();
                } else {
                    this.userGamesDate = this.gameLocalService.getOption('syncDatetime');
                    this.reset();
                    this.setupRouting();
                    this.loading = false;
                }
            },
            error => {
                console.log(error);
                this.loading = false;
            });

        this.displayMode = this.gameLocalService.getOption('displayMode');
        this.orderField = this.gameLocalService.getOption('orderField');
        this.orderOption = this.gameLocalService.getOption('orderOption');
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
                    console.log(error);
                    this.loading = false;
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
                } else {

                    this.setSliceGap();

                    this.userGames.sort(orderByName);

                    this.gameLocalService.setUserGames(this.userGames);
                    this.userGamesDate = this.gameLocalService.setOption('syncDatetime', new Date().getTime().toString());

                    this.reset();

                    this.loading = false;
                }
            },
            error => {
                console.log(error);
                this.loading = false;
            });

    }

    setSliceGap() {

        if (this.userGames.length > 100) {
            this.sliceGap = 50;
        } else if (this.userGames.length > 50) {
            this.sliceGap = 20;
        } else {
            this.sliceGap = 10;
        }
    }

    openChart() {
        this.displayChart = true;
    }

    closeChart() {
        this.displayChart = false;
    }

    selectUserGame(userGame) {
        const filteredUserGames = this.getFilteredUserGames();
        const index = deepIndexOf(filteredUserGames, userGame);
        this.setRouteIndex(index);
        this.selectedUserGame = filteredUserGames[index];
    }

    userGameHover(userGame: UserGame) {
        this.selectUserGame(userGame);
    }

    resetSelectedUserGame() {
        const filteredUserGames = this.getFilteredUserGames();

        if (filteredUserGames.length > 0 && (!this.selectedUserGame || deepIndexOf(filteredUserGames, this.selectedUserGame) === -1)) {
            this.selectUserGame(filteredUserGames[0]);
        }

        this.sliceStart = 0;
        this.sliceEnd = this.sliceGap;
    }

    resetUserGameFilter() {

        this.userGameFilter = new UserGameFilter();
        this.reset();
        this.displayFilters = false;
    }

    getFilteredUserGames() {
        const userGameList = this.filterPipe.transform(this.userGames, this.userGameFilter);
        return this.orderByPipe.transform(userGameList, this.orderField, this.orderOption);
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
                } else {
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
                } else {
                    this.userGameFilter.game.removeTag(type, tag);
                }
                break;
        }

        this.resetSelectedUserGame();
    }

    setOrderField(orderField: string) {

        if (this.orderField === orderField) {
            this.orderOption = !this.orderOption;
        } else {
            this.orderField = orderField;
            this.orderOption = true;
        }

        this.gameLocalService.setOption('orderField', orderField);
    }

    startLoading(action) {
        this.loading = true;
        this.loadingAction = action;
    }

    changeOrder(field) {
        if (field === 'random') {
            this.userGames = shuffle(this.userGames);
        }

        this.gameLocalService.setOption('orderField', field);
    }
}

function shuffle(array) {

    let currentIndex = array.length, temporaryValue, randomIndex;

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
