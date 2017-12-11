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
    @Input() userGame: UserGame = new UserGame();
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

        if (!this.userGame.game.igdbId) {
            this.userGame.game.igdbId = +this.game.id;
        }
        if (!this.userGame.platform.igdbId) {
            this.userGame.platform.igdbId = +this.platform.id;
        }

        if (this.userGame.purchaseContact && this.userGame.purchaseContact.id == 0) {
            this.userGame.purchaseContact = this.newContacts['purchase'];
        }

        if (this.userGame.saleContact && this.userGame.saleContact.id == 0) {
            this.userGame.saleContact = this.newContacts['sale'];
        }

        this.gameService.postUserGame(this.userGame)
            .subscribe(
                userGame => {

                    this.userGame = userGame;
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

        this.gameService.deleteUserGame(this.userGame)
            .subscribe(
                response => {

                    // userGame local storage
                    this.gameLocalService.removeUserGame(this.userGame);

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
                        // userContacts.sort(orderByName);
                        this.userContacts = userContacts;
                        this.gameLocalService.setUserContacts(this.userContacts);
                    },
                    error => {
                        this.errorMessage = <any>error;
                    });
        }
    }

    updateSelects() {

        if (this.userContacts) {
            if (this.userGame.purchaseContact) {
                this.userGame.purchaseContact = this.userContacts.find(contact => contact.id === this.userGame.purchaseContact.id);
            }
            if (this.userGame.saleContact) {
                this.userGame.saleContact = this.userContacts.find(contact => contact.id === this.userGame.saleContact.id);
            }
        }

        if (this.places) {
            if (this.userGame && this.userGame.purchasePlace) {
                this.userGame.purchasePlace = this.places.find(place => place.id === this.userGame.purchasePlace.id);
            }
            if (this.userGame && this.userGame.salePlace) {
                this.userGame.salePlace = this.places.find(place => place.id === this.userGame.salePlace.id);
            }
        }
    }

    updateDate(e, sp) {
        if (!e) {
            this.userGame[sp + 'Date'] = null;
        }
        else {
            this.userGame[sp + 'Date'] = new Date(e);
        }
    }
}