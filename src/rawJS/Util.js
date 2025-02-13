import { myTriangle } from "./CustomTriangle";
import { myQuestion } from "./CustomQuestion";

/**
 *
 * @param {{
 * mainGroup:Konva.Group,
 * puck:Konva.Group,
 * triangle:Konva.Line,
 * insideText:Konva.Text,
 * circle:Konva.Circle,
 * sideText:Konva.Text[],
 * }} oldGroup
 * @param {string} insideText
 * @param {import("./DemoData").TriangleDataObject} nextData
 */
export function redrawGroup(oldGroup, nextData) {
  let newFunctionData = oldGroup.mainGroup.getAttrs().functionValues;
  newFunctionData={...newFunctionData,...nextData.triangleConfig}
  // Create a new group with the new data
  const newGroup = myTriangle(newFunctionData);
  const newQuestion = myQuestion(nextData.q);
  // Position the new group at the same position as the old group

  return { newGroup: newGroup, newQuestion: newQuestion };
}
