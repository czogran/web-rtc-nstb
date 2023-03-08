import { AsyncPipe, NgIf } from '@angular/common'
import {
    Component,
    TemplateRef,
    ViewChild,
    ViewEncapsulation,
} from '@angular/core'
import { ActivatedRoute, Router } from '@angular/router'
import { CameraComponent } from '../../components/camera/camera.component'
import { TelephoneComponent } from '../../components/telephone/telephone.component'
import { ChatNamePipe } from '../../pipes/chat-name.pipe'
import { ChatService } from '../../services/chat.service'
import { ToastVisibilityService } from '../../toast/toast-visibility.service'
import { VideoTabComponent } from '../../video/video-tab/video-tab.component'
import { VideoService } from '../../video/video.service'

@Component({
    selector: 'app-dashboard-header',
    standalone: true,
    templateUrl: './dashboard-header.component.html',
    imports: [
        CameraComponent,
        TelephoneComponent,
        VideoTabComponent,
        NgIf,
        AsyncPipe,
        ChatNamePipe,
    ],
    styleUrls: ['./dashboard-header.component.scss'],
    host: { class: 'dashboard-header' },
    encapsulation: ViewEncapsulation.None,
})
export class DashboardHeaderComponent {
    @ViewChild('videoTemplate')
    videoTemplate: TemplateRef<any>

    constructor(
        private router: Router,
        private route: ActivatedRoute,
        private toastvisibilityService: ToastVisibilityService,
        public chatService: ChatService,
        private videoService: VideoService
    ) {}

    startVideoCall() {
        console.log('startVideoCall')
        this.videoService.startVideoCall()
        // this.toastvisibilityService.openToast(this.videoTemplate)
        // this.router.navigate(['video'], { relativeTo: this.route.parent })
    }
}
