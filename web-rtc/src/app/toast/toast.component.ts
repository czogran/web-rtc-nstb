import { CommonModule } from '@angular/common'
import {
    AfterViewInit,
    Component,
    NgZone,
    OnDestroy,
    OnInit,
    TemplateRef,
} from '@angular/core'
import { Subject, tap } from 'rxjs'
import { DragAndDropComponent } from '../components/drag-and-drop/drag-and-drop.component'
import { ScreenSizeComponent } from '../components/screen-size/screen-size.component'
import { ToastVisibilityService } from './toast-visibility.service'

@Component({
    selector: 'app-toast',
    standalone: true,
    imports: [CommonModule, ScreenSizeComponent, DragAndDropComponent],
    templateUrl: './toast.component.html',
    styleUrls: ['./toast.component.scss'],
})
export class ToastComponent implements OnInit, OnDestroy, AfterViewInit {
    isToastVisible: boolean
    template: TemplateRef<any>

    isToastOpen: Subject<boolean> = new Subject<boolean>()
    toastTemplate: Subject<TemplateRef<any>> = new Subject<TemplateRef<any>>()
    private isMinimized: boolean = false

    constructor(
        public toastvisibilityService: ToastVisibilityService,
        private zone: NgZone
    ) {
        this.toastvisibilityService.isToastOpen
            .pipe(
                tap((body) => {
                    this.isToastVisible = body.isOpen
                    this.template = body.template
                    this.isToastOpen.next(body.isOpen)
                    this.toastTemplate.next(body.template)
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

    ngOnInit(): void {}

    openToast() {
        this.isToastVisible = true
    }

    toastVisible() {}

    ngOnDestroy(): void {}

    ngAfterViewInit(): void {}

    minimizeToast(isMinimized: boolean) {
        const element = document.getElementById('video')!
        element.style.width = isMinimized ? '20vw' : '75vw'
        element.style.height = isMinimized ? '20vh' : '75vh'
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
