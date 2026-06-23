import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Curriculo } from '../../model/curriculo.model';
import { CurriculoService } from '../../service/curriculo.service';

@Component({
  selector: 'app-curriculo-list',
  imports: [RouterLink],
  templateUrl: './curriculo-list.html',
  styleUrl: './curriculo-list.scss',
})
export class CurriculoList implements OnInit {
  private readonly curriculoService = inject(CurriculoService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly usuarioLogadoId = 1;

  public curriculos: Curriculo[] = [];
  public carregando = false;
  public feedbackTexto = '';
  public feedbackTipo: 'sucesso' | 'erro' = 'sucesso';
  public modoAdmin = false;
  public vagaIdFiltro: string | null = null;

  public get tituloPagina(): string {
    if (this.vagaIdFiltro) {
      return `Curriculos da vaga #${this.vagaIdFiltro}`;
    }

    return this.modoAdmin ? 'Curriculos cadastrados' : 'Meu curriculo';
  }

  public get subtituloPagina(): string {
    return this.modoAdmin ? 'ADM simulado' : `Usuario simulado #${this.usuarioLogadoId}`;
  }

  ngOnInit(): void {
    this.vagaIdFiltro = this.route.snapshot.paramMap.get('vagaId');
    this.modoAdmin = this.router.url.startsWith('/curriculos');
    this.carregarCurriculos();
  }

  carregarCurriculos(): void {
    this.carregando = true;
    this.feedbackTexto = '';

    const requisicao = this.vagaIdFiltro
      ? this.curriculoService.getCurriculosByVagaId(this.vagaIdFiltro)
      : this.modoAdmin
      ? this.curriculoService.getTodosCurriculos()
      : this.curriculoService.getCurriculoByUsuarioId(this.usuarioLogadoId);

    requisicao.subscribe({
      next: (curriculos) => {
        this.curriculos = curriculos;
        this.carregando = false;
      },
      error: () => {
        this.exibirFeedback('Nao foi possivel carregar os curriculos.', 'erro');
        this.carregando = false;
      },
    });
  }

  excluirCurriculo(curriculo: Curriculo): void {
    if (curriculo.id === undefined || curriculo.id === null) {
      this.exibirFeedback('Curriculo sem id para exclusao.', 'erro');
      return;
    }

    const confirmado = window.confirm(`Excluir o curriculo "${curriculo.titulo}"?`);
    if (!confirmado) {
      return;
    }

    this.curriculoService.deleteCurriculo(curriculo.id).subscribe({
      next: () => {
        this.exibirFeedback('Curriculo excluido com sucesso.', 'sucesso');
        this.carregarCurriculos();
      },
      error: () => this.exibirFeedback('Nao foi possivel excluir o curriculo.', 'erro'),
    });
  }

  formatarLinkedin(linkedin: string): string {
    if (!linkedin) {
      return '#';
    }

    return linkedin.startsWith('http') ? linkedin : `https://${linkedin}`;
  }

  private exibirFeedback(texto: string, tipo: 'sucesso' | 'erro'): void {
    this.feedbackTexto = texto;
    this.feedbackTipo = tipo;
  }
}
