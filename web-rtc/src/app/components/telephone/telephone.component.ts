import { CommonModule } from '@angular/common'
import { Component, Input, OnInit } from '@angular/core'

@Component({
    selector: 'app-telephone',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './telephone.component.html',
    styleUrls: ['./telephone.component.scss'],
})
export class TelephoneComponent implements OnInit {
    @Input()
    active: boolean
    constructor() {}

    ngOnInit(): void {}
}
