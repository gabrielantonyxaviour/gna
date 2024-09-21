import { SignProtocolClient, SpMode, EvmChains } from "@ethsign/sp-sdk";
import { privateKeyToAccount } from "viem/accounts";
import { Request, Response, route } from './httpSupport';
import { SDK, NetworkEnum } from "@1inch/cross-chain-sdk";


// Your private key
const privateKey: `0x${string}` = "xxxxxxxxxxxxxxxxxxxxxx";
const client = new SignProtocolClient(SpMode.OnChain, {
  chain: EvmChains.gnosisChiado,
  account: privateKeyToAccount(privateKey),
});

const chatHistories: { [sessionId: string]: { role: string, content: string }[] } = {};

interface SchemaResult {
  schemaId: string;
  txHash?: string;
}

interface AttestationResult {
  attestationId: string;
  txHash?: string;
  indexingValue?: string;
}

// Create schema function
async function createSchema(): Promise<SchemaResult> {
  try {
    const res = await client.createSchema({
      name: "SDK Test",
      data: [
        { name: "response", type: "string" },
      ],
    });
    console.log("Schema created:", res);
    return {
      schemaId: res.schemaId,
      txHash: res.txHash || 'Transaction hash not available'
    };
  } catch (error) {
    console.error("Error creating schema:", error);
    throw error;
  }
}

// Create attestation function
async function createNotaryAttestation(schemaId: string, contractDetails: string, signer: string): Promise<AttestationResult> {
  try {
    const formattedSigner: `0x${string}` = signer as `0x${string}`;

    const res = await client.createAttestation({
      schemaId: schemaId,
      data: {
        response: contractDetails,
      },
      indexingValue: formattedSigner.toLowerCase(),
    });

    console.log("Attestation created:", res);
    return {
      attestationId: res.attestationId,
      txHash: res.txHash || 'Transaction hash not available',
      indexingValue: res.indexingValue || 'Indexing value not available'
    };
  } catch (error) {
    console.error("Error creating attestation:", error);
    throw error;
  }
}

// Modified run function to only execute if "Approved" is present
async function run(address: string, isApproved: boolean): Promise<{ schema?: SchemaResult, attestation?: AttestationResult }> {
  if (!isApproved) {
    // Return empty values if not approved
    return { schema: undefined, attestation: undefined };
  }
  try {
    const schema = await createSchema();
    const attestation = await createNotaryAttestation(schema.schemaId, "Example response string", address);
    return { schema, attestation };
  } catch (error) {
    console.error("Error in run function:", error);
    throw error;
  }
}

// GET function (modified to check if response contains "Approved")
async function GET(req: Request): Promise<Response> {
  const secrets = req.secret || {};
  const queries = req.queries;
  const apiKey = secrets.apiKey || 'sk-nypg8jmdw5GgFVRN3MzHGmMhBxxSXpQiwy4wGqVBEa1vL79W';

  const model = queries.model ? queries.model[0] : 'gpt-4o';
  const chatQuery = queries.chatQuery ? queries.chatQuery[0] : 'Who are you?';
  const sessionId = queries.sessionId ? queries.sessionId[0] : 'default';
  
  const address = queries.address ? queries.address[0] : null;
  if (!address) {
    return new Response(JSON.stringify({ error: 'Address is required' }), { status: 400 });
  }

  let result: any = {};

  if (!chatHistories[sessionId]) {
    chatHistories[sessionId] = [
      {
        role: "system",
        content: `Your role is Data Analysis. Don't talk anything other than what you're supposed to and NEVER EVER do anything else.
                  1.)IMPORTANT: You will receive a JSON response. Your job is to ANALYZE THE DATA and check the orderHash, srcChainId, dstChainId, makerAsset, takerAsset and makerAmount.
                  2.)The orderHash should be 0x51a309887cbee97da50cdbbb93cd64ab646d85ae6e52274daf97919a03371f29
                  3.)The srcChainId should be 8453
                  4.)The dstChainId should be 100
                  5.)The maker asset should be 0xc5fecc3a29fb57b5024eec8a2239d4621e111cbe.
                  6.)If ALL these conditions are met, send a message saying "Approved" followed by a congragulating statement.
                  7.)If EVEN ONE of these conditions are not met, say "Disapproved, and tell the user what value is wrong"
                  8.)This is how the JSON input MIGHT look
                  EXAMPLE: meta: { totalItems: 4, currentPage: 1, itemsPerPage: 100, totalPages: 1 },
  items: [
    {
      orderHash: '0x51a309887cbee97da50cdbbb93cd64ab646d85ae6e52274daf97919a03371f29',
      deadline: 1726842985000,
      srcChainId: 8453,
      dstChainId: 100,
      makerAsset: '0xc5fecc3a29fb57b5024eec8a2239d4621e111cbe',
      takerAsset: '0xe91d153e0b41518a2ce8dd3d7944fa863463a97d',
      makerAmount: '55000000000000000000',
      minTakerAmount: '14738778945033217220',
      createdAt: 1726842797241,
      auctionStartDate: 1726842793,
      remainingMakerAmount: '0',
      validation: 'valid',
      fills: [Array],
      approximateTakingAmount: '14810450679287124748',
      auctionDuration: 180,
      initialRateBump: 50325,
      status: 'executed',
      cancelTx: null,
      points: null,
      order: [Object],
      extension: '0x00000119000000540000005400000054000000540000002a0000000000000000a7bcb4eac8964306f9e3764f67db6a7af6ddf99a0000000000000066ed87a90000b400c49500612c0078a7bcb4eac8964306f9e3764f67db6a7af6ddf99a0000000000000066ed87a90000b400c49500612c0078a7bcb4eac8964306f9e3764f67db6a7af6ddf99a66ed879872f8a0c8c415454f629c0000086911bb229222662c5260c4c07effaa4e9eae3b5301a66d80a3231387ebc31d2a0000000000000000000000000000000000000000000000000000000000000064000000000000000000000000e91d153e0b41518a2ce8dd3d7944fa863463a97d0000000000000000000002c98c3ba0800000000000000000000199ae8f8359e00000000000000150000000d80000002400000228000001b0000001140000003c',
      timeLocks: '0x150000000d80000002400000228000001b0000001140000003c',
      cancelable: false
    }`
      }
    ];
  }

  let fusionResult = '';
  try {
    const sdk = new SDK({
      url: "https://api.1inch.dev/fusion-plus",
     
      authKey: "xxxxxxxxxxxxxxxxx"
    });

    const orders = await sdk.getOrdersByMaker({
      page: 1,
      limit: 1,
      address: address
    });

    fusionResult = JSON.stringify(orders, null, 2);
  } catch (error) {
    console.error("Error fetching orders:", error);
    result.message = "Error fetching orders from 1inch API.";
    return new Response(JSON.stringify(result));
  }

  chatHistories[sessionId].push({
    role: "user",
    content: `Fusion SDK Response: ${fusionResult}`
  });

  chatHistories[sessionId].push({
    role: "user",
    content: chatQuery
  });

  try {
    const response = await fetch('https://api.red-pill.ai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        messages: chatHistories[sessionId],
        model: model,
        n: 1,
        temperature: 1,
        max_tokens: 500
      })
    });

    const responseData = await response.json();

    const messageContent = responseData.choices[0].message?.content;
    const isApproved = messageContent && messageContent.includes("Approved");

    if (messageContent) {
      chatHistories[sessionId].push({
        role: "assistant",
        content: messageContent
      });

      result.message = messageContent;

      if (chatHistories[sessionId].length > 11) {
        chatHistories[sessionId] = [
          chatHistories[sessionId][0],
          ...chatHistories[sessionId].slice(-10)
        ];
      }

      // Run schema and attestation only if "Approved" is present
      const { schema, attestation } = await run(address, isApproved);

      // Add schema and attestation info to the result if approved
      result.schema = schema || {};
      result.attestation = attestation || {};

    } else if (responseData.error) {
      result.message = responseData.error.message || "An error occurred";
    } else {
      result.message = "Unexpected response format";
    }
  } catch (error) {
    console.error('Error:', error);
    result.message = "An error occurred while processing the request";
  }

  return new Response(JSON.stringify(result));
}

// POST function (not implemented yet)
async function POST(req: Request): Promise<Response> {
  return new Response(JSON.stringify({ message: 'POST Not Implemented' }));
}

// OPTIONS function
async function OPTIONS(req: Request): Promise<Response> {
  return new Response(JSON.stringify({ message: 'OPTIONS' }));
}

// Main function to route requests
export default async function main(request: string) {
  return await route({ GET, POST, OPTIONS }, request);
}
