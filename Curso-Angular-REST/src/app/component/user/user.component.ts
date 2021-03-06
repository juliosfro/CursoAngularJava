import { ErrorDetails } from './../../model/errorDetails';
import { UsuarioService } from './../../service/usuario.service';
import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/model/user';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit {

  pagina_atual = 1;
  total_pages;
  users_array: Array<User[]>;
  user = new User();
  resultsPerPage: Number;
  size_array: Number[] = [5, 10, 15, 20];
  size: Number = this.size_array[0];

  errorDetails = new ErrorDetails();

  constructor(private usuarioService: UsuarioService, private toastr: ToastrService) { }

  // Configuração da ordenação
  key: string = 'id';
  reverse: boolean = true;

  sort(key): void {
    this.key = (this.key !== key) ? key : this.key;
    this.reverse = (this.key !== key) ? true : !this.reverse;
    this.loadUserData(this.pagina_atual);
  }

  ngOnInit(): void {
    /* No front-end a primeira página é a número 1 e no banco de dados é a numero 0 */
    this.loadUserData(1);
    document.getElementById('nome').focus();
  }

  deleteUserById(id: Number, index: number): void {
    document.getElementById('nome').focus();
    (confirm('Deseja remover esse usuário?')) ?
      this.usuarioService.deleteUserById(id).subscribe(data => {
        data.status == 200 ? this.toastr.success("Usuário deletado com sucesso.") : null;
        this.users_array.splice(index, 1);
      }, error => {

      }) : null;
  }

  readUserByNamePageSort(): void {
    this.usuarioService.readUserByNamePageSort(this.user.nome, (this.pagina_atual - 1), this.reverse, this.key, this.size).subscribe(data => {
      this.users_array = data.content;
      this.resultsPerPage = data.totalElements;
      this.total_pages = data.totalPages;
      (this.pagina_atual > data.totalPages && this.pagina_atual !== 1) ? this.updateIndexPageUserByName() : null;
    });
  }

  readAllUsersPageSort(): void {
    this.usuarioService.readAllUsersPageSort(this.pagina_atual - 1, this.reverse, this.key, this.size).subscribe(data => {
      this.users_array = data.content;
      this.resultsPerPage = data.totalElements;
      this.total_pages = data.totalPages;
      (this.pagina_atual > data.totalPages && this.pagina_atual !== 1) ? this.updateIndexPageAllUsers() : null;
    }, error => {
      const errors = JSON.parse(error);
      this.errorDetails.error = errors.message;
      this.errorDetails.code = errors.code;
      this.toastr.warning(this.errorDetails.error.toString());
    });
  }

  updateIndexPageUserByName(): void {
    this.pagina_atual = 1;
    this.readUserByNamePageSort();
  }

  updateIndexPageAllUsers(): void {
    this.pagina_atual = 1;
    this.readAllUsersPageSort();
  }

  loadUserData(pagina: number): void {
    this.pagina_atual = pagina;
    document.getElementById('nome').focus();
    (this.user.nome !== undefined && this.user.nome.trim() !== "") ?
      this.readUserByNamePageSort() : this.readAllUsersPageSort();
  }

  imprimeRelatorio(): void {
    this.usuarioService.downloadPdfRelatorio().subscribe(data => {
      document.querySelector('iframe').src = data;
    });
  }

  limpaRelatorio(): void {
    document.querySelector('iframe').src = '';
  }
}