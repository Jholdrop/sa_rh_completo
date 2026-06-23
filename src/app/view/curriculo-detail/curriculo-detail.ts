import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Curriculo } from '../../model/curriculo.model';
import { CurriculoService } from '../../service/curriculo.service';

@Component({
  selector: 'app-curriculo-detail',
  imports: [RouterLink],
  templateUrl: './curriculo-detail.html',
  styleUrl: './curriculo-detail.scss',
})
export class CurriculoDetail implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly curriculoService = inject(CurriculoService);

  public curriculo: Curriculo | null = null;
  public carregando = true;
  public feedbackTexto = '';

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');

    if (id === null) {
      this.feedbackTexto = 'Curriculo nao encontrado.';
      this.carregando = false;
      return;
    }

    this.curriculoService.getCurriculoById(id).subscribe({
      next: (curriculo) => {
        this.curriculo = curriculo;
        this.carregando = false;
      },
      error: () => {
        this.feedbackTexto = 'Nao foi possivel carregar os detalhes do curriculo.';
        this.carregando = false;
      },
    });
  }

  excluirCurriculo(): void {
    if (this.curriculo?.id === undefined || this.curriculo.id === null) {
      return;
    }

    const confirmado = window.confirm(`Excluir o curriculo "${this.curriculo.titulo}"?`);
    if (!confirmado) {
      return;
    }

    this.curriculoService.deleteCurriculo(this.curriculo.id).subscribe({
      next: () => {
        window.alert('Curriculo excluido com sucesso.');
        this.router.navigateByUrl('/curriculos');
      },
      error: () => {
        this.feedbackTexto = 'Nao foi possivel excluir o curriculo.';
      },
    });
  }

  formatarLinkedin(linkedin: string): string {
    return linkedin.startsWith('http') ? linkedin : `https://${linkedin}`;
  }
}
