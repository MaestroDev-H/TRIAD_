import { Circle, Group, Image, Line, Text } from "react-konva";
import {
  calculateCentroid,
  calculateDistanceBetweenTwoPoint,
  calculateTriangleAngles,
  calculateTriangleVertices,
  getMidPoint,
} from "../rawJS/MathHelper";
import useImage from "use-image";
import { createRef, useEffect, useRef } from "react";
import { groupHover, groupOut, onDrag } from "../rawJS/CustomTriangleHelper";
import Konva from "konva";
import { flashImageAnimation } from "../rawJS/Animation";
import { calculateEdgeLength } from "./Helper/CustomTriangleUtil";

function maxWidthForInsideText(points) {
  const mid1 = getMidPoint(points[0], points[1], points[2], points[3]);
  const mid2 = getMidPoint(points[0], points[1], points[4], points[5]);
  const distance = calculateDistanceBetweenTwoPoint(
    mid1.x,
    mid1.y,
    mid2.x,
    mid2.y
  );
  return distance;
}

const useCustomeTrianlge = ({
  sideText = ["", "", "", "", "", ""],
  insideText = "",
  insideTextColor = "#e7e6e6",
  trianglePosX = 0,
  trianglePosY = 0,
  minTriangleHeight = 175 * 2,
  triangleColor = "white",
  triangleStrokeWidth = 13,
  circleRadius = 35,
  circleStroke = 2,
  circleColor = "#273546",
  question = "This is my pretty big questionasdsssssssssssssssssssssssssssssssssssssssssss do you assd it?",
}) => {
  let T_Height = minTriangleHeight;
  T_Height = calculateEdgeLength(sideText, T_Height);
  const T_Stroke = triangleStrokeWidth;
  const C_Rad = circleRadius;
  const C_Stroke = circleStroke;
  const points = calculateTriangleVertices(0, 0, T_Height); // [x1,y1,x2,y2,x3,y3]
  const centroid = calculateCentroid(...points);
  const degrees = calculateTriangleAngles(...points);
  const [flashImageElement] = useImage("/flash.png");
  const [LogoImageObj] = useImage("/Logo.svg");
  const [goldLogoElement] = useImage("/LogoGold.svg");
  const maxInsideTextWidth = maxWidthForInsideText(points) + 25;
  const refFlashImage = useRef();
  const refInsideText = useRef();
  /**
   * @type {{current:Konva.Group}}
   */
  const refMainGroup = useRef();
  const refLogo = useRef();
  const refTriangle = useRef();
  /**
   * @type {{current:Konva.Group}}
   */
  const refPuck = useRef();
  const refCircle = useRef();
  /**
   * @type {{current:Konva.Text}}
   */
  const refQuestion = useRef();
  const refSideText = useRef([]);

  if (sideText.length == 3) {
    // sideText = [sideText[0], " ", sideText[1], " ", sideText[2], " "];
    sideText = [
      sideText[0], // Top Right
      sideText[0], // Top Left
      sideText[1], // Bottom left bottom
      sideText[1], // Bottom Left Left
      sideText[2], // bottom right bottom
      sideText[2], // bottom right right
    ];
  }
  const CustomTriangleComponent = () => {
    useEffect(() => {
      if (refInsideText.current) {
        if (refInsideText.current.width() > maxInsideTextWidth) {
          refInsideText.current.width(maxInsideTextWidth);
        }
      }
      if (refQuestion.current) {
        refQuestion.current.offset({
          x: refQuestion.current.width() / 2,
          y: refQuestion.current.height() / 2,
        });
        refQuestion.current.y(
          refQuestion.current.y() +
            refTriangle.current.height() +
            T_Stroke +
            refQuestion.current.height() +
            20
        );
      }
      if (refFlashImage.current && refMainGroup.current) {
        const rotateImage = flashImageAnimation(
          refMainGroup.current.findAncestor("Layer"),
          refFlashImage.current
        );
        rotateImage.start();
      }
      if (refLogo.current) {
        refLogo.current.offset({
          x: refLogo.current.width() / 2,
          y: refLogo.current.height() / 2,
        });
      }
      if (refInsideText.current) {
        refInsideText.current.offset({
          x: refInsideText.current.width() / 2,
          y: refInsideText.current.height() / 2,
        });
      }
      if (
        refMainGroup.current &&
        refTriangle.current &&
        refSideText.current &&
        refQuestion.current
      ) {
        const stage = refMainGroup.current.getStage();
        let t_stageSize = {
          width:
            refTriangle.current.width() +
            T_Stroke +
            refFlashImage.current.width(),
          height:
            refTriangle.current.height() +
            T_Stroke +
            refFlashImage.current.height() +
            refQuestion.current.height() +
            20,
        };

        if (
          stage.width() != t_stageSize.width ||
          stage.height() != t_stageSize.height ||
          stage.width() < refQuestion.current.width() ||
          stage.width() < t_stageSize.width
        ) {
          if (refQuestion.current.width() > t_stageSize.width) {
            t_stageSize.width = refQuestion.current.width() + 5;
          }
        }
        stage.width(t_stageSize.width);
        stage.height(t_stageSize.height);

        refMainGroup.current.position({
          x: stage.width() / 2 + trianglePosX,
          y: T_Stroke + trianglePosY + refFlashImage.current.height() / 2,
        });
      }
    }, [refQuestion]);
    return (
      <Group
        opacity={1}
        ref={refMainGroup}
        name="maingroup"
        functionValues={{
          sideText: sideText,
          insideText: insideText,
          insideTextColor: insideTextColor,
          trianglePosX: trianglePosX,
          trianglePosY: trianglePosY,
          minTriangleHeight: minTriangleHeight,
          triangleColor: triangleColor,
          triangleStrokeWidth: triangleStrokeWidth,
          circleRadius: circleRadius,
          circleStroke: circleStroke,
          circleColor: circleColor,
        }}
      >
        <Line
          points={points}
          strokeWidth={T_Stroke}
          stroke="#45546A"
          fill={triangleColor}
          closed
          name="triangle"
          ref={refTriangle}
        ></Line>
        <Image
          name="flashimage"
          ref={refFlashImage}
          scale={{ x: 0.1, y: 0.1 }}
          visible={false}
          image={flashImageElement}
          height={80}
          width={80}
          offset={{ x: 80 / 2, y: 80 / 2 }}
        ></Image>
        <Text
          opacity={0}
          ref={refInsideText}
          x={centroid.x}
          y={centroid.y}
          text={insideText.toUpperCase()}
          stroke={"black"}
          strokeWidth={1}
          fontSize={22}
          fill={insideTextColor}
          fontStyle="bold"
          fontFamily="Roboto"
          name="insideText"
          listening={false}
          align="center"
        ></Text>
        <Group
          name="puck"
          x={centroid.x}
          y={centroid.y}
          draggable
          onDragMove={onDrag}
          onMouseOver={(v) => {
            groupHover(v, goldLogoElement);
          }}
          onMouseOut={(v) => groupOut(v, LogoImageObj)}
          ref={refPuck}
        >
          <Circle
            ref={refCircle}
            radius={C_Rad}
            stroke="#45546A"
            fill={circleColor}
            strokeWidth={C_Stroke}
            shadowBlur={100}
            listening={false}
            shadowColor="yellow"
            name="circle"
          ></Circle>
          <Image
            height={circleRadius + 2}
            width={circleRadius + 2}
            image={LogoImageObj}
            name="logo"
            hitStrokeWidth={30}
            ref={refLogo}
          ></Image>
        </Group>

        {new Array(3).fill(" ").map((_, i) => (
          <Line
            points={[0, 0, 0, 0]}
            key={`line${i + 1}`}
            name={`line${i + 1}`}
            strokeWidth={3}
            stroke={"yellow"}
          ></Line>
        ))}

        {sideText.map((x, i) => {
          const text = new Konva.Text({
            text: x.toUpperCase(),
            fontFamily: "Roboto",
            fontStyle: "bold",
            fontSize: 17,
            name: `sidetext${i}`,
            hoverFill: triangleColor,
            align: "center",
          });
          if (refTriangle.current) {
            if (i == 0) {
              const nob = 16;
              text.offsetY(text.height());
              text.y(refTriangle.current?.strokeWidth() - nob);
              text.x(refTriangle.current?.strokeWidth() - nob + 8);
              text.rotation(degrees.x1y1); // angel of the corner
            } else if (i == 1) {
              const nob = 12;
              text.offsetX(text.width());
              text.offsetY(text.height());
              text.y(-refTriangle.current?.strokeWidth() + nob);
              text.x(-refTriangle.current?.strokeWidth() + nob - 4);

              text.rotation(-degrees.x1y1);
            } else if (i == 2) {
              text.offsetY(text.height());
              text.x(points[2]); // points contain triangle 3 point
              text.y(points[3] + 12 + refTriangle.current?.strokeWidth());
            } else if (i == 3) {
              text.offsetY(text.height());
              text.x(points[2]);
              text.y(points[3] + 6 - refTriangle.current?.strokeWidth());
              text.rotation(360 - degrees.x2y2);
            } else if (i == 4) {
              text.offset({
                x: text.width(),
                y: text.height(),
              });
              text.x(points[4]);
              text.y(points[5] + 12 + refTriangle.current?.strokeWidth());
            } else if (i == 5) {
              text.offsetX(text.width());
              text.offsetY(text.height());
              text.x(points[4] + 3);
              text.y(points[5] + 10 - refTriangle.current?.strokeWidth());
              text.rotation(degrees.x3y3);
            }
          }
          const ref = createRef();
          refSideText.current[i] = ref;
          return (
            <Text {...text.getAttrs()} ref={ref} key={`sidetext${i}`}></Text>
          );
        })}
        {question && question != "" && (
          <Text
            name="question"
            ref={refQuestion}
            text={question}
            fontSize={25}
            fontStyle="bold"
            fill={"black"}
          ></Text>
        )}
      </Group>
    );
  };
  return {
    component: <CustomTriangleComponent></CustomTriangleComponent>,
    mainGroup: refMainGroup,
    triangle: refTriangle,
    insideText: refInsideText,
    sideText: refSideText,
    flashImage: refFlashImage,
    puck: refPuck,
    circle: refCircle,
  };
};

export default useCustomeTrianlge;
