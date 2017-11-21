import {Component, Renderer, OnInit, ViewChild} from '@angular/core';
import {SlimLoadingBarService}    from 'ng2-slim-loading-bar';
import {ModalComponent} from 'ng2-bs3-modal/ng2-bs3-modal';

import {routerTransition} from '../../_animations/router.animations';

import {Game}    from '../../_models/game';
import {GameService}       from '../../_services/game.service';
import {orderByName} from "../../functions";

@Component({
    moduleId: module.id,
    providers: [GameService],
    selector: 'game-new',
    templateUrl: './game-new.component.html',
    animations: [routerTransition()],
    host: {'[@routerTransition]': 'state', class: 'mainPage'}
})
export class GameNewComponent {

    @ViewChild('modal')
    modal: ModalComponent;

    model = new Game('Super Metroid');
    games: Game[];
    selectedGame: Game = new Game();
    selectedPlatform: Object;

    submitted = false;

    constructor(private gameService: GameService,
                private slimLoadingBarService: SlimLoadingBarService,
                private renderer: Renderer,) {
    }

    ngOnInit() {
        if (localStorage.getItem('newGameSearch')) {
            this.model.name = localStorage.getItem('newGameSearch');
        }
        this.onSubmit();
    }

    setItemClass(e) {
        if (e.value) {
            this.renderer.setElementProperty(e.target, 'className', 'gameBox visible_anim');
        } else {
            this.renderer.setElementProperty(e.target, 'className', 'gameBox');
        }
    }

    onSubmit() {
        localStorage.setItem('newGameSearch', this.model.name);

        this.slimLoadingBarService.start(() => {
            //console.log('Loading complete');
        });
        this.gameService.igdbSearch(this.model.name)
            .subscribe(
                games => {
                    games = games.filter(function (elem, index, self) {
                        return index == self.indexOf(elem);
                    });

                    this.games = games.slice(0,this.gameService.searchLimit).sort(orderByName);
                    this.slimLoadingBarService.complete();
                });
        this.submitted = true;
    }

    onSelect(game: Game, platform: Object): void {

        this.selectedGame = game;
        this.selectedPlatform = platform;
        this.modal.open();

        // this.gameService.getGame(game)
        //     .subscribe(
        //         game => {
        //             this.selectedGame = game;
        //             console.log(this.selectedGame);
        //             this.selectedGame.selectedPlatform = platform;
        //             this.modal.open();
        //             this.slimLoadingBarService.complete();},
        //         error =>  this.errorMessage = <any>error);
    }

}


/*
 Copyright 2016 Google Inc. All Rights Reserved.
 Use of this source code is governed by an MIT-style license that
 can be found in the LICENSE file at http://angular.io/license
 */