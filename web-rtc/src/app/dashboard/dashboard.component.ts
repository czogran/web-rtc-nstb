import { CommonModule } from '@angular/common'
import {
    ChangeDetectionStrategy,
    Component,
    ViewEncapsulation,
} from '@angular/core'
import { SignalingService } from '../services/signaling.service'
import { VideoComponent } from '../video/video.component'
import { ChatInputComponent } from './chat-input/chat-input.component'
import { ChatComponent } from './chat/chat.component'
import { DashboardHeaderComponent } from './dashboard-header/dashboard-header.component'
import { UsersMenuComponent } from './users-menu/users-menu.component'

@Component({
    selector: 'app-dashboard',
    standalone: true,
    imports: [
        CommonModule,
        ChatComponent,
        ChatInputComponent,
        DashboardHeaderComponent,
        UsersMenuComponent,
        VideoComponent,
    ],
    providers: [SignalingService],
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.scss'],
    host: { class: 'dashboard' },
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardComponent {}
