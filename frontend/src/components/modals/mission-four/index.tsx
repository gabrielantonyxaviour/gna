import Image from "next/image";

export default function MissionFourDescription() {
  return (
    <div>
      <div className="px-4">
        <p className="text-xs ">Mission Four</p>
        <p className="text-xl font-semibold">Kai Cenat Face Off</p>
      </div>

      <div className="flex items-center bg-secondary px-4 my-3 py-2">
        <Image src={`/chars/4.png`} width={200} height={200} alt="1inch" />
        <p className="text-md mx-10">
          Your 1inch rizz is not enough to mog me, rookie rizzler. You need to
          do a crosschain swap your assets to ETH on Mainnet if you want your
          Baddie back.
        </p>
      </div>
      <div className="px-4">
        <p className="text-md font-semibold my-2">Quick Tips 💡</p>
        <div className="flex flex-col space-y-2 px-2">
          <li className="text-sm">
            Use 1inch Fusion+ to perform a crosschain swap and convert your xDAI
            from Gnois Chain to ETH on Mainnet.
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
