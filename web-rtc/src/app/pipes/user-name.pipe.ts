import { Pipe, PipeTransform } from '@angular/core'
import { User } from '../services/user.service'
import {userName} from "./pipe-utils";

@Pipe({
    name: 'userName',
    standalone: true,
})
export class UserNamePipe implements PipeTransform {
    transform(user: User): string {
        return userName(user)
    }
}
