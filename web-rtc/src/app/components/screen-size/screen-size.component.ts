import {
    ChangeDetectionStrategy,
    Component,
    EventEmitter,
    Input,
    OnInit,
    Output,
} from '@angular/core'
import {NgClass} from "@angular/common";

@Component({
    selector: 'app-screen-size',
    standalone: true,
    templateUrl: './screen-size.component.html',
    styleUrls: ['./screen-size.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [
        NgClass
    ]
})
export class ScreenSizeComponent implements OnInit {
    @Input()
    isMinimized: boolean = false

    @Output()
    isMinimizedChange: EventEmitter<boolean> = new EventEmitter<boolean>()

    constructor() {}

    ngOnInit(): void {}

    onClick() {
        this.isMinimized = !this.isMinimized
        this.isMinimizedChange.emit(this.isMinimized)
    }
}
