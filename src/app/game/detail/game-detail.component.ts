import {Component, Input, OnInit, OnDestroy, ViewChild, ChangeDetectorRef} from "@angular/core";
import {Router, ActivatedRoute} from "@angular/router";
import {SlimLoadingBarService} from "ng2-slim-loading-bar";
import {ModalComponent} from "ng2-bs3-modal/ng2-bs3-modal";
import {routerTransition} from "../../_animations/router.animations";
import {Game} from "../../_models/game";
import {GameService} from "../../_services/game.service";
import {GameLocalService} from "../../_services/gameLocal.service";
import {UserGame} from "../../_models/userGame";
import {TagComponent} from "../../tag/tag.component";
import {GameFormComponent} from "../form/game-form.component";
import {LoadingComponent} from "../../loading/loading.component";
import {UserGameValuePipe} from "../../_pipes/userGameValue.pipe";

@Component({
    moduleId: module.id,
    providers: [GameService, GameLocalService, TagComponent, LoadingComponent, GameFormComponent, UserGameValuePipe],
    selector: 'game-detail',
    templateUrl: './game-detail.component.html',
    animations: [routerTransition()],
    host: {'[@routerTransition]': 'orientation', class: 'mainPage fakePage'}
})
export class GameDetailComponent implements OnInit {

    private errorMessage: string;
    public orientation: string;

    @Input() userGame: UserGame;
    private selectedGame: Game = new Game();
    private selectedPlatform: Object;

    private userGameFields = [];
    private userFields = [['version', 'state', 'rating', 'progress'],
        ['pricePaid', 'priceAsked', 'purchaseDate', 'purchasePlace', 'purchaseContact'],
        ['priceResale', 'priceSold', 'saleDate', 'salePlace', 'saleContact']];
    private gameFields = ['releaseDate', 'game.developers', 'game.publishers', 'game.modes', 'game.themes', 'game.genres', 'game.rating', 'game.igdbUrl'];

    private subscription;
    private update: number = 0;
    private formAction: string;
    private formLoading: boolean = false;

    @ViewChild('modal')
    private modal: ModalComponent;

    constructor (
        private gameService: GameService,
        private gameLocalService: GameLocalService,
        private route: ActivatedRoute,
        private slimLoadingBarService: SlimLoadingBarService,
        private changeDetectorRef: ChangeDetectorRef
    ) {
        this.changeDetectorRef = changeDetectorRef;
        this.orientation = "none";

        var ug = new UserGame();
        this.userGameFields = ug.fields;
    }

    ngOnInit(): void {
        // this.slimLoadingBarService.reset();
        //
        // this.route.params.subscribe(params => {
        //     this.userGame = new UserGame();
        //     this.userGame.platform = new Platform();
        //     this.userGame.platform.slug = params['platformSlug'];
        //     this.userGame.game = new Game('Chargement...');
        //     this.userGame.game.slug = params['gameSlug'];
        // });
        //
        // this.initGame();
    }

    initGame() {
        if (this.slimLoadingBarService.progress == 0) {
            this.userGame = this.gameLocalService.getUserGame(this.userGame);
            this.getGame();
        }
    }

    ngOnDestroy() {
        if (this.subscription) {
            this.subscription.unsubscribe();
        }
    }


    getGame() {
        if (this.slimLoadingBarService.progress == 0) {
            this.slimLoadingBarService.start();

            this.subscription = this.gameService.getGame(this.userGame)
                .subscribe(
                    userGame => {
                        this.userGame = userGame;
                        this.gameLocalService.setUserGame(this.userGame);
                        this.update++;
                        this.slimLoadingBarService.complete();
                    },
                    error => {
                        this.slimLoadingBarService.complete();
                        this.errorMessage = <any>error;
                    });
        }
    };

    openForm(action: string): void {
        this.formAction= action;
        this.selectedGame = this.userGame.game;
        this.selectedPlatform = this.userGame.platform;
        this.modal.open();
    }

    formStateUpdate(event) {
        this.modal.close();
        switch (event) {
            case 'submitted':
                this.formLoading = true;
                break;
            case 'success':
                this.formLoading = false;
                break;
        }
    }
}