import { EventTarget } from '@angular/platform-browser/src/facade/browser';
import { EABaseClass } from './EABaseClass';
import { Classification } from './Classification';
import * as D3 from 'app/d3.bundle';

export abstract class EALinkBase extends EABaseClass {
  constructor() {
    super();
  }

  calculatePathTo(source: Classification, target: Classification): [number, number][] {
    const pathArr: [number, number][] = [];
    if (source.boxElement && target.boxElement) { // If these references does not contain rendered elements, just return empty array.
      const sMatrix = EABaseClass.createMatrix(source.boxElement);
      const tMatrix = EABaseClass.createMatrix(target.boxElement);

      let endX = 'center'; // Calculate left/right/center (should mostly be center)
      if (tMatrix.mid.center.x < sMatrix.mid.left.x) { endX = 'right'; }
      if (tMatrix.mid.center.x > sMatrix.mid.right.x) { endX = 'left'; }
      if ((tMatrix.mid.left.x >= sMatrix.mid.left.x && tMatrix.mid.right.x <= sMatrix.mid.right.x)
        || (sMatrix.mid.left.x >= tMatrix.mid.left.x && sMatrix.mid.right.x <= tMatrix.mid.right.x)
        || (tMatrix.mid.center.x === sMatrix.mid.center.x)) {
        endX = 'center';
      }

      let endY; // Calculate top/bottom/middle (should never be middle)
      if (tMatrix.mid.center.y > sMatrix.bot.center.y) { endY = 'top'; }
      else if (tMatrix.mid.center.y < sMatrix.top.center.y) { endY = 'bot'; }
      else if ((tMatrix.top.center.y >= sMatrix.top.center.y && tMatrix.bot.center.y <= sMatrix.bot.center.y)
        || (sMatrix.top.center.y >= tMatrix.top.center.y && sMatrix.bot.center.y <= tMatrix.bot.center.y)
        || (tMatrix.mid.center.y === sMatrix.mid.center.y)) {
        endY = 'bot'; // Middle
      }

      pathArr.push([sMatrix.mid.center.x, sMatrix.mid.center.y]); // Start line from middle of source

      const xMiddle = ((sMatrix.mid.center.x + tMatrix.mid.center.x) / 2);
      const yMiddle = ((sMatrix.mid.center.y + tMatrix.mid.center.y) / 2);
      if (xMiddle === sMatrix.mid.center.x && yMiddle === sMatrix.mid.center.y) {
        pathArr.push([xMiddle - 50, yMiddle + 50]); // Source === Target. Make a loop
        pathArr.push([xMiddle + 50, yMiddle + 50]);
      } else {
        if (endY === 'top') {
          pathArr.push([tMatrix[endY][endX].x, tMatrix[endY][endX].y - 50]);
        } else {
          pathArr.push([tMatrix[endY][endX].x, tMatrix[endY][endX].y + 50]);
        }
      }
      //    if (xMiddle === sMatrix.mid.center.x) { xMiddle += 50; }
      //    if (yMiddle === sMatrix.mid.center.y) { yMiddle += 50; }
      //    pathArr.push([xMiddle, yMiddle]);

      pathArr.push([tMatrix[endY].center.x, tMatrix[endY].center.y]); // Finish the line in the middle of target
    } else {
      console.debug('Tried to create links to non-rendered elements', source, target);
    }
    return pathArr;
  }
}
