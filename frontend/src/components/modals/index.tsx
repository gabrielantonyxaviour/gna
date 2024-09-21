import { Dialog, DialogContent } from "@/components/ui/dialog";
import MissionOneDescription from "./mission-one";
import MissionTwoDescription from "./mission-two";
import MissionThreeDescription from "./mission-three";
import Transaction from "./transaction";
import MissionFourDescription from "./mission-four";

export default function Modals({
  option,
  setOption,
}: {
  option: number;
  setOption: (op: number) => void;
}) {
  return (
    <>
      <Dialog
        open={option != 0}
        onOpenChange={(op) => {
          // if (op == false) setOption(0);
        }}
      >
        <DialogContent className="left-[10%] translate-x-0 px-0">
          {option == 1 ? (
            <MissionOneDescription />
          ) : option == 2 ? (
            <MissionTwoDescription />
          ) : option == 3 ? (
            <MissionThreeDescription />
          ) : option == 4 ? (
            <MissionFourDescription />
          ) : (
            <></>
          )}
        </DialogContent>
      </Dialog>

      <Transaction mission={option} setMission={setOption} />
    </>
  );
}
