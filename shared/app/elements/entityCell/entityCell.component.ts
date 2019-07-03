import { Component, Input, OnInit } from '@angular/core';
import { AppBridgeService } from '../../services';

@Component({
  selector: 'app-entity-cell',
  styleUrls: ['./entityCell.component.scss'],
  template: `
    <div class="entity-cell" *ngIf="entityType && entityId && label">
      <button *ngIf="showPreview" theme="icon" icon="preview"
              tooltip="Preview" tooltipPosition="right"
              (click)="onPreview()"></button>
      <i class="bhi-circle {{theme}}" theme="entity"></i>
      <a (click)="onClick(entityId)">{{ label }}</a>
    </div>
  `,
})
export class EntityCellComponent implements OnInit {
  @Input() entityType: string = new Input();
  @Input() entityId: number = new Input();
  @Input() label: string = new Input();
  @Input() showPreview: boolean = new Input();
  theme: string;

  constructor(private appBridgeService: AppBridgeService) {}

  ngOnInit(): void {
    if (typeof this.entityType === 'string') {
      this.theme = this.entityType === 'JobOrder' ? 'job' : this.entityType.toLowerCase();
    }
  }

  onClick(id: number) {
    this.appBridgeService.execute(bridge => bridge.open({ entityId: `${id}`, entityType: this.entityType, type: 'record' }));
  }

  onPreview() {
    this.appBridgeService.execute(bridge => bridge.open({
      entityType: this.entityType, type: 'preview', data: {
        id: this.entityId,
        title: this.label,
        cellData: { id: this.entityId, name: this.label },
      }
    }));
  }
}
