import { NgModule }             from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AuthGuard } from './_guards/auth.guard';
import { LoginComponent } from './login/login.component';

import { GamesComponent }       from './game/list/game-list.component';
import { GameNewComponent }  from './game/new/game-new.component';
import { GameDetailComponent }  from './game/detail/game-detail.component';

const routes: Routes = [
  { path: 'login', component: LoginComponent, data: {action: 'login'} },
  { path: 'register', component: LoginComponent, data: {action: 'register'} },
  { path: '', redirectTo: '/games', pathMatch: 'full' },
  { path: 'game/new',  component: GameNewComponent },
  { path: 'game/igdb/:id',     component: GameDetailComponent },
  { path: 'game/:platformSlug/:gameSlug',     component: GameDetailComponent },
  { path: 'games',        component: GamesComponent, canActivate: [AuthGuard] }
];

@NgModule({
  imports: [ RouterModule.forRoot(routes) ],
  exports: [ RouterModule ]
})
export class AppRoutingModule {}


/*
Copyright 2016 Google Inc. All Rights Reserved.
Use of this source code is governed by an MIT-style license that
can be found in the LICENSE file at http://angular.io/license
*/