import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { Waves } from "lucide-react";

export default function Slippage({
  slippage,
  setSlippage,
}: {
  slippage: string;
  setSlippage: (slippage: string) => void;
}) {
  const [localSlippage, setLocalSlippage] = useState("");
  const [tabValue, setTabValue] = useState("0.1");
  return (
    <div className="">
      <div className="flex justify-between items-center  px-2 mt-4">
        <div className="flex items-center space-x-2">
          <Waves className="text-muted-foreground" />
          <p className="text-md font-semibold my-2">Slippage Tolerance</p>
        </div>
        <p>
          {tabValue != "auto" && localSlippage == "" && tabValue != "custom"
            ? tabValue
            : localSlippage != ""
            ? localSlippage
            : "Auto"}
        </p>
      </div>
      <Tabs
        defaultValue={tabValue}
        onValueChange={(value) => {
          setTabValue(value);
        }}
        className="w-full mb-4"
      >
        <TabsList className="w-full flex">
          <TabsTrigger
            value="auto"
            className="flex-1"
            onClick={() => {
              setSlippage("0.5");
              setLocalSlippage("");
            }}
          >
            Auto
          </TabsTrigger>
          <TabsTrigger
            value="0.1"
            className="flex-1"
            onClick={() => {
              setSlippage("0.1");
              setLocalSlippage("");
            }}
          >
            0.1%
          </TabsTrigger>
          <TabsTrigger
            value="0.5"
            className="flex-1"
            onClick={() => {
              setSlippage("0.5");
              setLocalSlippage("");
            }}
          >
            0.5%
          </TabsTrigger>
          <TabsTrigger
            value="1"
            className="flex-1"
            onClick={() => {
              setSlippage("1");
              setLocalSlippage("");
            }}
          >
            1%
          </TabsTrigger>
          <TabsTrigger value="custom" className="flex" onClick={() => {}}>
            <input
              className="m-0 p-0 w-[80px] border-none bg-transparent focus:bg-transparent focus:outline-none"
              value={localSlippage}
              placeholder="Custom"
              onChange={(e) => {
                const decimalRegex = /^\d+(\.\d*)?$/;
                if (
                  (decimalRegex.test(e.target.value) &&
                    parseFloat(e.target.value) <= 5) ||
                  e.target.value == ""
                ) {
                  setLocalSlippage(e.target.value);
                  setSlippage(e.target.value);
                  if (e.target.value != "") setTabValue("custom");
                  else setTabValue("auto");
                }
              }}
            />
          </TabsTrigger>
        </TabsList>
      </Tabs>
    </div>
  );
}
