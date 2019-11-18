import {Component, Input, Output, OnInit, EventEmitter, Injector} from '@angular/core';
import {Game} from '../../_models/game';
import {GameService} from '../../_services/game.service';
import {GameLocalService} from '../../_services/gameLocal.service';
import {UserGame} from '../../_models/userGame';
import {TagComponent} from '../../tag/tag.component';
import {GameFormComponent} from '../form/game-form.component';
import {LoadingComponent} from '../../loading/loading.component';
import {UserGameValuePipe} from '../../_pipes/userGameValue.pipe';
import {DatePipe} from '@angular/common';
import {FormatNamePipe} from '../../_pipes/formatName.pipe';
import {ActivatedRoute, Router} from '@angular/router';
import {GamesComponent} from '../list/game-list.component';
import {routerTransition} from '../../_animations/router.animations';

@Component({
    moduleId: module.id,
    providers: [
        GameService, GameLocalService, TagComponent, LoadingComponent,
        GameFormComponent, UserGameValuePipe, DatePipe, FormatNamePipe
    ],
    selector: 'game-detail',
    templateUrl: './game-detail.component.html',
    animations: [routerTransition()],
    host: {'[@routerTransition]': '', 'class': 'fakePage'}
})
export class GameDetailComponent implements OnInit {

    public userGame: UserGame;

    private selectedGame: Game = null;
    private selectedPlatform: Object;

    readonly userFields = [
        ['userGame.rating', 'userGame.progress', 'userGame.version', 'userGame.cond', 'userGame.completeness'],
        ['userGame.pricePaid', 'userGame.priceAsked', 'userGame.purchaseDate', 'userGame.purchasePlace', 'userGame.purchaseContact'],
        ['userGame.priceResale', 'userGame.priceSold', 'userGame.saleDate', 'userGame.salePlace', 'userGame.saleContact']
    ];
    readonly gameFields = [
        'game.series', 'userGame.releaseDate', 'game.developers', 'game.publishers',
        'game.modes', 'game.themes', 'game.genres', 'game.rating', 'game.igdbUrl'
    ];

    private formAction: string|boolean;

    constructor(private router: Router,
                private route: ActivatedRoute,
                private injector: Injector,
                private gameLocalService: GameLocalService) {
    }

    ngOnInit() {
        this.injector.get(GamesComponent).setupRouting();

        const id = this.route.snapshot.paramMap.get('id');
        if (id === '') {
            this.router.navigate(['/games']);
        } else {
            this.injector.get(GamesComponent).gameLocalService.getUserGame(id).then(
                userGame => {
                    this.userGame = userGame;
                },
                error => {
                    console.log(error);
                });
        }
    }

    /**
     * Open edit or delete form
     * @param action
     */
    openForm(action: string|boolean): void {

        if (!action || (this.formAction === action && this.selectedGame)) {
            this.selectedGame = null;
            this.selectedPlatform = null;
        } else {
            this.formAction = action;
            this.selectedGame = this.userGame.game;
            this.selectedPlatform = this.userGame.platform;
        }
    }
}
