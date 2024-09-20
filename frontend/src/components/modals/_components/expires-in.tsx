import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarTrigger,
} from "@/components/ui/menubar";
import { ChevronDown, ChevronUp } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

export default function ExpiresIn({
  expiresIn,
  setExpiresIn,
}: {
  expiresIn: string;
  setExpiresIn: (expiresIn: string) => void;
}) {
  const [chevron, setChevron] = useState(true);
  const options = ["1 Minute", "10 Minutes", "1 Hour", "1 Day"];
  const seconds = [60, 600, 3600, 86400];
  const [selectedOption, setSelectedOption] = useState<number>(0);
  return (
    <div className="w-[35%] bg-card rounded-xl py-3 px-4">
      <p className="text-xs text-muted-foreground font-medium text-right">
        Expires in
      </p>
      <Menubar
        onClick={() => {
          setChevron(!chevron);
        }}
        className="border-none ml-auto px-0 pt-4 m-0 justify-end"
      >
        <MenubarMenu>
          <MenubarTrigger
            onClick={() => {
              setChevron(!chevron);
            }}
            className="data-[state=open]:bg-transparent focus:bg-transparent text-lg font-bold mx-0 px-0"
          >
            <div className=" flex space-x-3 items-center ">
              <p className="font-medium">{options[selectedOption]}</p>
              {!chevron ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
            </div>
          </MenubarTrigger>
          <MenubarContent>
            {options.map((op, idx) => (
              <MenubarItem
                disabled={selectedOption == idx}
                onClick={() => {
                  setSelectedOption(idx);
                  setExpiresIn(seconds[idx].toString());
                }}
              >
                <div className="flex space-x-2 items-center">
                  <p className="font-semibold text-lg">{options[idx]}</p>
                </div>
              </MenubarItem>
            ))}
          </MenubarContent>
        </MenubarMenu>
      </Menubar>
    </div>
  );
}
