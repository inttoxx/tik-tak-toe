import {Component} from '@angular/core';
import {NgForOf, NgIf} from '@angular/common';
import {InitModalComponent} from '../initModal/initModal.component';
import {Player} from '../../types/player';
import {ResultModalComponent} from '../resultModal/resultModal.component';

@Component({
  selector: 'game',
  imports: [NgForOf, InitModalComponent, NgIf, ResultModalComponent],
  templateUrl: 'game.component.html',
  styleUrl: '../../app.component.css'
})
export class GameComponent {

  player1: Player = {
    name: "",
    score: 0,
    symbole: "X"
  }
  player2: Player = {
    name: "",
    score: 0,
    symbole: "O"
  }
  showInitModal: boolean = true;
  showResultModal: boolean = false;
  aiInProgress: boolean = false;
  winner: string = "";
  boxIds: string[] = ["A1", "A2", "A3", "B1", "B2", "B3", "C1", "C2", "C3"]
  boxes: (string | undefined) [] = Array(9).fill(undefined);
  winningCombos: string[][] = [
    ["A1", "A2", "A3"],
    ["B1", "B2", "B3"],
    ["C1", "C2", "C3"],
    ["A1", "B1", "C1"],
    ["A2", "B2", "C2"],
    ["A3", "B3", "C3"],
    ["A1", "B2", "C3"],
    ["A3", "B2", "C1"],
  ];
  players: Player[] = [this.player1, this.player2];
  playerTurn: Player | null = null;

  selectFirstPlayer() {
    this.playerTurn = this.players[Math.floor(Math.random() * 2)];
    if (this.playerTurn.name === "IAeasy"
      || this.playerTurn.name === "IAmedium"
      || this.playerTurn.name === "IAimpossible") {
      this.selectIaToPlay()
    }
  }

  play(event: any, index: any) {
    if (this.playerTurn?.name === "IA" || this.showResultModal) {
      return;
    }
    if (!this.boxes[index]) {
      event.target.classList.add(this.playerTurn?.symbole);
      event.target.classList.add("allreadySelected");
      event.target.innerHTML = this.playerTurn?.symbole;
      this.boxes[index] = this.playerTurn?.symbole;
      this.checkVictory();
      if (!this.showResultModal) {
        this.nextTurn();
      }
    }
  }

  nextTurn() {
    if (this.playerTurn == this.players[0]) {
      this.playerTurn = this.players[1];
    } else {
      this.playerTurn = this.players[0];
    }
    console.log(`Prochain joueur : ${this.playerTurn?.name}`);

    this.selectIaToPlay()

  }

  selectIaToPlay() {
    if (this.playerTurn?.name === "IAeasy") {
      setTimeout(() => this.aiPlayEasy(), 500);
    }
    if (this.playerTurn?.name === "IAmedium") {
      setTimeout(() => this.aiPlayMedium(), 500);
    }
    if (this.playerTurn?.name === "IAimpossible") {
      setTimeout(() => this.aiPlayImossible(), 500);
    }
  }

  checkVictory(): void {
    for (let combo of this.winningCombos) {
      const [a, b, c] = combo
      const boxA: HTMLElement | null = document.getElementById(a);
      const boxB: HTMLElement | null = document.getElementById(b);
      const boxC: HTMLElement | null = document.getElementById(c);
      if (boxA?.innerHTML && boxA.innerHTML == boxB?.innerHTML && boxA.innerHTML == boxC?.innerHTML) {
        this.players.forEach(player => {
          {
            if (player.symbole === this.playerTurn?.symbole) {
              player.score++
            }
          }
        })
        this.winner = this.playerTurn?.name ?? 'Unknown';
        this.showResultModal = true
        return
      }
    }
    if (!this.boxes.includes(undefined)) {
      this.winner = "EGALITE"
      this.showResultModal = true
    }
  }

  reset(): void {
    const divBoxs = document.getElementsByClassName("box");
    this.showResultModal = false;
    for (let box of divBoxs) {
      box.innerHTML = "";
      box.classList.remove("X");
      box.classList.remove("O");
      box.classList.remove("allreadySelected");
      this.boxes = Array(9).fill(undefined);
    }
    this.selectFirstPlayer();
  }

  startGame(players: { player1: string; player2: string }): void {
    this.showInitModal = false
    this.player1.name = players.player1;
    this.player2.name = players.player2;
    this.selectFirstPlayer()
  }

  aiPlayImossible() {
    if (this.playerTurn?.name !== "IAimpossible" || this.showResultModal) {
      return;
    }
    this.aiInProgress = true;
    let bestScore = -Infinity;
    let bestMove: number | null = null;

    this.boxes.forEach((box, index) => {
      if (!box) {
        this.boxes[index] = this.player2.symbole;
        const score = this.minimax(this.boxes, 0, false);
        this.boxes[index] = undefined;

        if (score > bestScore) {
          bestScore = score;
          bestMove = index;
        }
      }
    });

    if (bestMove !== null) {
      const boxId = this.boxIds[bestMove];
      const boxElement = document.getElementById(boxId);

      if (boxElement) {
        this.boxes[bestMove] = this.playerTurn?.symbole;
        boxElement.innerHTML = this.playerTurn?.symbole ?? "O";
        boxElement.classList.add(this.playerTurn?.symbole ?? "O")
        boxElement.classList.add("allreadySelected");
        this.checkVictory();
        if (!this.showResultModal) {
          this.nextTurn();
        }
      }
    }
    this.aiInProgress = false;
  }

  aiPlayEasy() {
    if (this.showResultModal || this.playerTurn?.name !== "IAeasy") {
      return;
    }

    this.aiInProgress = true;

    const emptyIndexes = this.boxes
      .map((box, index) => (box === undefined ? index : null))
      .filter((index) => index !== null) as number[];

    if (emptyIndexes.length > 0) {
      const randomIndex = emptyIndexes[Math.floor(Math.random() * emptyIndexes.length)];
      const boxId = this.boxIds[randomIndex];
      const boxElement = document.getElementById(boxId);

      if (boxElement) {
        this.boxes[randomIndex] = this.playerTurn.symbole;
        boxElement.innerHTML = this.playerTurn.symbole;
        boxElement.classList.add(this.playerTurn.symbole);
        boxElement.classList.add("allreadySelected");
        this.checkVictory();

        if (!this.showResultModal) {
          this.nextTurn();
        }
      }
    }
    this.aiInProgress = false;

  }

  aiPlayMedium() {
    if (this.showResultModal || this.playerTurn?.name !== "IAmedium") {
      return;
    }
    this.aiInProgress = true;

    let moveMade = false;

    this.boxes.forEach((box, index) => {
      if (!box && !moveMade) {
        this.boxes[index] = this.playerTurn?.symbole;
        if (this.getWinner(this.boxes) === this.playerTurn?.symbole) {
          this.updateBoxElement(index);
          moveMade = true;
        } else {
          this.boxes[index] = undefined;
        }
      }
    });

    if (!moveMade) {
      this.boxes.forEach((box, index) => {
        if (!box && !moveMade) {
          this.boxes[index] = this.player1.symbole;
          if (this.getWinner(this.boxes) === this.player1.symbole) {
            this.boxes[index] = this.playerTurn?.symbole;
            this.updateBoxElement(index);
            moveMade = true;
          } else {
            this.boxes[index] = undefined;
          }
        }
      });
    }

    if (!moveMade) {
      const emptyIndexes = this.boxes
        .map((box, index) => (box === undefined ? index : null))
        .filter((index) => index !== null) as number[];

      if (emptyIndexes.length > 0) {
        const randomIndex = emptyIndexes[Math.floor(Math.random() * emptyIndexes.length)];
        this.boxes[randomIndex] = this.playerTurn.symbole;
        this.updateBoxElement(randomIndex);
        moveMade = true;
      }
    }

    if (moveMade) {
      this.checkVictory();

      if (!this.showResultModal) {
        this.nextTurn();
      }
    }

    this.aiInProgress = false;
  }

  updateBoxElement(index: number) {
    const boxId = this.boxIds[index];
    const boxElement = document.getElementById(boxId);

    if (boxElement) {
      boxElement.innerHTML = this.playerTurn?.symbole ?? "";
      boxElement.classList.add(this.playerTurn?.symbole ?? "");
      boxElement.classList.add("allreadySelected");
    }
  }


  minimax(newBoxes: (string | undefined)[], depth: number, isMaximizing: boolean): number {
    const winner = this.getWinner(newBoxes);
    if (winner === this.player2.symbole) return 10 - depth;
    if (winner === this.player1.symbole) return depth - 10;
    if (!newBoxes.includes(undefined)) return 0;

    if (isMaximizing) {
      let bestScore = -Infinity;
      newBoxes.forEach((box, index) => {
        if (!box) {
          newBoxes[index] = this.player2.symbole;
          const score = this.minimax(newBoxes, depth + 1, false);
          newBoxes[index] = undefined;
          bestScore = Math.max(score, bestScore);
        }
      });
      return bestScore;
    } else {
      let bestScore = Infinity;
      newBoxes.forEach((box, index) => {
        if (!box) {
          newBoxes[index] = this.player1.symbole;
          const score = this.minimax(newBoxes, depth + 1, true);
          newBoxes[index] = undefined;
          bestScore = Math.min(score, bestScore);
        }
      });
      return bestScore;
    }
  }

  getWinner(boxes: (string | undefined)[]): string | null {
    for (const combo of this.winningCombos) {
      const [a, b, c] = combo.map((id) => this.boxIds.indexOf(id));
      if (boxes[a] && boxes[a] === boxes[b] && boxes[a] === boxes[c]) {
        return boxes[a];
      }
    }
    return null;
  }

}
