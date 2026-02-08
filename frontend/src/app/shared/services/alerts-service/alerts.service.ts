import { inject, Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { map, Observable } from 'rxjs';
import {
  ConfirmationDialogComponent,
  ConfirmDialogData,
} from '../../components/alerts/confirmation-dialog/confirmation-dialog.component';

@Injectable({ providedIn: 'root' })
export class AlertsService {
  private dialog = inject(MatDialog);

  confirm(data: ConfirmDialogData): Observable<boolean> {
    return this.dialog
      .open(ConfirmationDialogComponent, {
        data,
      })
      .afterClosed()
      .pipe(map((value: boolean) => value));
  }
}
