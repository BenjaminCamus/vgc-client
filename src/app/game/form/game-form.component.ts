import {Component, Renderer, Input, OnInit} from '@angular/core';
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

    @Input() game: Game;
    @Input() platform: Platform;
    @Input() userGame: UserGame;
    private userContacts: Contact[];
    private places: Place[];

    @Input()
    set update(update: number) {
        this.updateSelects();
    }

    updateSelects() {
        console.log('updateSelects');
        if (this.userContacts) {
            if (this.userGame.purchaseContact) {
                this.userGame.purchaseContact = this.userContacts.find(contact => contact.id === this.userGame.purchaseContact.id);
            }
            console.log(this.userGame.purchaseContact);
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

    validateUserGameForm: FormGroup;

    newContact = NewContact;
    newContacts = {
        'purchase': new Contact(),
        'sale': new Contact()
    };

    loading: boolean = false;
    errorMessage: string;
    submitted = false;

    constructor(private gameService: GameService,
                private slimLoadingBarService: SlimLoadingBarService,
                private renderer: Renderer,
                private router: Router,
                private fb: FormBuilder,
    ) {
        this.validateUserGameForm = fb.group({
            'rating':  ['', [CustomValidators.range([0, 20])]],
            'priceAsked':  ['', [validatePrice]],
            'pricePaid':  ['', [validatePrice]],
            'priceResale':  ['', [validatePrice]],
            'priceSold':  ['', [validatePrice]],
            'purchaseDate':  ['', [CustomValidators.date]],
            'saleDate':  ['', [CustomValidators.date]]
        });
    }

    ngOnInit(): void {

        // if (localStorage.getItem('newUserGame')) {
        //     this.userGame = JSON.parse(localStorage.getItem('newUserGame'));
        // }
        // else {
        if (!this.userGame) {
            this.userGame = new UserGame();
        }

        // }


        if (localStorage.getItem('userContacts')) {
            this.userContacts = JSON.parse(localStorage.getItem('userContacts'));
        }
        else {
            this.loading = true;
            this.getContacts();
        }

        this.gameService.getPlaces()
            .subscribe(
                places => {
                    places.sort(orderByName);
                    this.places = places;
                    this.updateSelects();
                },
                error => this.errorMessage = <any>error);
    }

    updateDate(e, sp) {
        if (!e) {
            this.userGame[sp+'Date'] = null;
        }
        else {
            this.userGame[sp+'Date'] = new Date(e);
        }
    }

    postUserGame() {
        this.slimLoadingBarService.start();

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

                    // userGame local storage
                    localStorage.setItem('game/'+userGame.platform.slug+'/'+userGame.game.slug, JSON.stringify(userGame));

                    this.router.navigate(['/game', userGame.platform.slug, userGame.game.slug]);
                    this.slimLoadingBarService.complete();
                },
                error => this.errorMessage = <any>error);

        this.submitted = true;

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
}