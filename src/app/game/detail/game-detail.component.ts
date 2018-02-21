import {Component, Input, OnInit, OnDestroy, ViewChild, ChangeDetectorRef, EventEmitter} from "@angular/core";
import {Router, ActivatedRoute} from "@angular/router";
import {SlimLoadingBarService} from "ng2-slim-loading-bar";
import {Game} from "../../_models/game";
import {GameService} from "../../_services/game.service";
import {GameLocalService} from "../../_services/gameLocal.service";
import {UserGame} from "../../_models/userGame";
import {TagComponent} from "../../tag/tag.component";
import {GameFormComponent} from "../form/game-form.component";
import {LoadingComponent} from "../../loading/loading.component";
import {UserGameValuePipe} from "../../_pipes/userGameValue.pipe";
import {DatePipe} from "@angular/common";
import {FormatNamePipe} from "../../_pipes/formatName.pipe";
import {Output} from "@angular/core/src/metadata/directives";
import {carouselTransition} from "../../_animations/carousel.animations";

@Component({
    moduleId: module.id,
    providers: [GameService, GameLocalService, TagComponent, LoadingComponent, GameFormComponent, UserGameValuePipe, DatePipe, FormatNamePipe],
    selector: 'game-detail',
    templateUrl: './game-detail.component.html',
    animations: [carouselTransition()],
    host: {'[@carouselTransition]': 'transitionState', class: 'mainPage fakePage'}
})
export class GameDetailComponent implements OnInit {

    private errorMessage: string;

    @Input() transitionState: string;
    @Input() userGame: UserGame;
    @Output() state: EventEmitter<string> = new EventEmitter();
    private selectedGame: Game = null;
    private selectedPlatform: Object;

    private userGameFields = [];
    userFields = [['version', 'state', 'rating', 'progress'],
        ['pricePaid', 'priceAsked', 'purchaseDate', 'purchasePlace', 'purchaseContact'],
        ['priceResale', 'priceSold', 'saleDate', 'salePlace', 'saleContact']];
    gameFields = ['game.series', 'releaseDate', 'game.developers', 'game.publishers', 'game.modes', 'game.themes', 'game.genres', 'game.rating', 'game.igdbUrl'];

    private subscription;
    private update: number = 0;
    private formAction: string;
    private formLoading: boolean = false;

    constructor (
        private gameService: GameService,
        private gameLocalService: GameLocalService,
        private route: ActivatedRoute,
        private slimLoadingBarService: SlimLoadingBarService,
        private changeDetectorRef: ChangeDetectorRef
    ) {
        this.changeDetectorRef = changeDetectorRef;

        var ug = new UserGame();
        this.userGameFields = ug.fields;
    }

    /**
     * On component init: init UserGame
     */
    ngOnInit(): void {
        this.slimLoadingBarService.reset();

        this.initGame();
    }

    /**
     * Initialize UserGame
     */
    initGame() {
        if (this.slimLoadingBarService.progress == 0) {
            this.userGame = this.gameLocalService.getUserGame(this.userGame);
            this.getGame();
        }
    }

    /**
     * On component destroy: unsubscribe
     */
    ngOnDestroy() {
        if (this.subscription) {
            this.subscription.unsubscribe();
        }
    }

    /**
     * get UserGame
     */
    getGame() {
        if (this.slimLoadingBarService.progress == 0) {
            this.slimLoadingBarService.start();

            this.subscription = this.gameService.getGame(this.userGame)
                .subscribe(
                    userGame => {
                        console.log('subscribe userGame');
                        console.log(userGame);
                        this.userGame = userGame;
                        this.gameLocalService.setUserGame(this.userGame);
                        this.update++;
                        this.slimLoadingBarService.complete();
                    },
                    error => {
                        console.log('subscribe error');
                        console.log(error);
                        this.slimLoadingBarService.complete();
                        this.errorMessage = <any>error;
                    });
        }
    };

    /**
     * Open edit or delete form
     * @param action
     */
    openForm(action: string): void {

        if (this.formAction == action && this.selectedGame) {
            this.selectedGame = null;
            this.selectedPlatform = null;
        }
        else {
            this.formAction = action;
            this.selectedGame = this.userGame.game;
            this.selectedPlatform = this.userGame.platform;
        }
    }

    /**
     * On form state update: emit event
     */
    formStateUpdate(event) {

        if (event == 'submitted') {
            this.formLoading = true;
        }
        else {
            this.formLoading = false;
        }

        this.state.emit(event);
    }
}