import { User } from '../services/user.service'

export function userName(user: User) {
    return user.nickname || `${user?.name || ''} ${user?.surname || ''}`.trim()
}
