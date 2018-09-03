import {Component, Renderer, OnInit, OnDestroy, ViewChild, EventEmitter} from '@angular/core';
import {SlimLoadingBarService}    from 'ng2-slim-loading-bar';

import {routerTransition} from '../../_animations/router.animations';

import {Game}    from '../../_models/game';
import {GameService}       from '../../_services/game.service';
import {orderByName, formatDate} from "../../functions";
import {GameLocalService} from "../../_services/gameLocal.service";
import {Output} from "@angular/core/src/metadata/directives";

@Component({
    moduleId: module.id,
    providers: [GameService],
    selector: 'game-new',
    templateUrl: './game-new.component.html',
    animations: [routerTransition()],
    host: {'[@routerTransition]': '', class: 'mainPage fakePage'}
})
export class GameNewComponent {

    errorMessage: string;

    private search: string = '';
    private games: Array<any>;
    selectedGame: any;
    private selectedPlatform;
    private subscription;
    private buttonClass: Array<string> = [];

    @Output() state: EventEmitter<string> = new EventEmitter();

    constructor(private gameService: GameService,
                private gameLocalService: GameLocalService,
                public slimLoadingBarService: SlimLoadingBarService,
                private renderer: Renderer,) {
    }

    ngOnInit() {
        this.slimLoadingBarService.reset();
        this.search = this.gameLocalService.getNewGameSearch();
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

    getPlatformButtonClass(game: Game, platform) {

        let userGame = this.gameLocalService.getNewUserGame();
        userGame.game = game;
        userGame.platform = platform;

        userGame = this.gameLocalService.getUserGameByPlatform(userGame);

        if (userGame.user) {
            return 'btn-success';
        }

        return 'btn-primary';
    }

    onSelect(game, platform: Object): void {

        this.selectedGame = game;
        this.selectedPlatform = platform;
        if (this.selectedGame.first_release_date) {
            var date = new Date(this.selectedGame.first_release_date);
            this.selectedGame.release_date = formatDate(date, 'd/m/y');
        }
    }

    setItemClass(e) {
        if (e.value) {
            this.renderer.setElementProperty(e.target, 'className', 'gameBox visible_anim');
        } else {
            this.renderer.setElementProperty(e.target, 'className', 'gameBox');
        }
    }

    formStateUpdate(event) {

        this.state.emit(event);
    }
}