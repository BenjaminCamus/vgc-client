import {NgModule} from "@angular/core";
import {BrowserModule} from "@angular/platform-browser";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {CustomFormsModule} from 'ng2-validation';
import {HttpModule} from "@angular/http";
import {AppRoutingModule} from "./app-routing.module";
import {AppComponent} from "./app.component";
import {ErrorService} from "./_services/error.service";
import {AuthGuard} from "./_guards/auth.guard";
import {AuthenticationService} from "./_services/authentification.service";
import {LoginComponent} from "./login/login.component";
import {SlimLoadingBarModule} from "ng2-slim-loading-bar";
import {Ng2Bs3ModalModule} from "ng2-bs3-modal/ng2-bs3-modal";
import {SharedModule, SliderModule, TabViewModule} from "primeng/primeng";
import {FilterPipe} from "./_pipes/filter.pipe";
import {OrderByPipe} from "./_pipes/orderBy.pipe";
import {SafePipe} from "./_pipes/safe.pipe";
import {TruncatePipe} from "./_pipes/truncate.pipe";
import {InViewportModule} from "./_in-viewport/in-viewport.module";
import {GameService} from "./_services/game.service";
import {TagComponent} from "./tag/tag.component";
import {LoadingComponent} from "./loading/loading.component";
import {GamesComponent} from "./game/list/game-list.component";
import {GameDetailComponent} from "./game/detail/game-detail.component";
import {GameNewComponent} from "./game/new/game-new.component";
import {GameFormComponent} from "./game/form/game-form.component";
import {FormatNamePipe} from "./_pipes/formatName.pipe";
import {GameLocalService} from "./_services/gameLocal.service";

@NgModule({
    imports: [
        BrowserModule,
        FormsModule,
        ReactiveFormsModule,
        CustomFormsModule,
        HttpModule,
        AppRoutingModule,
        SlimLoadingBarModule.forRoot(),
        Ng2Bs3ModalModule,
        SharedModule,
        SliderModule,
        TabViewModule,
        InViewportModule.forRoot(),
    ],
    declarations: [
        FilterPipe,
        OrderByPipe,
        SafePipe,
        TruncatePipe,
        FormatNamePipe,

        AppComponent,
        LoginComponent,
        TagComponent,
        LoadingComponent,

        GamesComponent,
        GameDetailComponent,
        GameNewComponent,
        GameFormComponent

    ],
    providers: [
        ErrorService,
        AuthGuard,
        AuthenticationService,

        GameService,
        GameLocalService,
    ],
    bootstrap: [AppComponent]
})
export class AppModule {
}