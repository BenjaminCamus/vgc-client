import {trigger, state, animate, style, transition} from '@angular/core';

export function routerTransition() {
  return slideToBottom();
}
function slideToBottom() {
  return trigger('routerTransition', [
    state('none', style({position:'absolute'}) ),
    state('void', style({position:'absolute'}) ),
    state('*', style({position:'absolute'}) ),

    // transition('void => *', [
    //   style({opacity: '0'}),
    //   animate('0.5s 0.5s ease-in-out', style({opacity: '1'})),
    // ]),
    transition('* => void', [
      style({opacity: '1'}),
      animate('0.5s ease-in-out', style({opacity: '0'})),
    ]),

    transition('void => *', [
      style({position:'absolute', transform: 'translateY(-100%)', zIndex: 999}),
      animate('0.5s ease-in-out', style({transform: 'scale(0.95)'})),
      animate('0.5s ease-in-out', style({transform: 'translateY(0)'})),
      animate('0.5s ease-in-out', style({transform: 'scale(1)'})),
    ])
    // transition('* => void', [
    //   style({position:'absolute', transform: 'translateY(0)', zIndex:0}),
    //   animate('2s ease-in-out', style({transform: 'scale(0)'})),
    // ]),
  ]);
}