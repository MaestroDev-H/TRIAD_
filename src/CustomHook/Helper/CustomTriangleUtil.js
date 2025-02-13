import Konva from "konva";

/**
 *
 * @param {string[]} sideText
 */
export function calculateEdgeLength(sideText,minWidth=0) {
  sideText = [
    sideText[0], // Top Right
    sideText[0], // Top Left
    sideText[1], // left Bottom  bottom
    sideText[1], // Left Bottom  Left
    sideText[2], // right bottom  bottom
    sideText[2], // right bottom  right
  ];
  let edgeWidth = 0;
  const konvaSideText = sideText.map((x) => {
    return new Konva.Text({
      text: x.toUpperCase(),
      fontFamily: "Roboto",
      fontStyle: "bold",
      fontSize: 17,
      align: "center",
    });
  });
  if (konvaSideText[0].width() + konvaSideText[5].width() > edgeWidth) {
    edgeWidth = konvaSideText[0].width() + konvaSideText[5].width()
  }
  if (konvaSideText[1].width() + konvaSideText[3].width() > edgeWidth) {
    edgeWidth = konvaSideText[1].width() + konvaSideText[3].width()
  }
  if (konvaSideText[2].width() + konvaSideText[4].width() > edgeWidth) {
    edgeWidth = konvaSideText[2].width() + konvaSideText[4].width()
  }
  if (minWidth<edgeWidth) {
    return edgeWidth
  }
  return minWidth
}

export function canvasCalculator() {
  
}