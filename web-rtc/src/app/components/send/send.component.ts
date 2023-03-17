import { CommonModule } from '@angular/common'
import { Component, OnInit, ViewEncapsulation } from '@angular/core'

@Component({
    selector: 'app-send',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './send.component.html',
    styleUrls: ['./send.component.scss'],
})
export class SendComponent implements OnInit {
    constructor() {}

    ngOnInit(): void {}
}
