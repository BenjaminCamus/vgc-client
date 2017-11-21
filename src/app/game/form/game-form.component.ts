import {Component, Renderer, Input, OnInit} from '@angular/core';
import {SlimLoadingBarService}    from 'ng2-slim-loading-bar';

import {Game}    from '../../_models/game';
import {GameService}       from '../../_services/game.service';
import {UserGame} from "../../_models/userGame";
import {Router} from "@angular/router";
import {Platform} from "../../_models/platform";

import {Place} from "../../_models/place";
import {orderByName} from "../../functions";
import {Contact, NewContact} from "../../_models/contact";

@Component({
    moduleId: module.id,
    providers: [GameService],
    selector: 'game-form',
    templateUrl: './game-form.component.html'
})
export class GameFormComponent implements OnInit {

    @Input() game: Game;
    @Input() platform: Platform;
    userGame: UserGame;
    userContacts: Contact[];

    newContact = NewContact;
    newContacts = {
        'purchase': new Contact(),
        'sale': new Contact()
    };

    places: Place[];

    loading: boolean = false;
    errorMessage: string;
    submitted = false;

    constructor(private gameService: GameService,
                private slimLoadingBarService: SlimLoadingBarService,
                private renderer: Renderer,
                private router: Router,) {
    }

    ngOnInit(): void {

        // if (localStorage.getItem('newUserGame')) {
        //     this.userGame = JSON.parse(localStorage.getItem('newUserGame'));
        // }
        // else {
            this.userGame = new UserGame();
        // }


        if (localStorage.getItem('userContacts')) {
            this.userContacts = JSON.parse(localStorage.getItem('userContacts'));
        }
        else {
            this.getContacts();
        }

        this.gameService.getPlaces()
            .subscribe(
                places => {
                    places.sort(orderByName);
                    this.places = places;
                },
                error => this.errorMessage = <any>error);
    }

    getContacts() {
        if (!this.loading) {
            this.loading = true;
            this.gameService.getUserContacts()
                .subscribe(
                    userContacts => {
                        // userContacts.sort(orderByName);
                        this.userContacts = userContacts;
                        localStorage.setItem('userContacts', JSON.stringify(this.userContacts));
                        this.loading = false;
                    },
                    error => {
                        this.errorMessage = <any>error;
                    });
        }
    }

    postUserGame() {
        this.slimLoadingBarService.start();

        this.userGame.game.igdbId = +this.game.id;
        this.userGame.platform.igdbId = +this.platform.id;

        if (this.userGame.purchaseContact && this.userGame.purchaseContact.id == 0) {
            this.userGame.purchaseContact = this.newContacts['purchase'];
        }

        if (this.userGame.saleContact && this.userGame.saleContact.id == 0) {
            this.userGame.saleContact = this.newContacts['sale'];
        }

        this.gameService.postUserGame(this.userGame)
            .subscribe(
                userGame => {
                    localStorage.removeItem('userGames');

                    this.router.navigate(['/game', userGame.platform.slug, userGame.game.slug]);
                    this.slimLoadingBarService.complete();
                },
                error => this.errorMessage = <any>error);

        this.submitted = true;

    }

}