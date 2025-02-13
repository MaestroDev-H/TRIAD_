import { useAnswerStore } from "./store";
import { Layer, Stage } from "react-konva";
import CustomTriangleComponent2 from "../CustomComponent/CustomTriangleComponent2";
import { Button, Modal } from "antd";
import { disapper, sleep } from "../rawJS/Animation";
import { useMemo, useState } from "react";

const TriadQuestion = ({
  triangleConfig,
  indexState, // This prop MUST be the result of useState in the parent
  setQueList,
  datasLength,
  setTriangleConfig,
  queryData,
}) => {
  const { answer, updateAnswer } = useAnswerStore();
  const [tri, setTri] = useState({});
  const [index, setIndex] = indexState;
  const [submitLoading, setSubmitLoading] = useState(false);
  const [movement, setMoveMent] = useState([]);
  const [isSummaryVisible, setIsSummaryVisible] = useState(false);

  console.log("📢[TriadQuestion.jsx]: Current answer state: ", answer);

  function onClickNext() {
    let t_index = index;
    t_index += 1;
    if (datasLength > t_index) {
      setIndex(t_index);
    }
    const t_data = queryData?.filter((x) => x.qNo === t_index)[0];
    if (t_data) {
      setTriangleConfig({
        sideText: [t_data.Top, t_data.LL, t_data.LR],
        triangleColor: String(t_data.Tcolor).toLowerCase().replace(" ", ""),
        triangleWidth: 175 * 2,
        circleColor: String(t_data.Pcolor).toLowerCase().replace(" ", ""),
        insideText: t_data.QueryName,
        question: `${t_data.qNo + 1}.${t_data.Question}`,
        que: t_data.Question,
        puckPos: null,
      });
    }
  }

  async function onClickSubmit() {
    setSubmitLoading(true);
    if (Object.keys(tri).length !== 0) {
      for (let i = 0; i < tri.sideText.current.length; i++) {
        const x = tri?.sideText.current[i];
        if (x.current) {
          if (x.current?.scaleX() === 1.1) {
            if (x.current?.text() !== " ") {
              let updatedAnswer;
              if (answer.length === 0) {
                await sleep(3000);
                await disapper(tri?.mainGroup.current);
                updatedAnswer = [
                  {
                    qNo: index,
                    que: triangleConfig.que,
                    ans: x.current?.text(),
                    puckPos: tri.puck.current.position(),
                    movement: movement,
                    triangleConfig: triangleConfig,
                  },
                ];
              } else {
                const t = [...answer];
                function isExist() {
                  for (let i = 0; i < t?.length; i++) {
                    if (t[i].qNo === index) {
                      return i;
                    }
                  }
                  return -1;
                }
                const ansIdx = isExist();
                if (ansIdx !== -1) {
                  t.splice(ansIdx, 1);
                }
                t.push({
                  qNo: index,
                  que: triangleConfig.que,
                  ans: x.current?.text(),
                  puckPos: tri.puck.current.position(),
                  movement: movement,
                  triangleConfig: triangleConfig,
                });
                updatedAnswer = t;
                await sleep(3000);
                await disapper(tri?.mainGroup.current);
              }

              console.log("📢[TriadQuestion.jsx]: Updated answer: ", updatedAnswer);
              updateAnswer(updatedAnswer);
              setMoveMent(null);
              onClickNext();
              break;
            }
          }
        }
      }
    }
    setSubmitLoading(false);
  }

  const toggleSummary = () => {
    setIsSummaryVisible(!isSummaryVisible);
  };

  const summaryContent = useMemo(() => {
    return (
      <ul>
        {answer.map((ans, idx) => (
          <li key={idx}>
            <strong>Question {ans.qNo + 1}:</strong> {ans.que} <br />
            <strong>Answer:</strong> {ans.ans}
          </li>
        ))}
      </ul>
    );
  }, [answer]);

  const stageContent = useMemo(() => {
    return (
      <Layer>
        <CustomTriangleComponent2
          triangleConfig={triangleConfig}
          triState={[tri, setTri]}
          movementState={[movement, setMoveMent]}
        />
      </Layer>
    );
  }, [triangleConfig, tri, setTri, movement]);

  return (
    <div className="m-2">
      {/* ... (rest of your JSX - buttons, stage, modal, etc.) */}
      <div>
        <Button
          className="uppercase w-36 text-white font-semibold rounded-md"
          size="large"
          style={{
            borderColor: "#636363",
            borderWidth: "2px",
            backgroundColor: "#000",
          }}
          onClick={() => {
            setQueList(true);
          }}
        >
          Back
        </Button>
      </div>
      <div className="flex justify-center items-center flex-col">
        {triangleConfig && (
          <Stage width={350} height={350}>
            {stageContent}
          </Stage>
        )}
        <div className="flex justify-center gap-4">
          <Button
            className="uppercase w-36 text-white font-semibold rounded-md"
            size="large"
            style={{
              borderColor: "#636363",
              borderWidth: "2px",
              backgroundColor: "#000",
            }}
            onClick={toggleSummary}
          >
            See Summary
          </Button>
          <Button
            loading={submitLoading}
            onClick={onClickSubmit}
            className="uppercase w-36 text-white font-semibold rounded-md"
            style={{
              borderColor: "#f2c15b",
              backgroundColor: "#f19225",
              borderWidth: "2px",
            }}
            size="large"
          >
            Submit
          </Button>
          <Button
            className="uppercase w-36 text-white font-semibold rounded-md"
            style={{
              backgroundColor: "#1b8daa",
              borderColor: "#386784",
              borderWidth: "2px",
            }}
            size="large"
            onClick={onClickNext}
          >
            Next
          </Button>
        </div>
      </div>

      <Modal
        title="Summary"
        open={isSummaryVisible}
        onCancel={toggleSummary}
        footer={null}
      >
        {answer.length ? summaryContent : <p>No answers submitted yet.</p>}
      </Modal>
    </div>
  );
};

export default TriadQuestion;