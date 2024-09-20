import Image from "next/image";

export default function MissionTwoDescription() {
  return (
    <div>
      <div className="px-4">
        {" "}
        <p className="text-xs ">Mission Two</p>
        <p className="text-xl font-semibold">Is your Baddie alive?</p>
      </div>

      <div className="flex items-center bg-secondary px-4 my-3 py-2">
        <Image src={"/chars/2.png"} width={200} height={200} alt="1inch" />
        <p className="text-md mx-10">
          Sigma, you need to goon harder to find your girl. Start a limit order
          and sell your WETH for exactly 4.5 USDT in Gnosis Chain to find the
          skibidi coffin.
        </p>
      </div>
      <div className="px-4">
        <p className="text-md font-semibold my-2">Quick Tips 💡</p>
        <div className="flex flex-col space-y-2 px-2">
          {" "}
          <li className="text-sm">
            You need to perform a Limit order to swap your WETH to exactly 4.5
            USDT. You can do it by editing the Pay {"<token>"} at rate field.
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
