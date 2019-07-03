import { Component, Input, OnChanges, OnInit } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Component({
  selector: 'app-html-cell',
  styleUrls: ['./htmlCell.component.scss'],
  template: `
    <div class="html-cell" [innerHTML]="sanitizedValue"></div>
  `,
})
export class HtmlCellComponent implements OnInit, OnChanges {
  @Input() value: string;
  sanitizedValue: SafeHtml;

  constructor(private sanitizer: DomSanitizer) {}

  ngOnInit(): any {
    this.ngOnChanges();
  }

  ngOnChanges(): any {
    this.sanitizedValue = this.sanitizer.bypassSecurityTrustHtml(this.value);
  }
}
