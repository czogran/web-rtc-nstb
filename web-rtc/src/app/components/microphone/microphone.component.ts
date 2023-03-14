import { NgClass } from '@angular/common'
import { Component, Input } from '@angular/core'

@Component({
    selector: 'app-microphone',
    standalone: true,
    templateUrl: './microphone.component.html',
    styleUrls: ['./microphone.component.scss'],
    host: { class: 'microphone' },
    imports: [NgClass],
})
export class MicrophoneComponent {
    @Input()
    active: boolean
}
