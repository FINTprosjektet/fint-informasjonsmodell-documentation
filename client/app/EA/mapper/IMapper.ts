import { Model } from '../model/Model';

export interface IMapper {
  generatedModel: any;
  flatModel: { key: string, obj: {} };

  parse(): any;

  allOfXmiType(type: string, from?: any): any;
}
