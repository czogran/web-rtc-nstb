import {CommonModule} from '@angular/common'
import {ChangeDetectionStrategy, ChangeDetectorRef, Component, NgZone, OnDestroy, OnInit,} from '@angular/core'
import {filter, Subject, takeUntil, tap} from 'rxjs'
import {CameraComponent} from '../components/camera/camera.component'
import {DragAndDropComponent} from '../components/drag-and-drop/drag-and-drop.component'
import {MicrophoneComponent} from '../components/microphone/microphone.component'
import {ScreenSizeComponent} from '../components/screen-size/screen-size.component'
import {TelephoneComponent} from '../components/telephone/telephone.component'
import {MediaService} from '../services/media.service'
import {SignalingService, SignalType} from '../services/signaling.service'
import {VideoTabComponent} from './video-tab/video-tab.component'
import {VideoService} from './video.service'
import {ChatService} from "../services/chat.service";

@Component({
    selector: 'app-video',
    templateUrl: './video.component.html',
    styleUrls: ['./video.component.scss'],
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
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class VideoComponent implements OnInit, OnDestroy {
    isVideoTabVisible: Subject<boolean> = new Subject()

    private unsubscribe: Subject<void> = new Subject()

    constructor(
        private changeDetectorRef: ChangeDetectorRef,
        public videoService: VideoService,
        private zone: NgZone,
        public signalingService: SignalingService,
        public mediaService: MediaService,
        public chatService: ChatService
    ) {}

    ngOnInit() {
        this.signalingService.callStatusObservable
            .pipe(
                takeUntil(this.unsubscribe),
                filter((status) => status === SignalType.END)
            )
            .subscribe(() => {
                this.isVideoTabVisible.next(false)
                this.changeDetectorRef.detectChanges()
            })

        this.mediaService.localStreamSubject
            .pipe(takeUntil(this.unsubscribe))
            .subscribe((stream) => {
                setTimeout(() => {
                    this.changeDetectorRef.detectChanges()
                })
            })

        this.videoService.videoStateObservable
            .pipe(
                takeUntil(this.unsubscribe),
                tap(() => {
                    this.zone.run(() => {
                        this.isVideoTabVisible.next(true)
                    })

                    setTimeout(() => {
                        this.zone.runOutsideAngular(() => {
                            dragElement(
                                document.getElementById('video') as HTMLElement,
                                this.zone
                            )
                        })
                    })
                }),
                tap((reason) => {
                    if (reason === 'VIDEO') {
                        this.signalingService.createCall().then()
                    } else if (reason === 'AUDIO') {
                        this.signalingService.createCall(false).then()
                    }
                })
            )
            .subscribe()
    }

    endCall() {
        this.mediaService.closeStream()
        this.signalingService.endConnection()
        this.isVideoTabVisible.next(false)
    }

    minimizeVideo(isMinimized: boolean) {
        const element = document.getElementById('video')!
        element.style.width = isMinimized ? '20vw' : '75vw'
        element.style.height = isMinimized ? '20vh' : '75vh'
    }

    ngOnDestroy(): void {
        this.unsubscribe.next()
        this.unsubscribe.complete()
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
