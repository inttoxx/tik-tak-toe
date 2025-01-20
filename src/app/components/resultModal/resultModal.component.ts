import {Component, EventEmitter, Input, Output} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {Player} from '../../types/player';
import {NgIf} from '@angular/common';

@Component({
  selector: 'resultModal',
  templateUrl: 'resultModal.component.html',
  imports: [
    FormsModule,
    NgIf
  ],
  styleUrl: '../../app.component.css'
})
export class ResultModalComponent {

  @Input() winner: string = ""
  @Input() player1: Player | undefined = undefined
  @Input() player2: Player | undefined = undefined

  @Output() reset: EventEmitter<any> = new EventEmitter<any>();

  resetGrid(): void {
    this.reset.emit()
  }
}
