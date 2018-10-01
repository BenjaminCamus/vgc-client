import {Component, OnInit, Input} from '@angular/core';
import {routerTransition} from '../../_animations/router.animations';
import {UserGameFilter} from "../../_models/userGameFilter";
import {TranslatePipe} from "@ngx-translate/core";

@Component({
    moduleId: module.id,
    providers: [TranslatePipe],
    selector: 'game-chart',
    templateUrl: './game-chart.component.html',
    animations: [routerTransition()],
    host: {'[@routerTransition]': '', class: 'mainPage fakePage'}
})
export class GameChartComponent implements OnInit {

    @Input() userGameFilter: UserGameFilter;

    fields = [
        'userGame.platform', 'game.series', 'game.developers', 'game.publishers', 'game.modes', 'game.themes', 'game.genres',
        'userGame.rating', 'userGame.version', 'userGame.progress', 'userGame.cond', 'userGame.completeness',
        'userGame.price',
        'userGame.purchasePlace', 'userGame.purchaseContact', 'userGame.purchaseDate',
        'userGame.salePlace', 'userGame.saleContact', 'userGame.saleDate'
    ];
    @Input() field = 'userGame.platform';

    colors = [
        'rgba(139, 233, 253, .5)',
        'rgba(80, 250, 123, .5)',
        'rgba(255, 184, 108, .5)',
        'rgba(255, 121, 198, .5)',
        'rgba(189, 147, 249, .5)',
        'rgba(255, 85, 85, .5)',
        'rgba(241, 250, 140, .5)'
    ];
    colorsHover = [
        'rgba(139, 233, 253, 1)',
        'rgba(80, 250, 123, 1)',
        'rgba(255, 184, 108, 1)',
        'rgba(255, 121, 198, 1)',
        'rgba(189, 147, 249, 1)',
        'rgba(255, 85, 85, 1)',
        'rgba(241, 250, 140, 1)'
    ];

    chartData: any = {};
    chartType: any = {};
    chartOptions: any = {};

    constructor(private translatePipe: TranslatePipe) {
    }

    ngOnInit() {

        for (var fieldIndex in this.fields) {

            var objectField = this.fields[fieldIndex].split('.');
            var field = objectField[1];

            if (this.userGameFilter.stats.count[field]) {

                var test = false;
                for (let count in this.userGameFilter.stats.count[field]) {
                    test = true;
                    continue;
                }

                if (!test) {
                    continue;
                }
            }

            this.chartType[this.fields[fieldIndex]] = 'doughnut';

            this.chartOptions[this.fields[fieldIndex]] = {
                legend: {
                    display: true,
                    position: 'left',
                    labels: {
                        fontColor: '#fff',
                        fontSize: 14,
                        fontFamily: 'Share Tech Mono'
                    }
                },
                tooltips: {
                    bodyFontColor: '#fff',
                    bodyFontSize: 14,
                    bodyFontFamily: 'Share Tech Mono',
                    callbacks: {
                        label: function (tooltipItem, data) {

                            var label =
                                ' '
                                + data.labels[tooltipItem.index]
                                + ' : '
                                + data.datasets[tooltipItem.datasetIndex].data[tooltipItem.index];

                            return label;
                        }
                    }
                },
                elements: {
                    arc: {
                        borderWidth: 0
                    }
                },
                plugins: {
                    labels: {
                        render: 'label',
                        fontColor: '#fff',
                        fontSize: 14,
                        fontFamily: 'Share Tech Mono',
                        textShadow: true,
                        shadowBlur: 3,
                        shadowOffsetX: 1,
                        shadowOffsetY: 1,
                        shadowColor: '#000'
                    }
                }
            };

            this.chartData[this.fields[fieldIndex]] = {
                labels: [],
                datasets: [
                    {
                        label: null,
                        data: [],
                        backgroundColor: this.colors,
                        hoverBackgroundColor: this.colorsHover
                    }
                ]
            };

            if (field == 'rating') {

                this.chartType[this.fields[fieldIndex]] = 'bar';
                this.chartOptions[this.fields[fieldIndex]].legend.display = false;

                this.chartData[this.fields[fieldIndex]].datasets[0].backgroundColor = this.colors[0];
                this.chartData[this.fields[fieldIndex]].datasets[0].hoverBackgroundColor = this.colorsHover[0];

                this.chartData[this.fields[fieldIndex]].datasets[1] = {
                    data: [],
                    backgroundColor: 'rgba(80, 250, 123, .5)',
                    hoverBackgroundColor: 'rgba(80, 250, 123, 1)'
                };
            }
            else if(field == 'price') {

                this.chartType[this.fields[fieldIndex]] = 'line';

                for (let i = 0; i <= 3; i++) {
                    this.chartData[this.fields[fieldIndex]].datasets[i] = {
                        data: [],
                        fill: false,
                        borderColor: this.colors[i]
                    };
                }
            }
            else if (field.substr(field.length - 4) == 'Date') {

                this.chartType[this.fields[fieldIndex]] = 'line';
                this.chartOptions[this.fields[fieldIndex]].legend.display = false;
                this.chartData[this.fields[fieldIndex]].datasets[0] = {
                    data: [],
                    fill: false,
                    borderColor: this.colors[0]
                };
            }

            var tagField = field == 'price' ? "pricePaid" : field;
            for (let i in this.userGameFilter.stats.tags[tagField]) {

                if (parseInt(i, 10) < 7 || field == 'price' || field == 'rating' || field.substr(field.length - 4) == 'Date') {

                    let label: string = '';
                    let data = [];

                    switch (field) {

                        case 'price':
                            let price = this.userGameFilter.stats.tags.pricePaid[i];
                            label = price * 10 + '-' + (price * 10 + 10);
                            // label = price;
                            var priceTypes = ['pricePaid', 'priceAsked', 'priceResale', 'priceSold'];
                            for (let p in priceTypes) {
                                this.chartData[this.fields[fieldIndex]].datasets[p].label = this.translatePipe.transform('field.userGame.' + priceTypes[p]);
                                data.push(this.userGameFilter.stats.count[priceTypes[p]][this.userGameFilter.stats.tags[priceTypes[p]][i]]);
                            }
                            break;

                        case 'rating':
                            label = this.userGameFilter.stats.tags[field][i];
                            data.push(this.userGameFilter.stats.count[field][this.userGameFilter.stats.tags[field][i]]);
                            data.push(this.userGameFilter.stats.count.ratingIGDB[this.userGameFilter.stats.tags.ratingIGDB[i]]);
                            break;

                        case 'purchasePlace':
                        case 'salePlace':
                        case 'version':
                            label = this.userGameFilter.stats.tags[field][i];
                            data.push(this.userGameFilter.stats.count[field][this.userGameFilter.stats.tags[field][i]]);
                            break;

                        case 'purchaseDate':
                        case 'saleDate':
                            console.log(this.userGameFilter.stats.tags[field][i]);
                            let date = this.userGameFilter.stats.tags[field][i].split('/');
                            label = date[1] + '/' + date[0];
                            data.push(this.userGameFilter.stats.count[field][this.userGameFilter.stats.tags[field][i]]);
                            break;

                        case 'progress':
                        case 'cond':
                        case 'completeness':
                            label = this.userGameFilter.stats.tags[field][i];
                            label = 'enum.' + field + '.' + label;
                            label = this.translatePipe.transform(label);
                            data.push(this.userGameFilter.stats.count[field][this.userGameFilter.stats.tags[field][i]]);
                            break;

                        case 'purchaseContact':
                        case 'saleContact':
                            label = this.userGameFilter.stats.tags[field][i].firstName;
                            data.push(this.userGameFilter.stats.count[field][this.userGameFilter.stats.tags[field][i].id]);
                            break;

                        default:
                            label = this.userGameFilter.stats.tags[field][i].name;
                            data.push(this.userGameFilter.stats.count[field][this.userGameFilter.stats.tags[field][i].id]);
                            break;
                    }

                    label += '';

                    if (label != '') {
                        this.chartData[this.fields[fieldIndex]].labels.push(label.substring(0, 15) + (label.length > 15 ? '...' : ''));

                        for (let i in data) {
                            this.chartData[this.fields[fieldIndex]].datasets[i].data.push(data[i]);
                        }
                    }
                }
            }
        }
    }
}