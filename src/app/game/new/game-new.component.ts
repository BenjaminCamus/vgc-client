import {Component, Renderer, OnInit, OnDestroy, ViewChild, EventEmitter} from '@angular/core';
import {SlimLoadingBarService}    from 'ng2-slim-loading-bar';

import {routerTransition} from '../../_animations/router.animations';

import {Game}    from '../../_models/game';
import {GameService}       from '../../_services/game.service';
import {orderByName} from "../../functions";
import {GameLocalService} from "../../_services/gameLocal.service";
import {UserGame} from "../../_models/userGame";
import {Platform} from "../../_models/platform";
import {Output} from "@angular/core/src/metadata/directives";

@Component({
    moduleId: module.id,
    providers: [GameService],
    selector: 'game-new',
    templateUrl: './game-new.component.html',
    animations: [routerTransition()],
    host: {'[@routerTransition]': 'state', class: 'mainPage fakePage'}
})
export class GameNewComponent {

    errorMessage: string;

    private search: string = '';
    private games: Game[];
    private selectedGame: Game;
    private selectedPlatform;
    private selectedUserGame: UserGame = new UserGame;
    private subscription;
    private buttonClass: Array<string> = [];
    private formLoading: boolean = false;

    @Output() state: EventEmitter<string> = new EventEmitter();

    constructor(private gameService: GameService,
                private gameLocalService: GameLocalService,
                private slimLoadingBarService: SlimLoadingBarService,
                private renderer: Renderer,) {
    }

    ngOnInit() {
        this.slimLoadingBarService.reset();
        this.search = this.gameLocalService.getNewGameSearch();
        this.onSubmit();
    }

    ngOnDestroy() {
        if (this.subscription) {
            this.subscription.unsubscribe();
        }
    }

    onSubmit() {
        if (this.search != '') {
            this.ngOnDestroy();
            this.slimLoadingBarService.reset();
            this.gameLocalService.setNewGameSearch(this.search);

            this.slimLoadingBarService.start();
            this.subscription = this.gameService.igdbSearch(this.search)
                .subscribe(
                    games => {
                        games = games.filter(function (elem, index, self) {
                            return index == self.indexOf(elem);
                        });

                        this.games = games.slice(0, this.gameService.searchLimit).sort(orderByName);

                        for (let game of this.games) {
                            for (let platform of game.platforms) {
                                this.buttonClass[game.id + '_' + platform.id] = this.getPlatformButtonClass(game, platform);

                            }
                        }

                        this.slimLoadingBarService.complete();
                    },
                    error => {
                        this.slimLoadingBarService.complete();
                        this.errorMessage = <any>error;
                    });
        }
    }

    getUserGameFromIgdb(game: Game, platform) {
        let userGame = new UserGame();
        userGame.game = game;
        let newPlatform = new Platform();
        newPlatform.id = platform.id;
        userGame.platform = newPlatform;

        return this.gameLocalService.getUserGame(userGame, true);
    }

    getPlatformButtonClass(game: Game, platform) {
        let userGame = this.getUserGameFromIgdb(game, platform);

        if (userGame.user) {
            return 'btn-success';
        }

        return 'btn-primary';
    }

    onSelect(game: Game, platform: Object): void {

        this.selectedGame = game;
        this.selectedPlatform = platform;

        let userGame = this.getUserGameFromIgdb(game, platform);
        this.selectedUserGame = userGame;
    }

    setItemClass(e) {
        if (e.value) {
            this.renderer.setElementProperty(e.target, 'className', 'gameBox visible_anim');
        } else {
            this.renderer.setElementProperty(e.target, 'className', 'gameBox');
        }
    }

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