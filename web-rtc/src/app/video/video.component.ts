import {CommonModule} from '@angular/common'
import {
    ChangeDetectionStrategy,
    Component,
    NgZone,
    TemplateRef,
} from '@angular/core'
import {Subject, tap} from 'rxjs'
import {CameraComponent} from '../components/camera/camera.component'
import {DragAndDropComponent} from '../components/drag-and-drop/drag-and-drop.component'
import {MicrophoneComponent} from '../components/microphone/microphone.component'
import {ScreenSizeComponent} from '../components/screen-size/screen-size.component'
import {TelephoneComponent} from '../components/telephone/telephone.component'
import {MediaService} from '../services/media.service'
import {SignalingService} from '../services/signaling.service'
import {VideoTabComponent} from './video-tab/video-tab.component'
import {VideoService} from './video.service'

@Component({
    selector: 'app-video',
    templateUrl: './video.component.html',
    styleUrls: ['./video.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [
        CommonModule,
        TelephoneComponent,
        CameraComponent,
        MicrophoneComponent,
        VideoTabComponent,
        DragAndDropComponent,
        ScreenSizeComponent,
    ],
    standalone: true,
})
export class VideoComponent {
    isToastVisible: Subject<boolean> = new Subject()
    template: TemplateRef<any>

    toastTemplate: Subject<TemplateRef<any>> = new Subject<TemplateRef<any>>()
    private isMinimized: boolean = false

    constructor(
        public videoService: VideoService,
        private zone: NgZone,
        private signalingService: SignalingService,
        public mediaService: MediaService
    ) {
        this.videoService.videoState
            .pipe(
                tap((body) => {
                    console.log('aaaaaaaaaaaaaaa')
                    this.signalingService.createCall().then()
                    this.isToastVisible.next(true)
                    setTimeout(() => {
                        this.zone.runOutsideAngular(() => {
                            // const element = document.getElementById('video')!
                            // element.style.top = '15vw'
                            // element.style.left = '15vw'

                            dragElement(
                                document.getElementById('video') as HTMLElement,
                                this.zone
                            )
                        })
                    })
                })
            )
            .subscribe()
    }

    ngOnInit(): void {
    }

    minimizeToast(isMinimized: boolean) {
        const element = document.getElementById('video')!
        element.style.width = isMinimized ? '20vw' : '75vw'
        element.style.height = isMinimized ? '20vh' : '75vh'
    }

    endCall() {
        this.mediaService.closeStream()
        this.signalingService.endConnection()
        this.isToastVisible.next(false)
    }
}

function dragElement(element: HTMLElement, zone: NgZone) {
    const dragAndDropIcon = document.getElementById('dragAndDropIcon')!
    dragAndDropIcon.onmousedown = dragMouseDown

    const dragAndDropRelativeX =
        dragAndDropIcon.offsetLeft -
        element.offsetLeft +
        dragAndDropIcon.offsetWidth * 0.5
    const dragAndDropRelativeY =
        dragAndDropIcon.offsetTop -
        element.offsetTop +
        dragAndDropIcon.offsetHeight * 0.5

    let screenWidth: number, screenHeight: number

    const observer = new ResizeObserver((events) =>
        zone.run(() => {
            screenWidth = document.documentElement.clientWidth
            screenHeight = document.documentElement.clientHeight

            element.style.left =
                Math.min(
                    element.offsetLeft,
                    screenWidth - element.offsetWidth
                ) + 'px'
            element.style.top =
                Math.min(
                    element.offsetTop,
                    screenHeight - element.offsetHeight
                ) + 'px'
        })
    )

    observer.observe(document.documentElement)

    function dragMouseDown(event: any) {
        event.preventDefault()

        document.onmouseup = closeDragElement
        document.onmousemove = elementDrag
    }

    function elementDrag(event: any) {
        event.preventDefault()

        element.style.left =
            Math.min(
                Math.max(0, event.clientX - dragAndDropRelativeX),
                screenWidth - element.offsetWidth
            ) + 'px'
        element.style.top =
            Math.min(
                Math.max(0, event.clientY - dragAndDropRelativeY),
                screenHeight - element.offsetHeight
            ) + 'px'
    }

    function closeDragElement() {
        document.onmouseup = null
        document.onmousemove = null
    }
}
