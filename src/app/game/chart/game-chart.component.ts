import {Component, OnInit, Input} from '@angular/core';
import {routerTransition} from '../../_animations/router.animations';
import {UserGame} from "../../_models/userGame";

@Component({
    moduleId: module.id,
    selector: 'game-chart',
    templateUrl: './game-chart.component.html',
    animations: [routerTransition()],
    host: {'[@routerTransition]': '', class: 'mainPage fakePage'}
})
export class GameChartComponent implements OnInit {

    @Input() filters;

    userGameFields = [];
    fields = {
        pie: [
            // 'purchasePlace', 'salePlace', 'purchaseContact', 'saleContact',
            'platforms', 'series', 'developers', 'publishers', 'modes', 'themes', 'genres'
        ]
    }
    field = 'platforms';

    chartData: any = {};
    chartOptions = {
        legend: {
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
                label: function(tooltipItem, data) {

                    var label =
                        ' '
                        + data.labels[tooltipItem.index]
                        + ' : '
                        + data.datasets[0].data[tooltipItem.index]
                        + ' jeu' + (data.datasets[0].data[tooltipItem.index] > 1 ? 'x' : '');

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

    constructor() {

        var ug = new UserGame();
        this.userGameFields = ug.fields;
    }

    ngOnInit() {

        for (var fieldIndex in this.fields.pie) {

            var field = this.fields.pie[fieldIndex];

            this.chartData[field] = {
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

            for (var i in this.filters.tags[field]) {

                if (parseInt(i, 10) < 7) {
                    this.chartData[field].labels.push(this.filters.tags[field][i].name);
                    this.chartData[field].datasets[0].data.push(this.filters.count[field][this.filters.tags[field][i].id]);
                }
            }
        }
    }
}