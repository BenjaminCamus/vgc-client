import {Component, Input, Output, OnInit, EventEmitter, Injector} from '@angular/core';
import {GameService} from '../../_services/game.service';
import {GameLocalService} from '../../_services/gameLocal.service';
import {TagComponent} from '../../tag/tag.component';
import {GameFormComponent} from '../form/game-form.component';
import {LoadingComponent} from '../../loading/loading.component';
import {UserGameValuePipe} from '../../_pipes/userGameValue.pipe';
import {DatePipe} from '@angular/common';
import {FormatNamePipe} from '../../_pipes/formatName.pipe';
import {routerTransition} from '../../_animations/router.animations';
import {UserGameFilter} from '../../_models/userGameFilter';
import {User} from '../../_models/user';
import {TranslatePipe} from '@ngx-translate/core';
import {orderByName} from '../../functions';
import {opacityTransition} from '../../_animations/opacity.animations';
import {topNavTransition} from '../../_animations/topNav.animations';
import {CarouselAnimations} from '../../_animations/carousel.animations';
import {DeviceDetectorService} from 'ngx-device-detector';

@Component({
    moduleId: module.id,
    providers: [TranslatePipe],
    selector: 'game-versus',
    templateUrl: './game-versus.component.html',
    animations: [routerTransition(), opacityTransition()],
    host: {'[@routerTransition]': '', 'class': 'fakePage'}
})
export class GameVersusComponent implements OnInit {

    currentUser: User;
    @Input() player1: string;
    @Input() player2: string;

    private versusData = [];
    totalPlayer1 = 0;
    totalPlayer2 = 0;
    totalMax = 0;
    winner = 0;
    userGameFilter1: UserGameFilter;
    userGameFilter2: UserGameFilter;

    private field = 'userGame.platform';
    readonly fields = [
        'userGame.platform', 'game.series', 'game.developers', 'game.publishers', 'game.modes', 'game.themes', 'game.genres',
        'userGame.price',
        'userGame.version', 'userGame.progress', 'userGame.cond', 'userGame.completeness',
        'userGame.purchasePlace', 'userGame.purchaseDate',
        'userGame.salePlace', 'userGame.saleDate'
    ];

    private image = '';

    constructor(private translatePipe: TranslatePipe, private deviceService: DeviceDetectorService) {
    }

    ngOnInit() {
        this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
        this.setData();
    }

    private setData() {
        this.versusData = [];
        this.totalPlayer1 = 0;
        this.totalPlayer2 = 0;
        this.totalMax = 0;
        this.winner = 0;

        this.userGameFilter1 = JSON.parse(localStorage.getItem('userGameFilter-' + this.player1));
        this.userGameFilter2 = JSON.parse(localStorage.getItem('userGameFilter-' + this.player2));

        this.setPlayerData(this.userGameFilter1);
        this.setPlayerData(this.userGameFilter2);

        for (const field in this.versusData) {
            if (field.substr(field.length - 4) === 'Date') {
                this.versusData[field].data = this.versusData[field].data.sort(function (a, b) {
                    const labelA = a.label.split('/');
                    const dataA = labelA[1] + '-' + labelA[0];
                    const labelB = b.label.split('/');
                    const dataB = labelB[1] + '-' + labelB[0];
                    return dataA < dataB ? 1 : (dataA > dataB ? -1 : 0);
                });
            } else {
                this.versusData[field].data = this.versusData[field].data.sort(function (a, b) {
                    const maxA = Math.max(a.count[1], a.count[2]);
                    const maxB = Math.max(b.count[1], b.count[2]);
                    return maxA < maxB ? 1 : (maxA > maxB ? -1 : 0);
                });
            }
        }

        this.totalMax = Math.max(this.totalPlayer1, this.totalPlayer2);
        this.winner = this.totalPlayer1 > this.totalPlayer2 ? 1 : (this.totalPlayer2 > this.totalPlayer1 ? 2 : 0);

        this.setImage();
    }

    private setPlayerData(userGameFilter: UserGameFilter) {

        for (const fieldIndex in this.fields) {
            if (this.fields[fieldIndex]) {

                if (!this.versusData[this.fields[fieldIndex]]) {
                    this.versusData[this.fields[fieldIndex]] = {
                        max: 0,
                        data: [],
                    };
                }

                const objectField = this.fields[fieldIndex].split('.');
                const field = objectField[1];

                if (userGameFilter.stats.count[field] && Object.keys(userGameFilter.stats.count[field]).length === 0) {
                    continue;
                }

                for (const i in userGameFilter.stats.tags[field]) {
                    if (userGameFilter.stats.tags[field][i]) {

                        const label = this.getLabel(userGameFilter, field, i);

                        if (
                            label !== ''
                            && this.versusData[this.fields[fieldIndex]].data.filter(function (elem, index, self) {
                                return label === elem.label;
                            }).length === 0
                        ) {
                            const count1 = this.getCount(this.userGameFilter1, field, userGameFilter.stats.tags[field][i]);
                            const count2 = this.getCount(this.userGameFilter2, field, userGameFilter.stats.tags[field][i]);
                            const max = Math.max(count1, count2);

                            this.versusData[this.fields[fieldIndex]].data.push({
                                label: label,
                                winner: count1 > count2 ? 1 : (count2 > count1 ? 2 : 0),
                                count: {
                                    1: count1,
                                    2: count2,
                                },
                            });

                            this.versusData[this.fields[fieldIndex]].max =
                                this.versusData[this.fields[fieldIndex]].max < max ? max : this.versusData[this.fields[fieldIndex]].max;

                            if (this.fields[fieldIndex] === 'userGame.platform') {
                                this.totalPlayer1 += count1;
                                this.totalPlayer2 += count2;
                            }
                        }
                    }
                }
            }
        }
    }

    private getLabel(userGameFilter, field, i) {

        if (!userGameFilter.stats.tags[field][i]) {
            return '';
        }

        let label = '';

        switch (field) {

            case 'purchasePlace':
            case 'salePlace':
            case 'version':
                label = userGameFilter.stats.tags[field][i];
                break;

            case 'purchaseDate':
            case 'saleDate':
                const date = userGameFilter.stats.tags[field][i].split('/');
                label = date[1] + '/' + date[0];
                break;

            case 'progress':
            case 'cond':
            case 'completeness':
                label = this.translatePipe.transform('enum.' + field + '.' + userGameFilter.stats.tags[field][i]);
                break;

            case 'price':
                label = this.translatePipe.transform('field.userGame.' + userGameFilter.stats.tags[field][i]);
                break;

            case 'platform':
                label = userGameFilter.stats.tags[field][i].slug;
                break;

            default:
                label = userGameFilter.stats.tags[field][i].name;
                break;
        }

        return label;
    }

    private getCount(userGameFilter, field, i) {

        let count = 0;

        switch (field) {

            case 'purchasePlace':
            case 'salePlace':
            case 'version':
            case 'purchaseDate':
            case 'saleDate':
            case 'progress':
            case 'cond':
            case 'completeness':
            case 'price':
                if (!userGameFilter.stats.count[field][i]) {
                    return 0;
                }

                count = userGameFilter.stats.count[field][i];
                break;

            default:
                if (!userGameFilter.stats.count[field][i.id]) {
                    return 0;
                }

                count = userGameFilter.stats.count[field][i.id];
                break;
        }

        return count;
    }

    private getWidth(field, tagIndex, playerIndex) {
        const max = this.versusData[field].max;
        return (this.versusData[field].data[tagIndex].count[playerIndex] * 100 / max) + '%';
    }

    private getClass(winner, playerIndex) {
        return winner === playerIndex ? 'success' : (winner === 0 ? 'warning' : 'danger');
    }

    private setImage() {
        const rand = Math.floor(Math.random() * 222) + 1;
        const str = '' + rand;
        const pad = '000';
        const imageId = pad.substring(0, pad.length - str.length) + str;

        this.image = 'assets/img/pixel-bg/pixel-background-' + imageId + '.gif';
    }

    private isMobile() {
        this.deviceService.isMobile();
    }
}

