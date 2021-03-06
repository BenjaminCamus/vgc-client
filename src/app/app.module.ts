import {NgModule} from '@angular/core';
import {BrowserModule, HAMMER_GESTURE_CONFIG, HammerGestureConfig} from '@angular/platform-browser';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {CustomFormsModule} from 'ng2-validation';
import {HttpClientModule} from '@angular/common/http';
import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {ErrorService} from './_services/error.service';
import {AuthGuard} from './_guards/auth.guard';
import {AuthenticationService} from './_services/authentification.service';
import {LoginComponent} from './login/login.component';
import {SharedModule, SliderModule, TabViewModule, CalendarModule,
    TooltipModule, ChartModule, PaginatorModule, SidebarModule} from 'primeng/primeng';
import {FilterPipe} from './_pipes/filter.pipe';
import {OrderByPipe} from './_pipes/orderBy.pipe';
import {TerminalPipe} from './_pipes/terminal.pipe';
import {SafePipe} from './_pipes/safe.pipe';
import {TruncatePipe} from './_pipes/truncate.pipe';
import {GameService} from './_services/game.service';
import {TagComponent} from './tag/tag.component';
import {LoadingComponent} from './loading/loading.component';
import {GamesComponent} from './game/list/game-list.component';
import {GameDetailComponent} from './game/detail/game-detail.component';
import {GameNewComponent} from './game/new/game-new.component';
import {GameFormComponent} from './game/form/game-form.component';
import {FormatNamePipe} from './_pipes/formatName.pipe';
import {GameLocalService} from './_services/gameLocal.service';
import {UserGameValuePipe} from './_pipes/userGameValue.pipe';
import {WrapValuePipe} from './_pipes/wrapValue.pipe';
import {LengthPipe} from './_pipes/length.pipe';
import {TotalPipe} from './_pipes/total.pipe';
import {BannerComponent} from './banner/banner.component';
import {PreventParentScrollModule} from 'ngx-prevent-parent-scroll';
import {TranslateModule, TranslateLoader} from '@ngx-translate/core';
import {HttpClient} from '@angular/common/http';
import {TranslateHttpLoader} from '@ngx-translate/http-loader';
import {GameChartComponent} from './game/chart/game-chart.component';
import {LightboxModule} from 'ngx-lightbox';
import {GameImagesComponent} from './game/images/game-images.component';
import { DeviceDetectorModule } from 'ngx-device-detector';

export class MyHammerConfig extends HammerGestureConfig {
    overrides = <any> {
        'pinch': { enable: false },
        'rotate': { enable: false }
    };
}

// AoT requires an exported function for factories
export function HttpLoaderFactory(http: HttpClient) {
    return new TranslateHttpLoader(http, '/assets/i18n/', '.json?cb=' + new Date().getTime());
}

@NgModule({
    imports: [
        BrowserModule,
        BrowserAnimationsModule,
        FormsModule,
        ReactiveFormsModule,
        CustomFormsModule,
        HttpClientModule,
        AppRoutingModule,
        SharedModule,
        SliderModule,
        TabViewModule,
        CalendarModule,
        TooltipModule,
        ChartModule,
        PaginatorModule,
        SidebarModule,
        PreventParentScrollModule,
        LightboxModule,
        TranslateModule.forRoot({
            loader: {
                provide: TranslateLoader,
                useFactory: HttpLoaderFactory,
                deps: [HttpClient]
            }
        }),
        DeviceDetectorModule.forRoot()
    ],
    declarations: [
        FilterPipe,
        UserGameValuePipe,
        WrapValuePipe,
        OrderByPipe,
        SafePipe,
        TruncatePipe,
        FormatNamePipe,
        LengthPipe,
        TotalPipe,
        TerminalPipe,

        AppComponent,
        LoginComponent,
        BannerComponent,
        TagComponent,
        LoadingComponent,

        GamesComponent,
        GameChartComponent,
        GameDetailComponent,
        GameNewComponent,
        GameFormComponent,
        GameImagesComponent

    ],
    providers: [
        ErrorService,
        AuthGuard,
        AuthenticationService,

        {
            provide: HAMMER_GESTURE_CONFIG,
            useClass: MyHammerConfig
        },

        GameService,
        GameLocalService
    ],
    bootstrap: [AppComponent]
})
export class AppModule {
}
