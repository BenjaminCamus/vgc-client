import {trigger, animate, style, transition} from '@angular/animations';

export function topNavTransition() {
    return trigger('topNavTransition', [

        // Enter
        transition('void => *', [
            style({marginTop: '-70px'}),
            animate(500, style({marginTop: 0}))
        ]),

        // Leave
        transition('* => void', [
            style({marginTop: 0}),
            animate(500, style({marginTop: '-70px'}))
        ])
    ])
}