import { ModelService } from '../../EA/model.service';
import { Association } from '../../EA/model/Association';
import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-association',
  templateUrl: './association.component.html',
  styleUrls: ['./association.component.scss']
})
export class AssociationComponent implements OnInit {
  @Input() associations: Association[];

  constructor(private readModel: ModelService) { }

  ngOnInit() {
  }

}
