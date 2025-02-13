import Konva from "konva";
import { restrictCircleToLine, shrinkTriangle } from "../../rawJS/MathHelper";

export function onDragEnd(evt) {
    /**
     * @type {Konva.Group}
     */
    const mainGroup = evt.target.findAncestor(".maingroup");
    /**
     * @type {Konva.Line}
     */
    const triangle = mainGroup.findOne(".triangle");
    /**
     * @type {Konva.Group}
     */
    const puck = mainGroup.findOne(".puck");
    /**
     * @type {Konva.Circle}
     */
    const circle = puck.findOne(".circle");
    /**
     * @type {Konva.Line[]}
     */
    const sidetexts = [];
    for (let i = 0; i < 6; i++) {
      sidetexts.push(mainGroup.findOne(`.sidetext${i}`));
    }
    const mainGroupPos = mainGroup.getAbsolutePosition();
    const radius =
      circle.radius() + triangle.strokeWidth() - circle.strokeWidth() - triangle.strokeWidth()/2;
    const newPoints = shrinkTriangle(triangle.points(), radius * 2);
    let [x1, y1, x2, y2, x3, y3] = newPoints.map((point, index) => {
      if (index == 0 || index % 2 == 0) {
        return point + mainGroupPos.x;
      } else {
        return point + mainGroupPos.y;
      }
    });
    let h = puck?.getAbsolutePosition().x;
    let k = puck?.getAbsolutePosition().y;
    //--------------------------------------------------------------------drag handel part
  
    const triangleXX = [
        { x: x1, y: y1 },
        { x: x2, y: y2 },
        { x: x3, y: y3 },
      ];
      const circleXX = {
        x: h,
        y: k,
        radius: radius,
      };
      // let newPos = keepCircleInsideTriangle(circle, triangle);
      let newPos = restrictCircleToLine(circleXX, triangleXX);
      puck?.setAbsolutePosition(newPos);
    return puck?.position()
    
    
  }