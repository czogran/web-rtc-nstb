import { Pipe, PipeTransform } from '@angular/core'
import { ChatProfile } from '../services/chat.service'
import { User, UserService } from '../services/user.service'
import { userName } from './pipe-utils'

@Pipe({
    name: 'chatName',
    standalone: true,
})
export class ChatNamePipe implements PipeTransform {
    constructor(private userService: UserService) {}
    transform(chatProfile: ChatProfile): string {
        return (
            chatProfile.chatName ||
            this.formUsersNames(
                (chatProfile.users || []).filter(
                    (user) => user.idn !== this.userService.userIdn
                )
            )
        )
    }

    formUsersNames(users: User[]): string {
        return users.reduce((previousValue, currentValue, currentIndex) => {
            if (currentIndex === 0) {
                return userName(currentValue)
            }
            return `${previousValue}, ${userName(currentValue)}`
        }, '')
    }
}
