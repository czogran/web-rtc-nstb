import { Pipe, PipeTransform } from '@angular/core'
import { ChatProfile } from '../services/chat.service'
import {User} from "../services/user.service";

@Pipe({
    name: 'chatName',
    standalone: true,
})
export class ChatNamePipe implements PipeTransform {
    transform(chatProfile: ChatProfile): string {
        return chatProfile.chatName || this.formUsersNames(chatProfile.users!)
    }

    formUsersNames(users: User[]): string {
        return users.reduce((previousValue, currentValue, currentIndex) => {
            if (currentIndex === 0) {
                return `${currentValue?.name || ''} ${
                    currentValue?.surname || ''
                }`
            }
            return `${previousValue}, ${currentValue?.name || ''} ${
                currentValue?.surname || ''
            }`
        }, '')
    }
}
