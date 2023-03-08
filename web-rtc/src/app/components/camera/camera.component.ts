import { CommonModule } from '@angular/common'
import { Component, Input, OnInit } from '@angular/core'

@Component({
    selector: 'app-camera',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './camera.component.html',
    styleUrls: ['./camera.component.scss'],
})
export class CameraComponent implements OnInit {
    @Input()
    active: boolean

    constructor() {}

    ngOnInit(): void {}
}
