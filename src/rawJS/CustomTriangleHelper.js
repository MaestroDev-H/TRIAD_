import {
  calculateDistanceBetweenTwoPoint,
  distanceCalculator,
  findClosestTwoPoints,
  findMatchingCoordinate,
  getClosestPointOnLine,
  getInnerLine,
  // keepCircleInsideTriangle,
  restrictCircleToLine,
  shrinkTriangle,
} from "./MathHelper";
import { textReverseYellowAndScale, textYellowAndScale } from "./Animation";

/**
 *
 * @param {import("konva/lib/Node").KonvaEventObject<Group>} evt
 */
export function onDrag(evt) {
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
  const lines = [
    mainGroup.findOne(".line1"),
    mainGroup.findOne(".line2"),
    mainGroup.findOne(".line3"),
  ];
  /**
   * @type {Konva.Text[]}
   */
  const sidetexts = [];
  for (let i = 0; i < 6; i++) {
    sidetexts.push(mainGroup.findOne(`.sidetext${i}`));
  }
  /**
   * @type {Konva.Image}
   */
  const flashImage = mainGroup.findOne(".flashimage");
  /**
   * @type {Konva.Text}
   */
  const insideText=mainGroup.findOne(".insideText");
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

  if (evt.type == "dragmove") {
    const triangle = [
      { x: x1, y: y1 },
      { x: x2, y: y2 },
      { x: x3, y: y3 },
    ];
    const circle = {
      x: h,
      y: k,
      radius: radius,
    };
    // let newPos = keepCircleInsideTriangle(circle, triangle);
    let newPos = restrictCircleToLine(circle, triangle);
    puck?.setAbsolutePosition(newPos);
  }
  //--------------------------------------------------------------------Global Part
  [x1, y1, x2, y2, x3, y3] = triangle.points().map((point, index) => {
    if (index == 0 || index % 2 == 0) {
      return point + mainGroupPos.x;
    } else {
      return point + mainGroupPos.y;
    }
  });
  h = puck?.getAbsolutePosition().x;
  k = puck?.getAbsolutePosition().y;
  let AB = distanceCalculator(x1, y1, x2, y2, h, k, radius);
  let BC = distanceCalculator(x2, y2, x3, y3, h, k, radius);
  let CA = distanceCalculator(x3, y3, x1, y1, h, k, radius);
  const line1 = getClosestPointOnLine(x1, y1, x2, y2, h, k);
  const line2 = getClosestPointOnLine(x2, y2, x3, y3, h, k);
  const line3 = getClosestPointOnLine(x3, y3, x1, y1, h, k);
  const AB_innerLine = getInnerLine(
    x1,
    y1,
    line1.x,
    line1.y,
    x2,
    y2,
    calculateDistanceBetweenTwoPoint(x1, y1, x2, y2) / 2
  );
  const BC_innerLine = getInnerLine(
    x2,
    y2,
    line2.x,
    line2.y,
    x3,
    y3,
    calculateDistanceBetweenTwoPoint(x2, y2, x3, y3) / 2
  );
  const CA_innerLine = getInnerLine(
    x3,
    y3,
    line3.x,
    line3.y,
    x1,
    y1,
    calculateDistanceBetweenTwoPoint(x3, y3, x1, y1) / 2
  );
  let touchedLine = [];
  if (AB <= radius + 1) {
    touchedLine.push("AB");
  } else {
    lines[0].points([0, 0, 0, 0]);
  }
  if (BC <= radius + 1) {
    touchedLine.push("BC");
  } else {
    lines[1].points([0, 0, 0, 0]);
  }
  if (CA <= radius + 1) {
    touchedLine.push("CA");
  } else {
    lines[2].points([0, 0, 0, 0]);
  }
  let matched = null;
  if (touchedLine.length == 2) {
    matched = findMatchingCoordinate(
      AB_innerLine.x1,
      AB_innerLine.y1,
      AB_innerLine.x2,
      AB_innerLine.y2,
      BC_innerLine.x1,
      BC_innerLine.y1,
      BC_innerLine.x2,
      BC_innerLine.y2,
      CA_innerLine.x1,
      CA_innerLine.y1,
      CA_innerLine.x2,
      CA_innerLine.y2,
      20
    );
    if (touchedLine.includes("AB")) {
      lines[0].points([
        AB_innerLine.x1 - mainGroupPos.x,
        AB_innerLine.y1 - mainGroupPos.y,
        AB_innerLine.x2 - mainGroupPos.x,
        AB_innerLine.y2 - mainGroupPos.y,
      ]);
    }
    if (touchedLine.includes("BC")) {
      lines[1].points([
        BC_innerLine.x1 - mainGroupPos.x,
        BC_innerLine.y1 - mainGroupPos.y,
        BC_innerLine.x2 - mainGroupPos.x,
        BC_innerLine.y2 - mainGroupPos.y,
      ]);
    }
    if (touchedLine.includes("CA")) {
      lines[2].points([
        CA_innerLine.x1 - mainGroupPos.x,
        CA_innerLine.y1 - mainGroupPos.y,
        CA_innerLine.x2 - mainGroupPos.x,
        CA_innerLine.y2 - mainGroupPos.y,
      ]);
    }
  }
  if (matched) {
    flashImage.x(matched.x - mainGroupPos.x);
    flashImage.y(matched.y - mainGroupPos.y);
    flashImage.visible(true);
    flashImage.to({
      scaleX: 1,
      scaleY: 1,
      duration: 0.2,
    });
    const twoPoints = findClosestTwoPoints(flashImage.getPosition(), sidetexts);
    twoPoints.forEach((x) => {
      textYellowAndScale(x, true).play();
    });
    insideText.to({
      opacity:1,
      duration:0.4,
    })
  } else {
    flashImage.to({
      scaleX: 0.1,
      scaleY: 0.1,
      duration: 0,
    });
    sidetexts.forEach((x) => {
      textReverseYellowAndScale(x, true).play();
    });

    flashImage.visible(false);
    lines.forEach((x) => {
      x.points([0, 0, 0, 0]);
    });
    insideText.to({
      opacity:0,
      duration:0.4,
    })
  }
}
/**
 *
 * @param {Konva.KonvaEventObject<Group>} element
 */
export function groupHover(element, goldLogoElement) {
  const logo = element.currentTarget.findOne(".logo");
  const circle = element.currentTarget.findOne(".circle");

  logo.image(goldLogoElement);
  circle.to({
    shadowBlur: 20,
    duration: 0.1,
    shadowColor: "yellow",
  });
}
/**
 *
 * @param {Konva.KonvaEventObject<Group>} element
 */
export function groupOut(element, LogoElement) {
  const logo = element.currentTarget.findOne(".logo");
  const circle = element.currentTarget.findOne(".circle");

  logo.image(LogoElement);
  circle.to({
    shadowBlur: 0,
    duration: 0.1,
    shadowColor: "yellow",
  });
}
