import {Component, Input, Output, OnInit, EventEmitter, ElementRef, Renderer2, Injector} from '@angular/core';
import {FormGroup, FormBuilder} from '@angular/forms';
import {CustomValidators} from 'ng2-validation';
import {Game} from '../../_models/game';
import {GameService} from '../../_services/game.service';
import {UserGame} from '../../_models/userGame';
import {Platform} from '../../_models/platform';
import {orderByName} from '../../functions';
import {Contact} from '../../_models/contact';
import {GameLocalService} from '../../_services/gameLocal.service';
import {GamesComponent} from '../list/game-list.component';
import {Router} from '@angular/router';
import {GameDetailComponent} from '../detail/game-detail.component';

@Component({
    moduleId: module.id,
    providers: [GameService],
    selector: 'game-form',
    templateUrl: './game-form.component.html'
})
export class GameFormComponent implements OnInit {
    private gameLocalService: GameLocalService;

    public loading = false;

    @Input() game: Game;
    @Input() platform: Platform;

    private _userGame: UserGame = new UserGame();
    @Input() set userGame(userGame: UserGame) {
        this._userGame = Object.assign({}, userGame);
        this.updateSelects();
    }

    @Input() action: string;

    private userContacts: Contact[];
    private userPlaces: string[];

    private validateUserGameForm: FormGroup;

    private newContact = new Contact();
    private newContacts = {
        'purchase': new Contact(),
        'sale': new Contact()
    };

    private placeSelect = {
        purchase: true,
        sale: true,
    };

    constructor(private gameService: GameService,
                private fb: FormBuilder,
                private injector: Injector,
                private router: Router) {
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

        this.gameLocalService = this.injector.get(GamesComponent).gameLocalService;
        this.userContacts = this.gameLocalService.getUserContacts();
        this.userPlaces = this.gameLocalService.getUserPlaces();
        this.updateSelects();
        this.getContacts();
        this.getPlaces();
    }

    submitForm() {
        if (this.action === 'delete') {
            this.deleteUserGame();
        } else {
            this.postUserGame();
        }
    }

    postUserGame() {
        this.loading = true;
        this.injector.get(GamesComponent).startLoading('save');

        if (!this._userGame.game.igdbId) {
            this._userGame.game.igdbId = +this.game.id;
        }
        if (!this._userGame.platform.igdbId) {
            this._userGame.platform.igdbId = +this.platform.id;
        }

        if (this._userGame.purchaseContact && this._userGame.purchaseContact.id === 0) {
            this._userGame.purchaseContact = this.newContacts['purchase'];
        }

        if (this._userGame.saleContact && this._userGame.saleContact.id === 0) {
            this._userGame.saleContact = this.newContacts['sale'];
        }

        this.gameService.postUserGame(this._userGame)
            .subscribe(
                userGame => {
                    this.gameLocalService.setUserGame(userGame).then(
                        () => {
                            this.loading = false;
                            this.injector.get(GamesComponent).ngOnInit();
                            if (this._userGame.id !== '') {
                                this.injector.get(GameDetailComponent).openForm(false);
                            }
                            this.router.navigate(['/games/show/' + userGame.id]);
                        },
                        error => {
                            console.log(error);
                            this.loading = false;
                        });
                },
                error => {
                    console.log(error);
                    this.loading = false;
                });
    }

    deleteUserGame() {
        this.loading = true;
        this.injector.get(GamesComponent).startLoading('delete');

        this.gameService.deleteUserGame(this._userGame)
            .subscribe(
                () => {
                    this.gameLocalService.removeUserGame(this._userGame).then(
                        () => {
                            this.injector.get(GamesComponent).ngOnInit();
                            this.router.navigate(['/games']);
                        },
                        error => {
                            console.log(error);
                            this.loading = false;
                        });
                },
                error => {
                    console.log(error);
                    this.loading = false;
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
                        console.log(error);
                    });
        }
    }

    getPlaces() {
        if (!this.loading) {
            this.gameService.getUserPlaces()
                .subscribe(
                    userPlaces => {
                        userPlaces.sort();
                        this.userPlaces = userPlaces;
                        this.gameLocalService.setUserPlaces(this.userPlaces);
                        this.updateSelects();
                    },
                    error => {
                        console.log(error);
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

        if (this.userPlaces) {
            if (this._userGame && this._userGame.purchasePlace) {
                this._userGame.purchasePlace = this.userPlaces.find(place => place === this._userGame.purchasePlace);
            }
            if (this._userGame && this._userGame.salePlace) {
                this._userGame.salePlace = this.userPlaces.find(place => place === this._userGame.salePlace);
            }
        }
    }

    onSelectPlace(place: string, sp: string) {
        if (place === '__new__') {
            this.placeSelect[sp] = false;
            this._userGame[sp + 'Place'] = '';
        }
    }
}
