import {Component, OnInit, Input, HostListener} from "@angular/core";

@Component({
    moduleId: module.id,
    selector: 'loading',
    templateUrl: './loading.component.html',
})
export class LoadingComponent implements OnInit {

    @Input() action: string;
    @Input() set progress(progress: number) {
        this.progressTo = progress;
        this.progressToggle();
    }
    currentProgress: number = 0;
    progressTo: number = 0;
    colorInc = 100 / 3;
    timer;
    increment: number = 1;
    color: string = 'red';
    @Input() total: number = 0;

    image: string;

    constructor() {
    }

    @HostListener('document:keyup', ['$event'])
    handleKeyboardEvent(event: KeyboardEvent) {
        this.randomBgIndex();
    }

    ngOnInit(): void {
        this.randomBgIndex();
    }

    randomBgIndex() {
        let rand = Math.floor(Math.random() * 187) + 1;
        let str = "" + rand;
        let pad = "000";
        let imageId = pad.substring(0, pad.length - str.length) + str;

        this.image = 'assets/img/pixel-bg/pixel-background-'+imageId+'.gif';
    }

    progressToggle() {

        if (this.timer) {
            clearInterval(this.timer);
        }

        var range = this.progressTo - this.currentProgress;

        if (range == 0) {
            return false;
        }

        this.increment = this.progressTo > this.currentProgress ? 1 : -1;
        var stepTime = Math.abs(Math.floor(1000 / range));

        this.timer = setInterval(() => {

            this.currentProgress += this.increment;

            if((this.currentProgress * 100 / this.total) < this.colorInc * 1)
                this.color = 'red';
            else if((this.currentProgress * 100 / this.total) < this.colorInc * 2)
                this.color = 'orange';
            else
                this.color = 'green';

            if (this.currentProgress == this.progressTo) {
                clearInterval(this.timer);
            }
        }, stepTime);


    }
}