import { CommonModule } from '@angular/common'
import {
    ChangeDetectionStrategy,
    Component,
    ElementRef,
    ViewChild,
    ViewEncapsulation,
} from '@angular/core'
import { map, merge, Observable, Subject } from 'rxjs'
import { ChatNamePipe } from '../../pipes/chat-name.pipe'
import { UserNamePipe } from '../../pipes/user-name.pipe'
import { ChatProfile, ChatService } from '../../services/chat.service'
import { LoginService } from '../../services/login.service'
import { SearchUsersService } from '../../services/search-users.service'
import { User, UserService } from '../../services/user.service'

@Component({
    selector: 'app-users-menu',
    standalone: true,
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [CommonModule, ChatNamePipe, UserNamePipe],
    templateUrl: './users-menu.component.html',
    styleUrls: ['./users-menu.component.scss'],
    host: { class: 'users-menu' },
    encapsulation: ViewEncapsulation.None,
})
export class UsersMenuComponent {
    @ViewChild('searchUsers')
    searchUsers: ElementRef

    usersObservable: Observable<User[]>

    availableChatProfilesObservable: Observable<ChatProfile[]>

    usersSubject: Subject<User[]> = new Subject<User[]>()

    constructor(
        public chatService: ChatService,
        public userService: UserService,
        private loginService: LoginService,
        private searchUsersService: SearchUsersService
    ) {
        this.availableChatProfilesObservable = this.chatService.getUserChats()
    }

    selectPeer(chatProfile: ChatProfile) {
        this.chatService.selectChat(chatProfile)
    }

    selectUser(user: User) {
        const chatProfile: ChatProfile = { users: [user] }
        this.chatService.selectChat(chatProfile)
    }

    logout() {
        this.loginService.logout()
    }

    onSearchUsers(event: Event) {
        const query = this.searchUsers.nativeElement.innerHTML
        this.usersObservable = merge(
            this.usersSubject,
            this.searchUsersService
                .searchUsers(query)
                .pipe(map((response) => response.users))
        )
        event.preventDefault()
    }

    clearSearchInput() {
        this.searchUsers.nativeElement.innerHTML = null
        this.usersSubject.next([])
    }
}
