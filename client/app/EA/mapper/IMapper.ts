import { Model } from '../model/Model';

export interface IMapper {
  modelRoot: any;
  flatModel: { [key: string]: any };

  parse(): any;

  allOfXmiType(type: string, from?: any): any;
}
