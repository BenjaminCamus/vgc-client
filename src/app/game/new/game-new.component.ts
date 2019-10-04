import {Component, Renderer2, OnInit, OnDestroy, ViewChild, EventEmitter, Output} from '@angular/core';

import {routerTransition} from '../../_animations/router.animations';

import {Game}    from '../../_models/game';
import {GameService}       from '../../_services/game.service';
import {orderByName, formatDate} from "../../functions";
import {GameLocalService} from "../../_services/gameLocal.service";
import {environment} from "../../../environments/environment";

@Component({
    moduleId: module.id,
    providers: [GameService],
    selector: 'game-new',
    templateUrl: './game-new.component.html',
    animations: [routerTransition()],
    host: {'[@routerTransition]': '', 'class': 'mainPage fakePage'}
})
export class GameNewComponent {

    errorMessage: string;

    private environment = environment;
    private search: string = '';
    private games: Array<any>;
    selectedGame: any;
    private selectedPlatform;
    private subscription;
    private buttonClass: Array<string> = [];
    loading: boolean = false;

    @Output() state: EventEmitter<string> = new EventEmitter();

    constructor(private gameService: GameService,
                private gameLocalService: GameLocalService,
                private renderer: Renderer2,) {
    }

    ngOnInit() {
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
            this.gameLocalService.setNewGameSearch(this.search);

            this.loading = true;
            this.subscription = this.gameService.igdbSearch(this.search)
                .subscribe(
                    games => {
                        games = games.filter(function (elem, index, self) {
                            return index == self.indexOf(elem);
                        });

                        this.games = games.sort(orderByName);

                        for (let game of this.games) {
                            for (let platform of game.platforms) {
                                this.getPlatformButtonClass(game, platform);

                            }
                        }

                        this.loading = false;
                    },
                    error => {
                        this.loading = false;
                        this.errorMessage = <any>error;
                    });
        }
    }

    getPlatformButtonClass(game: Game, platform) {

        this.buttonClass[game.id + '_' + platform.id] = 'btn-primary';

        let userGame = this.gameLocalService.getNewUserGame();
        userGame.game = game;
        userGame.platform = platform;

        return this.gameLocalService.getUserGameByPlatform(userGame).then(
            userGame => {

                if (userGame.user) {
                    this.buttonClass[game.id + '_' + platform.id] = 'btn-success';
                }
            },
            error => {
                this.loading = false;
                this.errorMessage = <any>error;
            });
    }

    onSelect(game, platform: Object): void {

        this.selectedGame = game;
        this.selectedPlatform = platform;
        if (this.selectedGame.first_release_date) {
            var date = new Date(this.selectedGame.first_release_date);
            this.selectedGame.release_date = formatDate(date, 'd/m/y');
        }
    }

    formStateUpdate(event) {

        this.state.emit(event);
    }
}
