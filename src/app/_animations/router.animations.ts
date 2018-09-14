import {trigger, animate, style, transition} from '@angular/animations';

export function routerTransition() {
    return trigger('routerTransition', [

        // Enter
        transition('* => void', [
            style({transform: 'translateY(0) scale(1)'}),
            animate('0.5s ease-in-out', style({transform: 'scale(0.5)'})),
            animate('0.5s ease-in-out', style({transform: 'translateY(-100%) scale(0.5)'})),
        ]),

        // Leave
        transition('void => *', [
            style({transform: 'translateY(-100%) scale(0.5)'}),
            animate('0.5s ease-in-out', style({transform: 'translateY(0) scale(0.5)'})),
            animate('0.5s ease-in-out', style({transform: 'scale(1)'})),
        ]),
    ]);
}