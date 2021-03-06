import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  title = 'Curso de Angular com API REST';

  /* Precisamos do construtor recebendo o router */
  constructor(private router: Router) { }

  ngOnInit(): void {
    if (localStorage.getItem("token") == null) {
      this.router.navigate(['login']);
    }
  }

  public sair(): void {
    /* Para limpar o token */
    localStorage.clear();
    this.router.navigate(['login']);
  }

  public esconderBarra(): boolean {
    if (localStorage.getItem("token") !== null && localStorage.getItem("token").toString().trim() !== null) {
      return false;
    } else {
      return true;
    }
  }
}