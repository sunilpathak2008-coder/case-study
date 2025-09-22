import { Component, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-situation-descriptions',
  templateUrl: './situation-descriptions.component.html',
  styleUrls: ['./situation-descriptions.component.scss']
})
export class SituationDescriptionsComponent {
  @Input() form3!: FormGroup;
  @Input() isStepValid!: () => boolean;
  @Output() helpMeWrite = new EventEmitter<string>();

  openHelp(field: string) {
    this.helpMeWrite.emit(field);
  }
}
