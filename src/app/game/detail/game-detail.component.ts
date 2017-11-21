import {Component, OnInit, ViewChild, ChangeDetectorRef} from "@angular/core";
import {Router, ActivatedRoute} from "@angular/router";
import {SlimLoadingBarService} from "ng2-slim-loading-bar";
import {ModalComponent} from "ng2-bs3-modal/ng2-bs3-modal";
import {routerTransition} from "../../_animations/router.animations";
import {Game} from "../../_models/game";
import {GameService} from "../../_services/game.service";
import {UserGame} from "../../_models/userGame";
import {TagComponent} from "../../tag/tag.component";
import {Platform} from "../../_models/platform";

@Component({
    moduleId: module.id,
    providers: [ GameService, TagComponent ],
    selector: 'game-detail',
    templateUrl: './game-detail.component.html',
    animations: [routerTransition()],
    host: {'[@routerTransition]': 'orientation', class: 'mainPage'},
})
export class GameDetailComponent implements OnInit {

    @ViewChild('modal')
    modal: ModalComponent;
    errorMessage: string;

    loading: boolean = true;

    public orientation: string;
    private userGame: UserGame;
    private gameIds = [456, 1245, 3265, 1235 , 32];

    constructor (
        private gameService: GameService,
        private router: Router,
        private route: ActivatedRoute,
        private slimLoadingBarService: SlimLoadingBarService,
        private changeDetectorRef: ChangeDetectorRef
    ) {
        this.changeDetectorRef = changeDetectorRef;
        this.orientation = "none";
    }

    ngOnInit(): void {
        this.route.params.subscribe(params => {
            this.userGame = new UserGame();
            this.userGame.platform = new Platform();
            this.userGame.platform.slug = params['platformSlug'];
            this.userGame.game = new Game('Chargement...');
            this.userGame.game.slug = params['gameSlug'];

            // In a real app: dispatch action to load the details here.
        });
        // this.route.params
        //     .switchMap((params: Params) => this.game.id = +params['id']);
        this.getGame();
    }


    getGame() {
        this.slimLoadingBarService.start(() => {
            //console.log('Loading complete');
        });
        this.gameService.getGame(this.userGame)
            .subscribe(
                userGame => {
                    console.log(userGame);
                    this.userGame = userGame;
                    this.loading = false;
                    this.slimLoadingBarService.complete();
                },
                error =>  this.errorMessage = <any>error);
    };

    // // I cycle to the next friend in the collection.
    // public showNextFriend() : void {
    //
    //     // Change the "state" for our animation trigger.
    //     this.orientation = "next";
    //
    //     // Force the Template to apply the new animation state before we actually
    //     // change the rendered element view-model. If we don't force a change-detection,
    //     // the new [@orientation] state won't be applied prior to the "leave" transition;
    //     // which means that we won't be leaving from the "expected" state.
    //     this.changeDetectorRef.detectChanges();
    //
    //     // Find the currently selected index.
    //     var index = this.friends.indexOf( this.selectedFriend );
    //
    //     // Move the rendered element to the next index - this will cause the current item
    //     // to enter the ( "next" => "void" ) transition and this new item to enter the
    //     // ( "void" => "next" ) transition.
    //     this.selectedFriend = this.friends[ index + 1 ]
    //         ? this.friends[ index + 1 ]
    //         : this.friends[ 0 ]
    //     ;
    //
    // }
    //
    //
    // // I cycle to the previous friend in the collection.
    // public showPrevFriend() : void {
    //
    //     // Change the "state" for our animation trigger.
    //     this.orientation = "prev";
    //
    //     // Force the Template to apply the new animation state before we actually
    //     // change the rendered element view-model. If we don't force a change-detection,
    //     // the new [@orientation] state won't be applied prior to the "leave" transition;
    //     // which means that we won't be leaving from the "expected" state.
    //     this.changeDetectorRef.detectChanges();
    //
    //     // Find the currently selected index.
    //     var index = this.friends.indexOf( this.selectedFriend );
    //
    //     // Move the rendered element to the previous index - this will cause the current
    //     // item to enter the ( "prev" => "void" ) transition and this new item to enter
    //     // the ( "void" => "prev" ) transition.
    //     this.selectedFriend = this.friends[ index - 1 ]
    //         ? this.friends[ index - 1 ]
    //         : this.friends[ this.friends.length - 1 ]
    //     ;
    //
    // }
}