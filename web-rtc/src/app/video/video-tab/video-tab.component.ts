import { NgIf } from '@angular/common'
import { ChangeDetectionStrategy, Component, Input } from '@angular/core'
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
})
export class VideoTabComponent {
    @Input()
    stream: MediaStream = new MediaStream()

    @Input()
    muted: boolean = false
}
