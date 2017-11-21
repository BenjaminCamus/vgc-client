import {Component, OnInit} from "@angular/core";
import {Router, ActivatedRoute} from "@angular/router";
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
    model: any = {};
    loading = false;
    error = '';
    action: string = 'login';

    constructor(private router: Router,
                private route: ActivatedRoute,
                private authenticationService: AuthenticationService) {
    }

    ngOnInit() {
        // reset login status
        this.authenticationService.logout();

        this.route.data.subscribe(params => {
            this.action = params['action'];
        });
    }

    login() {
        this.loading = true;
        this.authenticationService.login(this.model.username, this.model.password)
            .subscribe(
                result => {
                    if (result === true) {
                        // login successful
                        this.router.navigate(['/']);
                    } else {
                        // login failed
                        this.error = 'Oops! Login failed.';
                        this.loading = false;
                    }
                },
                error => {
                    this.error = error;
                    this.loading = false;
                }
            );
    }
}