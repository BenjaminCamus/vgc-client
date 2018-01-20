import {Component, Input, Output, OnInit, EventEmitter} from '@angular/core';
import {FormGroup, FormBuilder} from '@angular/forms';
import {CustomValidators} from 'ng2-validation';
import {SlimLoadingBarService}    from 'ng2-slim-loading-bar';

import {Game}    from '../../_models/game';
import {GameService}       from '../../_services/game.service';
import {UserGame} from "../../_models/userGame";
import {Router} from "@angular/router";
import {Platform} from "../../_models/platform";

import {Place} from "../../_models/place";
import {orderByName} from "../../functions";
import {Contact, NewContact} from "../../_models/contact";
import {GameLocalService} from "../../_services/gameLocal.service";

function validatePrice(fc) {
    let val = fc.value;
    if (!val || val == '' || CustomValidators.digits(fc) === null) {
        return null;
    }
    return {invalidPrice: true};
}

@Component({
    moduleId: module.id,
    providers: [GameService],
    selector: 'game-form',
    templateUrl: './game-form.component.html'
})
export class GameFormComponent implements OnInit {

    errorMessage: string;

    @Input() game: Game;
    @Input() platform: Platform;
    _userGame: UserGame = new UserGame();
    @Input() set userGame(userGame: UserGame) {
        this._userGame = userGame;
        this.updateSelects();
    }
    @Input() action: string;
    @Input() set update(update: number) {
        this.updateSelects();
    }
    @Output() state: EventEmitter<string> = new EventEmitter();

    private userContacts: Contact[];
    private places: Place[];
    private validateUserGameForm: FormGroup;

    newContact = NewContact;
    newContacts = {
        'purchase': new Contact(),
        'sale': new Contact()
    };

    constructor(private gameService: GameService,
                private gameLocalService: GameLocalService,
                private slimLoadingBarService: SlimLoadingBarService,
                private router: Router,
                private fb: FormBuilder,) {
        this.validateUserGameForm = fb.group({
            'rating': ['', [CustomValidators.range([0, 20])]],
            'priceAsked': ['', [validatePrice]],
            'pricePaid': ['', [validatePrice]],
            'priceResale': ['', [validatePrice]],
            'priceSold': ['', [validatePrice]],
            'purchaseDate': ['', [CustomValidators.date]],
            'saleDate': ['', [CustomValidators.date]]
        });
    }

    ngOnInit(): void {

        this.userContacts = this.gameLocalService.getUserContacts();
        this.getContacts();

        this.gameService.getPlaces()
            .subscribe(
                places => {
                    places.sort(orderByName);
                    this.places = places;
                    this.updateSelects();
                },
                error => {
                    this.errorMessage = <any>error;
                });
    }

    submitForm() {
        if (this.action == 'delete') {
            this.deleteUserGame();
        }
        else {
            this.postUserGame();
        }
    }

    postUserGame() {
        this.slimLoadingBarService.start();
        this.state.emit('submitted');

        if (!this._userGame.game.igdbId) {
            this._userGame.game.igdbId = +this.game.id;
        }
        if (!this._userGame.platform.igdbId) {
            this._userGame.platform.igdbId = +this.platform.id;
        }

        if (this._userGame.purchaseContact && this._userGame.purchaseContact.id == 0) {
            this._userGame.purchaseContact = this.newContacts['purchase'];
        }

        if (this._userGame.saleContact && this._userGame.saleContact.id == 0) {
            this._userGame.saleContact = this.newContacts['sale'];
        }

        this.gameService.postUserGame(this._userGame)
            .subscribe(
                userGame => {

                    this._userGame = userGame;
                    this.gameLocalService.setUserGame(userGame);

                    this.router.navigate(['/game', userGame.platform.slug, userGame.game.slug]);
                    this.state.emit('success');
                    this.slimLoadingBarService.complete();
                },
                error => {
                    this.slimLoadingBarService.complete();
                    this.errorMessage = <any>error;
                });


    }

    deleteUserGame() {
        this.slimLoadingBarService.start();
        this.state.emit('submitted');

        this.gameService.deleteUserGame(this._userGame)
            .subscribe(
                response => {

                    // userGame local storage
                    this.gameLocalService.removeUserGame(this._userGame);

                    this.router.navigate(['/games']);
                    this.state.emit('success');
                    this.slimLoadingBarService.complete();
                },
                error => {
                    this.slimLoadingBarService.complete();
                    this.errorMessage = <any>error;
                });
    }

    getContacts() {
        if (this.slimLoadingBarService.progress == 0) {
            this.gameService.getUserContacts()
                .subscribe(
                    userContacts => {
                        userContacts.sort(orderByName);
                        this.userContacts = userContacts;
                        this.gameLocalService.setUserContacts(this.userContacts);
                        this.updateSelects();
                    },
                    error => {
                        this.errorMessage = <any>error;
                    });
        }
    }

    updateSelects() {

        if (this.userContacts) {
            if (this._userGame.purchaseContact) {
                this._userGame.purchaseContact = this.userContacts.find(contact => contact.id === this._userGame.purchaseContact.id);
            }
            if (this._userGame.saleContact) {
                this._userGame.saleContact = this.userContacts.find(contact => contact.id === this._userGame.saleContact.id);
            }
        }

        if (this.places) {
            if (this._userGame && this._userGame.purchasePlace) {
                this._userGame.purchasePlace = this.places.find(place => place.id === this._userGame.purchasePlace.id);
            }
            if (this._userGame && this._userGame.salePlace) {
                this._userGame.salePlace = this.places.find(place => place.id === this._userGame.salePlace.id);
            }
        }
    }

    updateDate(e, sp) {
        if (!e) {
            this._userGame[sp + 'Date'] = null;
        }
        else {
            this._userGame[sp + 'Date'] = new Date(e);
        }
    }
}