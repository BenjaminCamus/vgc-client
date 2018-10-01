import {trigger, animate, style, transition} from '@angular/animations';

export function opacityTransition() {
    return trigger('opacityTransition', [

        // Enter
        transition('void => *', [
            style({opacity: 0}),
            animate(1000, style({opacity: 1}))
        ]),

        // Leave
        transition('* => void', [
            style({opacity: 1}),
            animate(1000, style({opacity: 0}))
        ])
    ])
}