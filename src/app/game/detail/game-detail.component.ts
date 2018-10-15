import {Component, Input, Output, ChangeDetectorRef, EventEmitter} from "@angular/core";
import {Game} from "../../_models/game";
import {GameService} from "../../_services/game.service";
import {GameLocalService} from "../../_services/gameLocal.service";
import {UserGame} from "../../_models/userGame";
import {TagComponent} from "../../tag/tag.component";
import {GameFormComponent} from "../form/game-form.component";
import {LoadingComponent} from "../../loading/loading.component";
import {UserGameValuePipe} from "../../_pipes/userGameValue.pipe";
import {DatePipe} from "@angular/common";
import {FormatNamePipe} from "../../_pipes/formatName.pipe";
import {carouselTransition} from "../../_animations/carousel.animations";

@Component({
    moduleId: module.id,
    providers: [GameService, GameLocalService, TagComponent, LoadingComponent, GameFormComponent, UserGameValuePipe, DatePipe, FormatNamePipe],
    selector: 'game-detail',
    templateUrl: './game-detail.component.html',
    animations: [carouselTransition()],
    host: {'[@carouselTransition]': 'transitionState', class: 'mainPage fakePage'}
})
export class GameDetailComponent {

    @Input() transitionState: string;
    @Input() userGame: UserGame;
    @Output() state: EventEmitter<string> = new EventEmitter();

    selectedGame: Game = null;
    private selectedPlatform: Object;

    userFields = [['userGame.rating', 'userGame.progress', 'userGame.version', 'userGame.cond', 'userGame.completeness'],
        ['userGame.pricePaid', 'userGame.priceAsked', 'userGame.purchaseDate', 'userGame.purchasePlace', 'userGame.purchaseContact'],
        ['userGame.priceResale', 'userGame.priceSold', 'userGame.saleDate', 'userGame.salePlace', 'userGame.saleContact']];
    gameFields = ['game.series', 'userGame.releaseDate', 'game.developers', 'game.publishers', 'game.modes', 'game.themes', 'game.genres', 'game.rating', 'game.igdbUrl'];

    private formAction: string;

    constructor (private changeDetectorRef: ChangeDetectorRef) {
        this.changeDetectorRef = changeDetectorRef;
    }

    /**
     * Open edit or delete form
     * @param action
     */
    openForm(action: string): void {

        if (!action || (this.formAction == action && this.selectedGame)) {
            this.selectedGame = null;
            this.selectedPlatform = null;
        }
        else {
            this.formAction = action;
            this.selectedGame = this.userGame.game;
            this.selectedPlatform = this.userGame.platform;
        }
    }

    /**
     * On form state update: emit event
     */
    formStateUpdate(event) {

        this.state.emit(event);
    }
}