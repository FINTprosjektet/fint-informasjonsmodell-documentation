import { Attribute } from '../model/Attribute';
import { Association } from '../model/Association';
import { Generalization } from '../model/Generalization';
import { Classification } from '../model/Classification';
import { Comment } from '../model/Comment';
import { Model } from '../model/Model';
import { Stereotype } from '../model/Stereotype';
import { Package } from '../model/Package';
import { EABaseClass } from '../model/EABaseClass';
import { IMapper } from './IMapper';
import * as merge from 'lodash/merge';

export class JSON_XMI21_Mapper implements IMapper {
  json: {};
  generatedModel: any;
  flatModel: { key: string, obj: {} } = <{ key: string, obj: {} }>{};
  refTypes: string[] = ['reference', 'start', 'end', 'general', 'association', 'subject', 'modelElement', 'package', 'package2'];

  constructor(modelData: {}) {
    this.json = JSON.parse(JSON.stringify(modelData)); // Clean copy
  }

  public parse(): Model {
    this.generatedModel = this.walkTree(this.json['xmi:XMI'], null);
    this.secondWalk(); // In order to add return references
    return this.generatedModel;
  }

  public checkType(node): string {
    return (node['$'] ? node['$']['xmi:type'] : null);
  }

  public allOfXmiType(type: string, from?: any) {
    let results: any[] = [];
    Object.keys(this.flatModel).forEach(key => {
      const model = this.flatModel[key];
      if (model.xmiType == type) {
        results.push(model);
      }
    });
    if (from) {
      results = results.filter(n => {
        let parent = n.parent;
        while (parent) {
          if (parent === from) { return true; }
          parent = parent.parent;
        }
        return false;
      });
    }

    return results;
  }

  /**
   * Adds a `get`ter property to any node
   */
  private addGetter(node: any, prop: string, ref: string) {
    Object.defineProperty(node, prop, { get: () => this.flatModel[ref] });
  }

  /**
   * Add extra properties and functions recursivelly to existing data structure
   */
  private walkTree(node: any, parent: any): any {
    if (Array.isArray(node)) {
      return node.forEach(n => this.walkTree(n, parent));
    }
    if (node['uml:Model']) {
      node['uml:Model'].forEach(model => this.walkTree(model, node));
    }
    if (node['$']) { // XML Attributes are mapped to `$`
      merge(node, node['$']);
      delete node['$'];
      if (node['xmi:id']) { node.xmiId = node['xmi:id']; delete node['xmi:id']; }
      if (node['xmi:type']) { node.xmiType = node['xmi:type']; delete node['xmi:type']; }
      if (Object.keys(node).length > 1) {
        node.parent = parent;
      }
    }

    // Merge in duplicates with different pieces of the data
    if (node.xmiId && this.flatModel[node.xmiId] != null) {
      const oldModel = this.flatModel[node.xmiId];
      if (oldModel != node) {
        merge(oldModel, node);
        node = oldModel;
      }
    }

    // Setup reference getters
    if (node['xmi:idref']) {
      this.addGetter(node, 'reference', node['xmi:idref']);
      if (!node.xmiId) {
        const host = this.flatModel[node['xmi:idref']];
        if (host && (host.xmiType === node.xmiType || host.name === node.name)) {
          host.extension = node; // Just to keep a clean copy if it all
        }
      }
    }
    this.refTypes.forEach(key => {
      if (node[key]) { this.addGetter(node, `${key}Ref`, node[key]); }
    });

    // Walk children
    Object.keys(node).forEach(key => {
      if (Array.isArray(node[key])) {
        node[key].forEach(elm => this.walkTree(elm, node));
      }
    });

    // Add type specific properties for rendering
    switch (node.xmiType) {
      // Primitives
      case Model.umlId: Object.setPrototypeOf(node, new Model()); break;
      case Package.umlId: Object.setPrototypeOf(node, new Package()); break;
      case Classification.umlId: Object.setPrototypeOf(node, new Classification()); break;
      case 'uml:Enumeration': Object.setPrototypeOf(node, new Classification()); break;
      case 'uml:DataType': Object.setPrototypeOf(node, new Classification()); break;

      // Relations
      case Generalization.umlId: Object.setPrototypeOf(node, new Generalization()); break;
      case Association.umlId: Object.setPrototypeOf(node, new Association()); break;

      //
      case Attribute.umlId: Object.setPrototypeOf(node, new Attribute()); break;

      // Types
      case 'uml:LiteralUnlimitedNatural':
      case 'uml:LiteralInteger': node.value = node['value']; break;
      case 'uml:PrimitiveType': node.href = node['href']; break;
      case 'uml:EnumerationLiteral': break;

      //
      case 'uml:Comment': Object.setPrototypeOf(node, new Comment()); break;
      case 'uml:Note': Object.setPrototypeOf(node, new Comment()); break;
      case 'uml:Text': Object.setPrototypeOf(node, new Comment()); break;
      //
      case 'uml:Extension': break;
      case 'uml:PackageImport': break;
      case 'uml:Boundary': break;
      case 'uml:Stereotype': break;
    }

    if (!node.id && node.xmiId) {
      node.id = node.xmiId;
    }

    if (node.xmiId && this.flatModel[node.xmiId] == null) {
      this.flatModel[node.xmiId] = node;
    }
    return node;
  }

  private secondWalk() {
    Object.keys(this.flatModel).forEach(key => {
      const model = this.flatModel[key];
      function addRefBy(prop: string) {
        if (model[prop] && typeof model[prop] !== 'string') {
          if (!model[prop].referredBy) { model[prop].referredBy = []; }
          model[prop].referredBy.push(model);
        }
      }
      this.refTypes.forEach(prop => { addRefBy(prop); addRefBy(`${prop}Ref`); });
    });
  }
}
