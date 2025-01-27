import {Component, EventEmitter, Output} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {NgIf} from '@angular/common';

@Component({
  selector: 'initModal',
  templateUrl: 'initModal.component.html',
  imports: [
    FormsModule,
    NgIf
  ],
  styleUrl: '../../app.component.css'
})
export class InitModalComponent {


  player1Name: string = "";
  player2Name: string = "";
  @Output() playerNameChange = new EventEmitter<{ player1: string; player2: string }>();

  versus: string = "player";
  iaDifficulty: string = "impossible";

  validatePlayerName() {
    if (this.versus == "player" && this.player1Name.trim() && this.player2Name.trim()) {
      this.playerNameChange.emit({player1: this.player1Name, player2: this.player2Name});
    } else if ((this.versus + this.iaDifficulty == "IAeasy"
        || this.versus + this.iaDifficulty == "IAmedium"
        || this.versus + this.iaDifficulty == "IAimpossible")
      && this.player1Name == "IAeasy"
      || this.player1Name == "IAmedium"
      || this.player1Name == "IAimpossible") {
      alert('Nom invalide');
    } else if ((this.versus + this.iaDifficulty == "IAeasy"
        || this.versus + this.iaDifficulty == "IAmedium"
        || this.versus + this.iaDifficulty == "IAimpossible")
      && this.player1Name.trim()) {
      this.playerNameChange.emit({player1: this.player1Name, player2: this.versus + this.iaDifficulty});
    } else {
      alert('Les noms des joueurs ne peuvent pas être vides.');
    }
  }
}
