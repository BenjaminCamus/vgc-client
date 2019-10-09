import {NgModule}             from '@angular/core';
import {RouterModule, Routes} from '@angular/router';

import {AuthGuard} from './_guards/auth.guard';
import {LoginComponent} from './login/login.component';

import {GamesComponent}       from './game/list/game-list.component';
import {GameNewComponent}  from './game/new/game-new.component';
import {GameDetailComponent} from './game/detail/game-detail.component';

const routes: Routes = [
    {path: 'login', component: LoginComponent, data: {action: 'login'}},
    {path: 'register', component: LoginComponent, data: {action: 'register'}},
    {path: '', redirectTo: '/games', pathMatch: 'full'},
    {path: 'games', component: GamesComponent, canActivate: [AuthGuard], children: [
            {path: 'new', component: GameNewComponent},
            {path: ':id', component: GameDetailComponent},
        ]},
    {path: 'game/new', component: GameNewComponent}
];

@NgModule({
    imports: [RouterModule.forRoot(routes, {useHash: true})],
    exports: [RouterModule]
})
export class AppRoutingModule {
}


/*
 Copyright 2016 Google Inc. All Rights Reserved.
 Use of this source code is governed by an MIT-style license that
 can be found in the LICENSE file at http://angular.io/license
 */
