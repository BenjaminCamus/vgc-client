import {Component, OnInit, OnDestroy, EventEmitter, Output} from '@angular/core';

import {routerTransition} from '../../_animations/router.animations';

import {Game} from '../../_models/game';
import {GameService} from '../../_services/game.service';
import {orderByName, formatDate} from '../../functions';
import {GameLocalService} from '../../_services/gameLocal.service';
import {environment} from '../../../environments/environment';
import {GamesComponent} from '../list/game-list.component';

@Component({
    moduleId: module.id,
    providers: [GameService],
    selector: 'game-new',
    templateUrl: './game-new.component.html',
    animations: [routerTransition()],
    host: {'[@routerTransition]': '', 'class': 'mainPage fakePage'}
})
export class GameNewComponent implements OnInit, OnDestroy {

    private environment = environment;
    private search: string = '';
    private games: Array<any>;
    selectedGame: any;
    private selectedPlatform;
    private subscription;
    private buttonClass: Array<string> = [];
    loading = false;

    constructor(private gameService: GameService,
                private gameLocalService: GameLocalService) {
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
        if (this.search !== '') {
            this.ngOnDestroy();
            this.gameLocalService.setNewGameSearch(this.search);

            this.loading = true;
            this.subscription = this.gameService.igdbSearch(this.search)
                .subscribe(
                    games => {
                        games = games.filter(function (elem, index, self) {
                            return index === self.indexOf(elem);
                        });

                        this.games = games.sort(orderByName);

                        this.gameLocalService.getUserGames().then(
                            userGames => {
                                for (const game of this.games) {
                                    for (const platform of game.platforms) {
                                        const index = userGames.findIndex(function (cur) {
                                            return game.id === cur.game.igdbId && platform.slug === cur.platform.slug;
                                        });

                                        this.buttonClass[game.id + '_' + platform.id] = index === -1 ? 'btn-primary' : 'btn-success';
                                    }
                                }
                            });

                        this.loading = false;
                    },
                    error => {
                        console.log(error);
                        this.loading = false;
                    });
        }
    }

    onSelect(game, platform: Object): void {

        this.selectedGame = game;
        this.selectedPlatform = platform;
        if (this.selectedGame.first_release_date) {
            const date = new Date(this.selectedGame.first_release_date);
            this.selectedGame.release_date = formatDate(date, 'd/m/y');
        }
    }
}
