import {Component, OnInit} from "@angular/core";
import {Router, ActivatedRoute} from "@angular/router";
import {SlimLoadingBarService} from 'ng2-slim-loading-bar';
import {routerTransition} from "../_animations/router.animations";
import {AuthenticationService} from "../_services/authentification.service";

@Component({
    moduleId: module.id,
    selector: 'login',
    templateUrl: './login.component.html',
    animations: [routerTransition()],
    host: {'[@routerTransition]': 'state', class: 'mainPage'}
})
export class LoginComponent implements OnInit {
    private model: any = {};
    private action: string = 'login';
    private error = '';

    constructor(private router: Router,
                private route: ActivatedRoute,
                private slimLoadingBarService: SlimLoadingBarService,
                private authenticationService: AuthenticationService) {
    }

    ngOnInit() {
        this.slimLoadingBarService.reset();

        // reset login status
        this.authenticationService.logout();

        this.route.data.subscribe(params => {
            this.action = params['action'];
        });
    }

    login() {
        this.slimLoadingBarService.start();

        this.authenticationService.login(this.model.username, this.model.password)
            .subscribe(
                result => {
                    if (result === true) {
                        // login successful
                        this.slimLoadingBarService.complete();
                        this.router.navigate(['/']);
                    } else {
                        // login failed
                        this.slimLoadingBarService.complete();
                        this.error = 'Oops! Login failed.';
                    }
                },
                error => {
                    this.slimLoadingBarService.complete();
                    this.error = error;
                }
            );
    }
}