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
        'userGame.purchasePlace', 'userGame.salePlace',
        'userGame.purchaseContact', 'userGame.saleContact',
        'userGame.pricePaid', 'userGame.priceAsked', 'userGame.priceResale', 'userGame.priceSold'
    ];
    field = 'userGame.platform';

    chartData: any = {};
    chartType: any = {};
    chartOptions: any = {};

    constructor(private translatePipe: TranslatePipe) {
    }

    ngOnInit() {

        for (var fieldIndex in this.fields) {

            var objectField = this.fields[fieldIndex].split('.');
            var field = objectField[1];

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
                        data: [],
                        backgroundColor: [
                            'rgba(139, 233, 253, .5)',
                            'rgba(80, 250, 123, .5)',
                            'rgba(255, 184, 108, .5)',
                            'rgba(255, 121, 198, .5)',
                            'rgba(189, 147, 249, .5)',
                            'rgba(255, 85, 85, .5)',
                            'rgba(241, 250, 140, .5)'
                        ],
                        hoverBackgroundColor: [
                            'rgba(139, 233, 253, 1)',
                            'rgba(80, 250, 123, 1)',
                            'rgba(255, 184, 108, 1)',
                            'rgba(255, 121, 198, 1)',
                            'rgba(189, 147, 249, 1)',
                            'rgba(255, 85, 85, 1)',
                            'rgba(241, 250, 140, 1)'
                        ]
                    }
                ]
            };

            if (field.substring(0, 5) == 'price' || field == 'rating') {

                this.chartOptions[this.fields[fieldIndex]].legend.display = false;
                this.chartData[this.fields[fieldIndex]].datasets[0].backgroundColor = 'rgba(139, 233, 253, 1)';
                this.chartData[this.fields[fieldIndex]].datasets[0].hoverBackgroundColor = 'rgba(139, 233, 253, .5)';

                if (field == 'rating') {
                    this.chartType[this.fields[fieldIndex]] = 'bar';
                    this.chartData[this.fields[fieldIndex]].datasets[1] = {
                        data: [],
                        backgroundColor: 'rgba(80, 250, 123, .5)',
                        hoverBackgroundColor: 'rgba(80, 250, 123, 1)'
                    };
                    this.chartData[this.fields[fieldIndex]].datasets[1].backgroundColor = 'rgba(80, 250, 123, 1)';
                    this.chartData[this.fields[fieldIndex]].datasets[1].hoverBackgroundColor = 'rgba(80, 250, 123, .5)';
                }
                else {
                    this.chartType[this.fields[fieldIndex]] = 'line';
                    this.chartData[this.fields[fieldIndex]].datasets[0].borderColor = 'rgba(139, 233, 253, 1)';
                    this.chartData[this.fields[fieldIndex]].datasets[0].fill = false;
                }
            }

            for (var i in this.userGameFilter.stats.tags[field]) {

                if (parseInt(i, 10) < 7 || field.substring(0, 5) == 'price' || field == 'rating') {

                    if (!this.userGameFilter.stats.tags[field]) {
                        break;
                    }

                    let label: string = '';
                    let data = 0;
                    let data2;

                    switch (field) {

                        case 'pricePaid':
                        case 'priceAsked':
                        case 'priceResale':
                        case 'priceSold':
                            let price = this.userGameFilter.stats.tags[field][i];
                            label = price*10 + '-' + (price*10+10);
                            data = this.userGameFilter.stats.count[field][this.userGameFilter.stats.tags[field][i]];
                            break;

                        case 'rating':
                            label = this.userGameFilter.stats.tags[field][i];
                            data = this.userGameFilter.stats.count[field][this.userGameFilter.stats.tags[field][i]];
                            data2 = this.userGameFilter.stats.count.ratingIGDB[this.userGameFilter.stats.tags.ratingIGDB[i]];
                            break;

                        case 'purchasePlace':
                        case 'salePlace':
                        case 'version':
                            label = this.userGameFilter.stats.tags[field][i];
                            data = this.userGameFilter.stats.count[field][this.userGameFilter.stats.tags[field][i]];
                            break;

                        case 'progress':
                        case 'cond':
                        case 'completeness':
                            label = this.userGameFilter.stats.tags[field][i];
                            label = 'enum.' + field + '.' + label;
                            label = this.translatePipe.transform(label);
                            data = this.userGameFilter.stats.count[field][this.userGameFilter.stats.tags[field][i]];
                            break;

                        case 'purchaseContact':
                        case 'saleContact':
                            label = this.userGameFilter.stats.tags[field][i].firstName;
                            data = this.userGameFilter.stats.count[field][this.userGameFilter.stats.tags[field][i].id];
                            break;

                        default:
                            label = this.userGameFilter.stats.tags[field][i].name;
                            data = this.userGameFilter.stats.count[field][this.userGameFilter.stats.tags[field][i].id];
                            break;
                    }

                    label += '';

                    if (label != '') {
                        this.chartData[this.fields[fieldIndex]].labels.push(label.substring(0, 15) + (label.length > 15 ? '...' : ''));
                        this.chartData[this.fields[fieldIndex]].datasets[0].data.push(data);

                        if (field == 'rating') {
                            this.chartData[this.fields[fieldIndex]].datasets[1].data.push(data2);
                        }
                    }
                }
            }
        }
    }
}