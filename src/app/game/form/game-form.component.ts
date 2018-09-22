import {Component, Input, Output, OnInit, EventEmitter, ElementRef} from '@angular/core';
import {FormGroup, FormBuilder} from '@angular/forms';
import {CustomValidators} from 'ng2-validation';

import {Game}    from '../../_models/game';
import {GameService}       from '../../_services/game.service';
import {UserGame} from "../../_models/userGame";
import {Router} from "@angular/router";
import {Platform} from "../../_models/platform";

import {orderByName} from "../../functions";
import {Contact, NewContact} from "../../_models/contact";
import {GameLocalService} from "../../_services/gameLocal.service";

@Component({
    moduleId: module.id,
    providers: [GameService],
    selector: 'game-form',
    templateUrl: './game-form.component.html'
})
export class GameFormComponent implements OnInit {

    loading: boolean = false;
    errorMessage: string;

    @Input() game: Game;
    @Input() platform: Platform;
    _userGame: UserGame = new UserGame();
    @Input() set userGame(userGame: UserGame) {
        this._userGame = Object.assign({}, userGame);
        this.updateSelects();
    }
    @Input() action: string;
    @Input() set update(update: number) {
        this.updateSelects();
    }
    @Output() state: EventEmitter<string> = new EventEmitter();

    private userContacts: Contact[];
    private places: string[];
    private purchasePlaceSelect: boolean = true;
    private salePlaceSelect: boolean = true;

    private validateUserGameForm: FormGroup;

    newContact = new Contact();
    newContacts = {
        'purchase': new Contact(),
        'sale': new Contact()
    };

    constructor(private gameService: GameService,
                private gameLocalService: GameLocalService,
                private router: Router,
                private fb: FormBuilder,) {
        this.validateUserGameForm = fb.group({
            'rating': ['', [CustomValidators.digits, CustomValidators.range([0, 20])]],
            'priceAsked': ['', [CustomValidators.number]],
            'pricePaid': ['', [CustomValidators.number]],
            'priceResale': ['', [CustomValidators.number]],
            'priceSold': ['', [CustomValidators.number]],
            'purchaseDate': ['', [CustomValidators.date]],
            'saleDate': ['', [CustomValidators.date]]
        });
    }

    ngOnInit(): void {

        this.userContacts = this.gameLocalService.getUserContacts();
        this.places = this.gameLocalService.getPlaces();
        this.updateSelects();
        this.getContacts();
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
        this.loading = true;
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
                    this.state.emit('add_'+JSON.stringify(this._userGame));
                },
                error => {
                    this.errorMessage = <any>error;
                    this.loading = false;
                });


    }

    deleteUserGame() {
        this.loading = true;
        this.state.emit('submitted');

        this.gameService.deleteUserGame(this._userGame)
            .subscribe(
                response => {
                    this.gameLocalService.removeUserGame(this._userGame);
                    this.state.emit('delete_'+JSON.stringify(this._userGame));
                },
                error => {
                    this.errorMessage = <any>error;
                });
    }

    getContacts() {
        if (!this.loading) {
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
                this._userGame.purchasePlace = this.places.find(place => place === this._userGame.purchasePlace);
            }
            if (this._userGame && this._userGame.salePlace) {
                this._userGame.salePlace = this.places.find(place => place === this._userGame.salePlace);
            }
        }
    }

    onSelectPlace(place: string, sp: string) {
        if (place == '__new__') {
            this[sp + 'PlaceSelect'] = false;
            this._userGame[sp + 'Place'] = '';
        }
    }
}