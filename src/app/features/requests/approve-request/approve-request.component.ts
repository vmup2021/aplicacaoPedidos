import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AccessRequestService } from '../../../core/services/access-request.service';
import { AccessRequest } from '../../../core/models/access-request.model';
import { RequestState } from '../../../core/models/enums';
import { StateBadgeComponent } from '../../../shared/components/state-badge/state-badge.component';

@Component({
  selector: 'app-approve-request',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, StateBadgeComponent],
  templateUrl: './approve-request.component.html',
  styleUrl: './approve-request.component.scss',
})
export class ApproveRequestComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly requestsService = inject(AccessRequestService);

  readonly loading = signal(true);
  readonly submitting = signal(false);
  readonly errorMessage = signal<string | null>(null);
  readonly request = signal<AccessRequest | null>(null);
  readonly RequestState = RequestState;

  readonly form = this.fb.group({
    decisao: [null as RequestState.APROVADO | RequestState.REJEITADO | null, [Validators.required]],
    justificativaDecisao: ['', [Validators.required, Validators.minLength(10)]],
  });

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.requestsService.getById(id).subscribe({
      next: (req) => {
        this.request.set(req);
        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });
  }

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const req = this.request();
    if (!req) return;

    this.submitting.set(true);
    this.errorMessage.set(null);

    const { decisao, justificativaDecisao } = this.form.getRawValue();
    this.requestsService.decide(req.id, { decisao: decisao!, justificativaDecisao: justificativaDecisao! }).subscribe({
      next: () => {
        this.submitting.set(false);
        this.router.navigate(['/pedidos-pendentes']);
      },
      error: (err) => {
        this.submitting.set(false);
        this.errorMessage.set(err?.error?.message ?? 'Não foi possível guardar a decisão.');
      },
    });
  }

  cancel(): void {
    this.router.navigate(['/pedidos-pendentes']);
  }
}
