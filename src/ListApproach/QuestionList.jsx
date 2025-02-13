import { useQuery } from "@tanstack/react-query";
import { Button, Divider, Table } from "antd";
import axios from "axios";
import { useAnswerStore } from "./store";
import { useState } from "react";
import TriadQuestion from "./TriadQuestion";
import Visualize from "./Visualize";
const QuestionList = () => {
  const [index, setIndex] = useState(0);
  const [isQueList, setQueList] = useState(true);
  const [triangleConfig, setTriangleConfig] = useState(null);
  const [isModalOpen, setIsModalOpen]=useState(false)
  const [ansIndex, setAnsIndex] = useState(null);
  const { answer } = useAnswerStore();
  console.log("📢[QuestionList.jsx:10]: answer: ", answer);
  const queryData = useQuery({
    queryKey: ["data"],
    queryFn: async () => {
      const result = await axios.get("/TRIAD_DATA.json");
      const t_result_data = result.data?.map((x, i) => ({
        ...x,
        qNo: i,
      }));
      return t_result_data;
    },
  });
  function onAnswerClick(values, puckPos = null) {
    setIndex(values.qNo);
    const t_data = queryData.data?.filter((x) => x.qNo == values.qNo)[0];
    setTriangleConfig({
      sideText: [t_data.Top, t_data.LL, t_data.LR],
      triangleColor: String(t_data.Tcolor).toLowerCase().replace(" ", ""),
      triangleWidth: 175 * 2,
      circleColor: String(t_data.Pcolor).toLowerCase().replace(" ", ""),
      insideText: t_data.QueryName,
      question: `${t_data.qNo + 1}.${t_data.Question}`,
      que: t_data.Question,
      puckPos: puckPos,
    });
    setQueList(false);
  }
  const questionCol = [
    {
      title: "Q.No",
      dataIndex: "qNo",
      key: "qNo,",
      render: (qNo) => {
        return qNo + 1;
      },
    },
    {
      title: "Question",
      dataIndex: "Question",
      key: "Question",
    },
    {
      title: "Category",
      dataIndex: "Category",
      key: "Category",
    },
    {
      title: "Top Middle Choice",
      dataIndex: "Top",
      key: "Top",
    },
    {
      title: "Lower Left Corner Choice",
      dataIndex: "LL",
      key: "LL",
    },
    {
      title: "Lower Right Corner Choice",
      dataIndex: "LR",
      key: "LR",
    },
    {
      title: "QueryName",
      dataIndex: "QueryName",
      key: "QueryName",
    },
    {
      title: "Action",
      dataIndex: "action",
      key: "action",
      render: (_, values) => {
        let flag = false;
        for (let i = 0; i < answer?.length; i++) {
          const element = answer[i];
          if (element.qNo == values.qNo) {
            flag = element;
            break;
          }
        }
        if (!flag) {
          return (
            <Button
              style={{ backgroundColor: "blue" }}
              className="text-white uppercase"
              onClick={() => onAnswerClick(values)}
            >
              Answer{" "}
            </Button>
          );
        } else {
          return (
            <div>
              <Button
                style={{ backgroundColor: "blue" }}
                className="text-white uppercase"
                onClick={() => onAnswerClick(values, flag?.puckPos)}
              >
                ReAnswer{" "}
              </Button>
              <Button
                style={{ backgroundColor: "blue" }}
                className="text-white uppercase"
                onClick={()=>{setAnsIndex(flag.qNo);setIsModalOpen(true)}}
              >
                Visualize{" "}
              </Button>
            </div>
          );
        }
      },
    },
  ];

  return (
    <div className="m-2 border">
      {isQueList ? (
        <>
          <Divider>
            <p className="text-xl text-center uppercase font-semibold">
              Question Table
            </p>
          </Divider>
          <Table
            rowKey="qNo"
            columns={questionCol}
            dataSource={queryData.data}
            loading={queryData.isLoading}
            pagination={{ pageSize: 15 }}
          ></Table>
        </>
      ) : (
        <>
          <TriadQuestion
            indexState={[index, setIndex]}
            setQueList={setQueList}
            triangleConfig={triangleConfig}
            setTriangleConfig={setTriangleConfig}
            queryData={queryData.data}
            datasLength={queryData.data?.length}
          ></TriadQuestion>
        </>
      )}
      {ansIndex!=null && <Visualize ansIndex={ansIndex} modalState={[isModalOpen, setIsModalOpen]}></Visualize>}
    </div>
  );
};

export default QuestionList;
