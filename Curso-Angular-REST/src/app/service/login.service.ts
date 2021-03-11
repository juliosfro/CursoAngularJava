import { AppConstants } from './../app-constants';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  constructor(private http: HttpClient, private router: Router) { }

  login(usuario) {
    return this.http.post(AppConstants.baseLogin.toString(), JSON.stringify(usuario))
      .subscribe(data => {
        /* Retorno HTTP */
        var token = JSON.parse(JSON.stringify(data)).Authorization.split(' ')[1];

        /* Vamos esconder o token no front-end */
        localStorage.setItem("token", token);

        /* Para recuperar o token para ver se esta funcionando */
        // console.info("token: " + localStorage.getItem("token"));
        this.router.navigate(['home']);

      }, error => {
        console.error("Erro ao fazer login");
        alert("Acesso Negado");
      });
  }
} 