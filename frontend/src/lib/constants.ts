import { zeroAddress } from "viem";
import { gnosis, mainnet } from "viem/chains";

export const COINMARKETCAP_IDS: Record<string, number> = {
  usdc: 3408,
  usdt: 825,
  eth: 1027,
  weth: 2396,
  xDai: 5601,
};

export const supportedcoins: Record<string, any> = {
  xdai: {
    name: "xDAI Stablecoin",
    symbol: "xDAI",
    image: "/coins/xdai.png",
  },
  wxdai: {
    name: "Wrapped xDAI",
    symbol: "WXDAI",
    image: "/coins/wxdai.png",
  },
  gnosis: {
    name: "Gnosis Chain",
    symbol: "GNO",
    image: "/coins/gnosis.png",
  },
  eth: {
    name: "Ethereum",
    symbol: "ETH",
    image: "/coins/eth.png",
  },

  weth: {
    name: "Wrapped Ethereum",
    symbol: "WETH",
    image: "/coins/weth.png",
  },

  usdc: {
    name: "USD Stablecoin",
    symbol: "USDC",
    image: "/coins/usdc.png",
  },
  usdt: {
    name: "Tether USD",
    symbol: "USDT",
    image: "/coins/usdt.png",
  },
};

export const supportedchains: Record<string, any> = {
  [gnosis.id]: {
    id: 1,
    name: "Gnosis Chain",
    chainId: gnosis.id,
    symbol: "xDAI",
    image: "/coins/gnosis.png",
    poolFactory: "0xBbF4E51Cfa0f681a4eBBC5E800b4f53507B00A5B",
    explorer: "https://gnosisscan.io/",
    tokens: {
      xdai: zeroAddress,
      wxdai: "0xe91D153E0b41518A2Ce8Dd3D7944Fa863463a97d".toLowerCase(),
      weth: "0x6a023ccd1ff6f2045c3309768ead9e68f978f6e1",
      usdc: "0xddafbb505ad214d7b80b1f830fccc89b60fb7a83",
      usdt: "0x4ecaba5870353805a9f068101a40e0f32ed605c6",
      gnosis: "0x9c58bacc331c9aa871afd802db6379a98e80cedb",
    },
    oneInch: "0x111111125421ca6dc452d289314280a0f8842a65",
  },
  [mainnet.id]: {
    id: 2,
    name: "Ethereum Mainnet",
    chainId: mainnet.id,
    symbol: "ETH",
    image: "/coins/eth.png",
    explorer: "https://etherscan.io",
    tokens: {
      eth: zeroAddress,
      weth: "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2",
      usdc: "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48",
      usdt: "0xdac17f958d2ee523a2206206994597c13d831ec7",
    },
  },
};

export const WRAPPED_ABI = [
  {
    constant: true,
    inputs: [],
    name: "name",
    outputs: [
      {
        name: "",
        type: "string",
      },
    ],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
  {
    constant: false,
    inputs: [
      {
        name: "guy",
        type: "address",
      },
      {
        name: "wad",
        type: "uint256",
      },
    ],
    name: "approve",
    outputs: [
      {
        name: "",
        type: "bool",
      },
    ],
    payable: false,
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    constant: true,
    inputs: [],
    name: "totalSupply",
    outputs: [
      {
        name: "",
        type: "uint256",
      },
    ],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
  {
    constant: false,
    inputs: [
      {
        name: "src",
        type: "address",
      },
      {
        name: "dst",
        type: "address",
      },
      {
        name: "wad",
        type: "uint256",
      },
    ],
    name: "transferFrom",
    outputs: [
      {
        name: "",
        type: "bool",
      },
    ],
    payable: false,
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    constant: false,
    inputs: [
      {
        name: "wad",
        type: "uint256",
      },
    ],
    name: "withdraw",
    outputs: [],
    payable: false,
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    constant: true,
    inputs: [],
    name: "decimals",
    outputs: [
      {
        name: "",
        type: "uint8",
      },
    ],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
  {
    constant: true,
    inputs: [
      {
        name: "",
        type: "address",
      },
    ],
    name: "balanceOf",
    outputs: [
      {
        name: "",
        type: "uint256",
      },
    ],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
  {
    constant: true,
    inputs: [],
    name: "symbol",
    outputs: [
      {
        name: "",
        type: "string",
      },
    ],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
  {
    constant: false,
    inputs: [
      {
        name: "dst",
        type: "address",
      },
      {
        name: "wad",
        type: "uint256",
      },
    ],
    name: "transfer",
    outputs: [
      {
        name: "",
        type: "bool",
      },
    ],
    payable: false,
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    constant: false,
    inputs: [],
    name: "deposit",
    outputs: [],
    payable: true,
    stateMutability: "payable",
    type: "function",
  },
  {
    constant: true,
    inputs: [
      {
        name: "",
        type: "address",
      },
      {
        name: "",
        type: "address",
      },
    ],
    name: "allowance",
    outputs: [
      {
        name: "",
        type: "uint256",
      },
    ],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
  {
    payable: true,
    stateMutability: "payable",
    type: "fallback",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        name: "src",
        type: "address",
      },
      {
        indexed: true,
        name: "guy",
        type: "address",
      },
      {
        indexed: false,
        name: "wad",
        type: "uint256",
      },
    ],
    name: "Approval",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        name: "src",
        type: "address",
      },
      {
        indexed: true,
        name: "dst",
        type: "address",
      },
      {
        indexed: false,
        name: "wad",
        type: "uint256",
      },
    ],
    name: "Transfer",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        name: "dst",
        type: "address",
      },
      {
        indexed: false,
        name: "wad",
        type: "uint256",
      },
    ],
    name: "Deposit",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        name: "src",
        type: "address",
      },
      {
        indexed: false,
        name: "wad",
        type: "uint256",
      },
    ],
    name: "Withdrawal",
    type: "event",
  },
];
