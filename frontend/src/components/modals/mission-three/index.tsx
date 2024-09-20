import Image from "next/image";

export default function MissionThreeDescription() {
  return (
    <div>
      <div className="px-4">
        <p className="text-xs ">Mission Three</p>
        <p className="text-xl font-semibold">Surrounded by L Anons</p>
      </div>

      <div className="flex items-center bg-secondary px-4 my-3 py-2">
        <Image src={`/chars/3.png`} width={200} height={200} alt="1inch" />
        <p className="text-md mx-10">
          Stop lookmaxxing right now. You cannot beat us Alphas if you don't
          swap all your tokens to xDAI in Gnosis Chain within 4 minutes and
          defuse the bomb.
        </p>
      </div>
      <div className="px-4">
        <p className="text-md font-semibold my-2">Quick Tips 💡</p>
        <div className="flex flex-col space-y-2 px-2">
          {" "}
          <li className="text-sm">
            You need to choose the fast and efficient swapping technique to
            complete the swap as soon as possible.
          </li>
          <li className="text-sm">
            Choose the right token by clicking the token dropdown.
          </li>
          <li className="text-sm">
            Click on the Help button and tap on anything that you don't
            understand to get Nakamura's aid.
          </li>
        </div>
      </div>
    </div>
  );
}
