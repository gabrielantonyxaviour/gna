import { useState } from "react";
import Action from "./_components/action";

export default function Transaction({
  mission,
  setMission,
}: {
  mission: number;
  setMission: (mission: number) => void;
}) {
  return <Action mission={mission} setMission={setMission} />;
}
