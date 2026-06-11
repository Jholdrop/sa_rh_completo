import { Component } from '@angular/core';
import { Vaga } from '../../model/vaga.model';
import { Api } from '../../service/api';

@Component({
  selector: 'app-painel-vagas',
  imports: [],
  templateUrl: './painel-vagas.html',
  styleUrl: './painel-vagas.scss',
})
export class PainelVagas {
  //terminar de fazer o crud

  public vaga: Vaga = new Vaga(0, '', '', '', 0) // interpolação de dados do formulário
  //limpar dados do formulário

  public vagas: Vaga[] = []; // vetor para armazenar as vagas

  constructor(private _apiService: Api) {} // estabelece conexão com a API

  ngOnInit(): void {
    this.listarVagas();
  }

  //método para listar as vagas (controller)
  listarVagas(): void {
    this._apiService.getVagas().subscribe((retornaVagas) => {
      this.vagas = retornaVagas.map((e) => {
        return new Vaga(e.id, e.nome, e.foto, e.descricao, e.salario);
      }); // armazena o conteúdo retornado da API no vetor vagas
    });
  }

  //cadastrar
  cadastrarVaga(): void {
    this._apiService.cadastrarVaga(this.vaga).subscribe(() => {
      this.listarVagas();
      this.vaga = new Vaga(0, '', '', '', 0); // limpa os dados do formulário
    });
  }

  //atualizar
  updateVaga(): void {
    this._apiService.atualizarVaga(this.vaga.id,this.vaga).subscribe(() => {
      this.listarVagas();
      this.vaga = new Vaga(0, '', '', '', 0); // limpa os dados do formulário
    });
  }

  //deletar
  deletarVaga(id: number): void {
    this._apiService.removerVaga(id).subscribe(() => {
      this.listarVagas();
    });
  }
}
