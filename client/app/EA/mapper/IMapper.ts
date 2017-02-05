import { Model } from '../model/Model';

export interface IMapper {
  modelRoot: any;
  flatModel: { key: string, obj: {} };

  parse(): any;

  allOfXmiType(type: string, from?: any): any;
}
