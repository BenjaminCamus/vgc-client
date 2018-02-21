import {trigger, animate, style, transition} from '@angular/core';

export function carouselTransition() {
    return trigger('carouselTransition', [

        // Leave to left
        transition('next => void', [
            style({transform: 'translateX(0%)'}),
            animate('0.5s ease-in-out', style({transform: 'translateX(-100%)'})),
        ]),

        // Enter from right
        transition('void => next', [
            style({transform: 'translateX(100%)'}),
            animate('0.5s ease-in-out', style({transform: 'translateX(0)'})),
        ]),

        // Leave to right
        transition('prev => void', [
            style({transform: 'translateX(0%)'}),
            animate('0.5s ease-in-out', style({transform: 'translateX(100%)'})),
        ]),

        // Enter from left
        transition('void => prev', [
            style({transform: 'translateX(-100%)'}),
            animate('0.5s ease-in-out', style({transform: 'translateX(0)'})),
        ]),
    ]);
}