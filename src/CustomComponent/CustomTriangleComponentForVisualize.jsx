import { useEffect, useState } from "react";
import { ansVisualize, sleep } from "../rawJS/Animation";
import useCustomeTrianlge from "../CustomHook/useCustomeTrianlge";
import Konva from "konva";

const CustomTriangleComponentForVisualize = ({
  triangleConfig,
  ansData = [],
  stageState,
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
  const [stage, setStage] = stageState;
  useEffect(() => {
    const handlePuckChange = async () => {
      let dataIndex = 0;
      if (puck.current) {
        function animeFunc() {
          puck.current.to({
            x: ansData[dataIndex].x,
            y: ansData[dataIndex].y,
            duration:0.7,
            onFinish:async () => {
              if (ansData[dataIndex + 1]) {
                dataIndex += 1;
                await sleep(400)
                animeFunc();
              }else{
                puck.current.fire("dragmove");
              }
              
            },
          });
        }
        await sleep(1000)
        animeFunc();
      }
      if (mainGroup.current) {
        setStage(mainGroup.current.getStage());
      }
    };

    handlePuckChange();
  }, [puck.current]);
  return component;
};

export default CustomTriangleComponentForVisualize;
