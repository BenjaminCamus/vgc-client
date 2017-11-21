import {trigger, state, animate, style, transition} from '@angular/core';

export function routerTransition() {
  return slideToBottom();
}
function slideToBottom() {
  return trigger('routerTransition', [
    // state('void', style({position:'absolute', width: '100%'}) ),
    // state('*', style({position:'absolute', width: '100%'}) ),
    // transition(':enter', [
    //   style({opacity: '0', transform: 'scale(0.9)', zIndex: '10'}),
    //   animate('0.5s 0.5s ease-in-out', style({opacity: '1', transform: 'scale(1)'}))
    // ]),
    // transition(':leave', [
    //   //style({transform: 'translateY(0%)'}),
    //   style({zIndex: '1'}),
    //   animate('0.5s ease-in-out', style({opacity: '0', transform: 'scale(1.1)'}))
    // ])



    state('none', style({position:'absolute'}) ),
    state('void', style({position:'absolute'}) ),
    state('*', style({position:'absolute'}) ),
    // transition('void => none', [
    //   style({transform: 'translateY(-100%)', zIndex: '10'}),
    //   animate('0.5s ease-in-out', style({transform: 'translateY(0)'}))
    // ]),
    // transition('none => *', [
    //   style({transform: 'translateY(0)', zIndex: '10'}),
    //   animate('0.5s ease-in-out', style({transform: 'translateY(100%)'}))
    // ]),
    // transition('void => none', [
    //   style({transform: 'translateY(-100%) scale(0.8)', zIndex: '10'}),
    //   animate('0.2s 0.5s ease-in-out', style({transform: 'translateY(0) scale(0.8)'}))
    // ]),
    // transition('none => *', [
    //   style({transform: 'translateY(0)', zIndex: '10'}),
    //   animate('0.5s ease-in-out', style({transform: 'translateY(100%)'}))
    // ]),
    // transition('void => *', [
    //   style({position:'absolute', transform: 'translateY(-100%)'}),
    //   animate('0.5s ease-in-out', style({transform: 'translateY(0)'})),
    // ]),
    // transition('* => void', [
    //   style({position:'absolute', transform: 'translateY(0)'}),
    //   animate('0.5s ease-in-out', style({transform: 'translateY(100%)'})),
    // ])
    transition('void => *', [
      style({opacity: '0'}),
      animate('0.5s 0.5s ease-in-out', style({opacity: '1'})),
    ]),
    transition('* => void', [
      style({opacity: '1'}),
      animate('0.5s ease-in-out', style({opacity: '0'})),
    ])
    // transition('void => *', [
    //   style({position:'absolute', transform: 'translateY(-100%)'}),
    //   animate('0.5s ease-in-out', style({transform: 'scale(0.8)'})),
    //   animate('0.5s ease-in-out', style({transform: 'translateY(0)'})),
    //   animate('0.5s ease-in-out', style({transform: 'scale(1)'})),
    // ]),
    // transition('* => void', [
    //   style({position:'absolute', transform: 'translateY(0)'}),
    //   animate('0.5s ease-in-out', style({transform: 'scale(0.8)'})),
    //   animate('0.5s ease-in-out', style({transform: 'translateY(100%)'})),
    //   animate('0.5s ease-in-out', style({transform: 'scale(1)'})),
    // ])
  ]);
}