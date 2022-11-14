export const abi = {
  entrys: [
    { stateMutability: "Nonpayable", type: "Constructor" },
    {
      inputs: [
        { indexed: true, name: "owner", type: "address" },
        { indexed: true, name: "approved", type: "address" },
        { indexed: true, name: "tokenId", type: "uint256" },
      ],
      name: "Approval",
      type: "Event",
    },
    {
      inputs: [
        { indexed: true, name: "owner", type: "address" },
        { indexed: true, name: "operator", type: "address" },
        { name: "approved", type: "bool" },
      ],
      name: "ApprovalForAll",
      type: "Event",
    },
    {
      inputs: [{ indexed: true, name: "account", type: "address" }],
      name: "MinterAdded",
      type: "Event",
    },
    {
      inputs: [{ indexed: true, name: "account", type: "address" }],
      name: "MinterRemoved",
      type: "Event",
    },
    {
      inputs: [
        { indexed: true, name: "from", type: "address" },
        { indexed: true, name: "to", type: "address" },
        { indexed: true, name: "tokenId", type: "uint256" },
      ],
      name: "Transfer",
      type: "Event",
    },
    {
      inputs: [{ name: "account", type: "address" }],
      name: "addMinter",
      stateMutability: "Nonpayable",
      type: "Function",
    },
    {
      inputs: [
        { name: "to", type: "address" },
        { name: "tokenId", type: "uint256" },
      ],
      name: "approve",
      stateMutability: "Nonpayable",
      type: "Function",
    },
    {
      outputs: [{ type: "uint256" }],
      inputs: [{ name: "owner", type: "address" }],
      name: "balanceOf",
      stateMutability: "View",
      type: "Function",
    },
    {
      outputs: [{ type: "string" }],
      name: "baseURI",
      stateMutability: "View",
      type: "Function",
    },
    {
      outputs: [{ type: "address" }],
      inputs: [{ name: "tokenId", type: "uint256" }],
      name: "getApproved",
      stateMutability: "View",
      type: "Function",
    },
    {
      outputs: [{ type: "bool" }],
      inputs: [
        { name: "owner", type: "address" },
        { name: "operator", type: "address" },
      ],
      name: "isApprovedForAll",
      stateMutability: "View",
      type: "Function",
    },
    {
      outputs: [{ type: "bool" }],
      inputs: [{ name: "account", type: "address" }],
      name: "isMinter",
      stateMutability: "View",
      type: "Function",
    },
    {
      outputs: [{ type: "bool" }],
      inputs: [
        { name: "to", type: "address" },
        { name: "tokenId", type: "uint256" },
        { name: "tokenURI", type: "string" },
      ],
      name: "mintWithTokenURI",
      stateMutability: "Nonpayable",
      type: "Function",
    },
    {
      outputs: [{ type: "string" }],
      name: "name",
      stateMutability: "View",
      type: "Function",
    },
    {
      outputs: [{ type: "address" }],
      inputs: [{ name: "tokenId", type: "uint256" }],
      name: "ownerOf",
      stateMutability: "View",
      type: "Function",
    },
    {
      name: "renounceMinter",
      stateMutability: "Nonpayable",
      type: "Function",
    },
    {
      inputs: [
        { name: "from", type: "address" },
        { name: "to", type: "address" },
        { name: "tokenId", type: "uint256" },
      ],
      name: "safeTransferFrom",
      stateMutability: "Nonpayable",
      type: "Function",
    },
    {
      inputs: [
        { name: "from", type: "address" },
        { name: "to", type: "address" },
        { name: "tokenId", type: "uint256" },
        { name: "_data", type: "bytes" },
      ],
      name: "safeTransferFrom",
      stateMutability: "Nonpayable",
      type: "Function",
    },
    {
      inputs: [
        { name: "to", type: "address" },
        { name: "approved", type: "bool" },
      ],
      name: "setApprovalForAll",
      stateMutability: "Nonpayable",
      type: "Function",
    },
    {
      outputs: [{ type: "bool" }],
      inputs: [{ name: "interfaceId", type: "bytes4" }],
      name: "supportsInterface",
      stateMutability: "View",
      type: "Function",
    },
    {
      outputs: [{ type: "string" }],
      name: "symbol",
      stateMutability: "View",
      type: "Function",
    },
    {
      outputs: [{ type: "string" }],
      inputs: [{ name: "tokenId", type: "uint256" }],
      name: "tokenURI",
      stateMutability: "View",
      type: "Function",
    },
    {
      inputs: [
        { name: "from", type: "address" },
        { name: "to", type: "address" },
        { name: "tokenId", type: "uint256" },
      ],
      name: "transferFrom",
      stateMutability: "Nonpayable",
      type: "Function",
    },
  ],
};
