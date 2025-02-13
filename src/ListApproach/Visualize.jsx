import { Empty, Modal } from "antd";
import { useAnswerStore } from "./store";
import { Layer, Stage } from "react-konva";
import CustomTriangleComponentForVisualize from "../CustomComponent/CustomTriangleComponentForVisualize";
import { useState } from "react";

const Visualize = ({ ansIndex, modalState }) => {
  const [isModalOpen, setIsModalOpen] = modalState;
  const [stage, setStage] = useState();
  const { answer } = useAnswerStore();
  const data = answer?.filter((x) => x.qNo == ansIndex)[0];

  const handleOk = () => {
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  return (
    <Modal
      width={stage?.width()}
      destroyOnClose
      open={isModalOpen}
      onOk={handleOk}
      onCancel={handleCancel}
      data-testid="see-summary-modal" //
    >
      <div className="flex justify-center">
        {data ? (
          <Stage width={1} height={1}>
            <Layer>
              <CustomTriangleComponentForVisualize
                triangleConfig={data.triangleConfig}
                ansData={data.movement}
                stageState={[stage, setStage]}
              />
            </Layer>
          </Stage>
        ) : (
          <Empty description="No Summary Available" />
        )}
      </div>

      {/* "SEE SUMMARY UI" */}
      <div id="see-summary-ui" className="summary-text">
        SEE SUMMARY UI
      </div>
    </Modal>
  );
};

export default Visualize;
