import { NgIf } from '@angular/common'
import {
    ChangeDetectionStrategy,
    Component,
    EventEmitter,
    Input,
    OnInit,
    Output,
    ViewEncapsulation,
} from '@angular/core'
import { CameraComponent } from '../../components/camera/camera.component'
import { MicrophoneComponent } from '../../components/microphone/microphone.component'
import { TelephoneComponent } from '../../components/telephone/telephone.component'

@Component({
    selector: 'app-video-tab',
    standalone: true,
    templateUrl: './video-tab.component.html',
    styleUrls: ['./video-tab.component.scss'],
    imports: [TelephoneComponent, MicrophoneComponent, CameraComponent, NgIf],
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None,
    host: { class: 'video-tab' },
})
export class VideoTabComponent implements OnInit {
    @Input()
    stream: MediaStream = new MediaStream()

    @Input()
    displayControlIcons: boolean = true

    @Output()
    endCall: EventEmitter<boolean> = new EventEmitter<boolean>()

    microphoneActive: boolean = true
    cameraActive: boolean = true

    constructor() {}

    ngOnInit(): void {}

    microphoneClick() {
        this.microphoneActive = !this.microphoneActive
        this.stream.getAudioTracks()[0].enabled = this.microphoneActive
    }

    cameraClick() {
        this.cameraActive = !this.cameraActive
        this.stream.getVideoTracks()[0].enabled = this.microphoneActive
    }

    telephoneClick() {
        this.endCall.emit(true)
    }
}
