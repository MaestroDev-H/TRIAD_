import Konva from "konva";
import { shrinkTriangle } from "./MathHelper";
/**
 *
 * @param {Konva.Text} element
 * @param {boolean} [isPlay]
 * @returns
 */
export function textYellowAndScale(element, isPlay = false) {
  /**
   * @type {import("konva/lib/Tween").TweenConfig} config
   */
  let config = {
    node: element,
    fill: element.getAttrs().hoverFill,
    stroke: "black",
    strokeWidth: 1,
    scaleX: 1.1,
    scaleY: 1.1,
    duration: 0.1,
  };
  if (!isPlay) {
    config = {
      node: element.current,
    };
  }
  return new Konva.Tween(config);
}
export function textReverseYellowAndScale(element, isPlay = false) {
  /**
   * @type {import("konva/lib/Tween").TweenConfig} config
   */
  let config = {
    node: element,
    fill: "black",
    strokeWidth: 0,
    scaleX: 1,
    scaleY: 1,
    duration: 0,
  };
  if (!isPlay) {
    config = {
      node: element.current,
    };
  }
  return new Konva.Tween(config);
}
/**
 *
 * @param {Konva.Layer|Konva.Layer[]} [layer]
 * @param {Konva.Line} line
 */
export function lineAnimation(layer, line) {
  return new Konva.Animation(function (frame) {
    line.dashOffset(line.dashOffset() + frame.timeDiff / 50);
  }, layer);
}

/**
 *
 * @param {Konva.Layer|Konva.Layer[]} [layer]
 * @param {Konva.Image} image
 */

export function flashImageAnimation(layer, image) {
  return new Konva.Animation(function (frame) {
    image?.rotation((image?.rotation() + frame.timeDiff / 50) % 360);
  }, layer);
}

export function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function disapper(element) {
  return new Promise((resolve) => {
    new Konva.Tween({
      node: element,
      opacity: 0,
      duration: 0.5,
      easing: Konva.Easings.EaseInOut(),
      onFinish: () => {
        resolve();
      },
    }).play();
  });
}
function appear(element) {
  return new Promise((resolve) => {
    new Konva.Tween({
      node: element,
      opacity: 1,
      duration: 0.9,
      easing: Konva.Easings.EaseInOut(),
      onFinish: () => {
        resolve();
      },
    }).play();
  });
}

/**
 *
 * @param {{
 * mainGroup:Konva.Group,
 * puck:Konva.Group,
 * triangle:Konva.Line,
 * insideText:Konva.Text,
 * sideText:Konva.Text[],
 * }} myTriangle
 * @param {string} insideText
 * @param {Konva.Text} question
 */
export async function TheEnd(myTriangle, insideText, question) {
  // stop listening -> time middle of the triangle see some text -> text and puck dissolve -> then re appear with new question
  myTriangle.mainGroup.listening(false);
  myTriangle.insideText.opacity(0);
  myTriangle.insideText.text(insideText);
  myTriangle.insideText.offset({
    x: myTriangle.insideText.width() / 2,
    y: myTriangle.insideText.height() / 2,
  });
  await appear(myTriangle.insideText);
  await sleep(2000);
  const disappearPromis = [
    disapper(myTriangle.puck),
    disapper(myTriangle.insideText),
  ];
  myTriangle.sideText.forEach(async (x) => {
    disappearPromis.push(disapper(x));
  });
  disappearPromis.push(disapper(question));
  await Promise.all(disappearPromis);
  myTriangle.mainGroup.destroy();
  question.destroy();
}

function changePos(element, x, y) {
  return new Promise((resolve) => {
    const tween = new Konva.Tween({
      node: element,
      x: x,
      y: y,
      easing: Konva.Easings.EaseInOut(),
      duration: 0.5,
      onFinish: async () => {
        element.fire("dragmove");
        await sleep(400);
        resolve();
      },
    });
    if (!tween.anim.isRunning()) {
      tween.play();
    }
  });
}

/**
 *
 * @param {Konva.Group} puck
 * @param {HTMLImageElement} indexFinger
 */
export async function tutorialAnime(mainGroup, indexFinger) {
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
   * @type {Konva.Image}
   */
  const logo = puck.findOne(".logo");
  puck.listening(false);

  const neutralPos = puck.position();
  const radius =
    circle.radius() + triangle.strokeWidth() - circle.strokeWidth() - 4;
  const mainGroupPos = mainGroup.getAbsolutePosition();
  const newPoints = shrinkTriangle(triangle.points(), radius * 2);
  let [x1, y1, x2, y2, x3, y3] = newPoints.map((point, index) => {
    if (index == 0 || index % 2 == 0) {
      return point + mainGroupPos.x;
    } else {
      return point + mainGroupPos.y;
    }
  });

  const trianglePoint = [
    { x: x1, y: y1 },
    { x: x2, y: y2 },
    { x: x3, y: y3 },
  ];

  const logoImage = logo.image();
  const logoWidth = logo.width();
  const logoHeight = logo.height();
  logo.opacity(0);
  logo.image(indexFinger);
  await sleep(500);
  logo.width(200);
  logo.height(200);
  logo.offset({
    x: logo.width() / 2,
    y: logo.height() / 2,
  });
  await appear(logo);
  await changePos(
    puck,
    trianglePoint[0].x - mainGroupPos.x,
    trianglePoint[0].y - mainGroupPos.y
  );
  await changePos(puck, neutralPos.x, neutralPos.y);
  await changePos(
    puck,
    trianglePoint[1].x - mainGroupPos.x,
    trianglePoint[1].y - mainGroupPos.y
  );
  await changePos(puck, neutralPos.x, neutralPos.y);
  await changePos(
    puck,
    trianglePoint[2].x - mainGroupPos.x,
    trianglePoint[2].y - mainGroupPos.y
  );
  await changePos(puck, neutralPos.x, neutralPos.y);

  await disapper(logo);
  logo.width(logoWidth);
  logo.height(logoHeight);
  logo.offset({
    x: logoWidth / 2,
    y: logoHeight / 2,
  });
  logo.image(logoImage);
  await appear(logo);
  puck.listening(true);
}

function move(element, x, y) {
  return new Promise((resolve) => {
    new Konva.Tween({
      node: element,
      x: x,
      y: y,
      duration: 0.4,
      easing: Konva.Easings.StrongEaseInOut(),
      onFinish: () => {
        resolve();
      },
    }).play();
  });
}

/**
 *
 * @param {Konva.Group} element
 * @param {{x:number,y:number}[]} movements
 */
export async function ansVisualize(element, movements = []) {
  await sleep(1000);
  movements?.forEach(async (x) => {
    
  });
}
