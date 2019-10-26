import {NgModule} from '@angular/core';
import {RouteReuseStrategy, RouterModule, Routes} from '@angular/router';

import {AuthGuard} from './_guards/auth.guard';
import {LoginComponent} from './login/login.component';

import {GamesComponent} from './game/list/game-list.component';
import {GameNewComponent} from './game/new/game-new.component';
import {GameDetailComponent} from './game/detail/game-detail.component';
import {CustomReuseStrategy} from './route-reuse-strategy';

const routes: Routes = [
    {path: 'login', component: LoginComponent, data: {action: 'login'}},
    {path: 'register', component: LoginComponent, data: {action: 'register'}},
    {path: '', redirectTo: '/games', pathMatch: 'full'},
    {
        path: 'games', component: GamesComponent, canActivate: [AuthGuard], children: [
            {path: 'new', component: GameNewComponent},
            {path: 'show/:id', component: GameDetailComponent},
        ]
    }
];

@NgModule({
    imports: [RouterModule.forRoot(routes, {useHash: true})],
    providers: [
        {
            provide: RouteReuseStrategy,
            useClass: CustomReuseStrategy
        }
    ],
    exports: [RouterModule]
})
export class AppRoutingModule {
}
