import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Curriculo, CurriculoId } from '../../model/curriculo.model';
import { CurriculoService } from '../../service/curriculo.service';

@Component({
  selector: 'app-curriculo-form',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './curriculo-form.html',
  styleUrl: './curriculo-form.scss',
})
export class CurriculoForm implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly curriculoService = inject(CurriculoService);
  private readonly usuarioLogadoId = 1;

  public curriculoId: CurriculoId | null = null;
  public carregando = false;
  public salvando = false;
  public feedbackTexto = '';
  public feedbackTipo: 'sucesso' | 'erro' = 'sucesso';

  public readonly curriculoForm = this.fb.nonNullable.group({
    usuarioId: [this.usuarioLogadoId, [Validators.required, Validators.min(1)]],
    titulo: ['', [Validators.required, Validators.minLength(3)]],
    formacao: ['', [Validators.required, Validators.minLength(5)]],
    experiencia: ['', [Validators.required, Validators.minLength(5)]],
    habilidades: ['', [Validators.required, Validators.minLength(3)]],
    linkedin: ['', [Validators.pattern(/^(https?:\/\/)?(www\.)?linkedin\.com\/.+$/)]],
    resumo: ['', [Validators.required, Validators.minLength(10)]],
    vagaId: [''],
  });

  public get modoEdicao(): boolean {
    return this.curriculoId !== null;
  }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');

    if (id !== null) {
      this.curriculoId = id;
      this.carregarCurriculo(id);
    }
  }

  carregarCurriculo(id: CurriculoId): void {
    this.carregando = true;
    this.curriculoService.getCurriculoById(id).subscribe({
      next: (curriculo) => {
        this.curriculoForm.patchValue({
          usuarioId: curriculo.usuarioId,
          titulo: curriculo.titulo,
          formacao: curriculo.formacao,
          experiencia: curriculo.experiencia,
          habilidades: curriculo.habilidades,
          linkedin: curriculo.linkedin,
          resumo: curriculo.resumo,
          vagaId: curriculo.vagaId ? String(curriculo.vagaId) : '',
        });
        this.carregando = false;
      },
      error: () => {
        this.exibirFeedback('Nao foi possivel carregar este curriculo.', 'erro');
        this.carregando = false;
      },
    });
  }

  salvarCurriculo(): void {
    if (this.curriculoForm.invalid) {
      this.curriculoForm.markAllAsTouched();
      this.exibirFeedback('Revise os campos obrigatorios antes de salvar.', 'erro');
      return;
    }

    const dados = this.curriculoForm.getRawValue();
    const curriculo: Curriculo = {
      id: this.curriculoId ?? undefined,
      usuarioId: Number(dados.usuarioId),
      titulo: dados.titulo.trim(),
      formacao: dados.formacao.trim(),
      experiencia: dados.experiencia.trim(),
      habilidades: dados.habilidades.trim(),
      linkedin: dados.linkedin.trim(),
      resumo: dados.resumo.trim(),
      vagaId: dados.vagaId.trim() || undefined,
    };

    this.salvando = true;
    const requisicao = this.modoEdicao
      ? this.curriculoService.putCurriculo(curriculo)
      : this.curriculoService.postCurriculo(curriculo);

    requisicao.subscribe({
      next: () => {
        const mensagem = this.modoEdicao
          ? 'Curriculo atualizado com sucesso.'
          : 'Curriculo cadastrado com sucesso.';

        this.exibirFeedback(mensagem, 'sucesso');
        window.alert(mensagem);
        this.salvando = false;
        this.router.navigateByUrl('/meu-curriculo');
      },
      error: () => {
        this.exibirFeedback('Nao foi possivel salvar o curriculo.', 'erro');
        this.salvando = false;
      },
    });
  }

  campoInvalido(nomeCampo: string): boolean {
    const controle = this.curriculoForm.get(nomeCampo);
    return !!controle && controle.invalid && (controle.dirty || controle.touched);
  }

  private exibirFeedback(texto: string, tipo: 'sucesso' | 'erro'): void {
    this.feedbackTexto = texto;
    this.feedbackTipo = tipo;
  }
}
