import { arbitrumSepolia, gnosis, mainnet } from "viem/chains";
import { http, createConfig } from "wagmi";

export const config = createConfig({
  chains: [mainnet, gnosis],
  transports: {
    [gnosis.id]: http(),
    [mainnet.id]: http(),
  },
});
