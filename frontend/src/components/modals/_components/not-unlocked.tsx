import { Lock } from "lucide-react";

export default function NotUnlocked({ mission }: { mission: string }) {
  return (
    <div className="h-[300px] flex flex-col justify-center items-center">
      <Lock /> <p className="text-xl font-bold">Feature Locked</p>
      <p className="text-sm text-muted-foreground">
        Complete mission {mission} to unlock this stage
      </p>
    </div>
  );
}
