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
