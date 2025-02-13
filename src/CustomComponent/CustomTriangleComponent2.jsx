import { useEffect } from "react";
import useCustomeTrianlge from "../CustomHook/useCustomeTrianlge";
import { onDragEnd } from "./Helper/Helper";

const CustomTriangleComponent2 = ({
  triangleConfig,
  triState,
  movementState,
}) => {
  const {
    component,
    mainGroup,
    triangle,
    insideText,
    sideText,
    flashImage,
    puck,
    circle,
  } = useCustomeTrianlge(triangleConfig);
  const [tri, setTri] = triState;
  const [movement, setMoveMent] = movementState;
  useEffect(() => {
    const checkAndUpdate = () => {
      if (
        mainGroup.current &&
        triangle.current &&
        insideText.current &&
        sideText.current &&
        flashImage.current &&
        puck.current &&
        circle.current
      ) {
        let count = 0;
        sideText.current.forEach((x) => {
          if (x.current) {
            count += 1;
          }
        });
        if (sideText.current.length == count && Object.keys(tri).length == 0) {
          setTri({
            mainGroup: mainGroup,
            triangle: triangle,
            insideText: insideText,
            sideText: sideText,
            flashImage: flashImage,
            puck: puck,
            circle: circle,
          });
        }
      }
    };

    // Run immediately
    checkAndUpdate();

    // Also run whenever any of these values change
    const dependencies = [
      mainGroup.current,
      triangle.current,
      insideText.current,
      sideText.current,
      flashImage.current,
      puck.current,
      circle.current,
    ];
    const cleanup = dependencies.some((dep) => dep !== undefined);
    if (cleanup) {
      checkAndUpdate();
    }
    if (triangleConfig.puckPos && puck.current) {
      setTimeout(() => {
        puck.current.position(triangleConfig.puckPos);
        puck.current.fire("dragmove");
      }, 100);
    }
    setTimeout(() => {
      puck.current.on("dragend", function (evt) {
        const newPos = onDragEnd(evt);
        setMoveMent((prev) => [...prev, newPos]);
      });
    }, 100);

    return () => {};
  }, [mainGroup, triangle, insideText, sideText, flashImage, puck, circle]);

  return component;
};

export default CustomTriangleComponent2;
