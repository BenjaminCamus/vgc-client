import {Component, OnInit} from "@angular/core";
import {Router, ActivatedRoute} from "@angular/router";
import {routerTransition} from "../_animations/router.animations";
import {AuthenticationService} from "../_services/authentification.service";
import {GameLocalService} from "../_services/gameLocal.service";

@Component({
    moduleId: module.id,
    selector: 'login',
    templateUrl: './login.component.html',
    animations: [routerTransition()],
    host: {'[@routerTransition]': '', 'class': 'mainPage'}
})
export class LoginComponent implements OnInit {
    user: any = {};
    action: string = 'login';
    error = '';
    loading: boolean = false;

    constructor(private router: Router,
                private route: ActivatedRoute,
                private authenticationService: AuthenticationService,
                private gameLocalService: GameLocalService) {
    }

    ngOnInit() {
        this.gameLocalService.resetAll();
        this.authenticationService.logout();

        this.route.data.subscribe(params => {
            this.action = params['action'];
        });
    }

    switchAction() {
        this.user = {};
        this.action = this.action === 'login' ? 'register' : 'login';
    }

    login() {
        this.loading = true;

        this.authenticationService.login(this.user)
            .subscribe(
                result => {
                    if (result === true) {
                        // login successful
                        this.router.navigate(['/']);
                    } else {
                        // login failed
                        this.error = 'GAME OVER, TRY AGAIN';
                    }
                    this.loading = false;
                },
                error => {
                    this.loading = false;
                    this.error = error;
                }
            );
    }
}
