import { Component, Input, OnInit } from '@angular/core'
import {NgClass} from "@angular/common";

@Component({
    selector: 'app-microphone',
    standalone: true,
    templateUrl: './microphone.component.html',
    styleUrls: ['./microphone.component.scss'],
    host: {class: 'microphone'},
    imports: [
        NgClass
    ]
})
export class MicrophoneComponent implements OnInit {
    @Input()
    active: boolean
    constructor() {}

    ngOnInit(): void {}
}
