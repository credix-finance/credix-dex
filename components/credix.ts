export type Credix = {
  "version": "0.1.0",
  "name": "credix",
  "instructions": [
    {
      "name": "initializeMarket",
      "accounts": [
        {
          "name": "owner",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "gatekeeperNetwork",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "globalMarketState",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "signingAuthority",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "liquidityPoolTokenAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "lpTokenMintAccount",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "baseMintAccount",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "associatedTokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "rent",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "signingAuthorityBump",
          "type": "u8"
        },
        {
          "name": "globalMarketStateBump",
          "type": "u8"
        },
        {
          "name": "globalMarketSeed",
          "type": "string"
        }
      ]
    },
    {
      "name": "depositFunds",
      "accounts": [
        {
          "name": "investor",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "gatewayToken",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "globalMarketState",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "signingAuthority",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "investorTokenAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "liquidityPoolTokenAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "lpTokenMintAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "investorLpTokenAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "credixPass",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "baseMintAccount",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "associatedTokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "rent",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "amount",
          "type": "u64"
        }
      ]
    },
    {
      "name": "createCredixPass",
      "accounts": [
        {
          "name": "owner",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "passHolder",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "credixPass",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "globalMarketState",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "rent",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "passBump",
          "type": "u8"
        },
        {
          "name": "isUnderwriter",
          "type": "bool"
        },
        {
          "name": "isBorrower",
          "type": "bool"
        }
      ]
    },
    {
      "name": "updateCredixPass",
      "accounts": [
        {
          "name": "owner",
          "isMut": false,
          "isSigner": true
        },
        {
          "name": "passHolder",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "credixPass",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "globalMarketState",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "isActive",
          "type": "bool"
        },
        {
          "name": "isUnderwriter",
          "type": "bool"
        },
        {
          "name": "isBorrower",
          "type": "bool"
        }
      ]
    },
    {
      "name": "freezeLpTokens",
      "accounts": [
        {
          "name": "credixPermissionedPda",
          "isMut": false,
          "isSigner": true
        },
        {
          "name": "lpHolder",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "credixPass",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "lpTokenAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "globalMarketState",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "signingAuthority",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "lpTokenMintAccount",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "associatedTokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "rent",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "gatewayToken",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": []
    },
    {
      "name": "thawLpTokens",
      "accounts": [
        {
          "name": "credixPermissionedPda",
          "isMut": false,
          "isSigner": true
        },
        {
          "name": "lpHolder",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "credixPass",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "lpTokenAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "globalMarketState",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "signingAuthority",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "lpTokenMintAccount",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "associatedTokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "rent",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "gatewayToken",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": []
    }
  ],
  "accounts": [
    {
      "name": "globalMarketState",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "gatekeeperNetwork",
            "type": "publicKey"
          },
          {
            "name": "liquidityPoolTokenMintAccount",
            "type": "publicKey"
          },
          {
            "name": "lpTokenMintAccount",
            "type": "publicKey"
          },
          {
            "name": "signingAuthorityBump",
            "type": "u8"
          },
          {
            "name": "bump",
            "type": "u8"
          }
        ]
      }
    },
    {
      "name": "credixPass",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "bump",
            "type": "u8"
          },
          {
            "name": "isBorrower",
            "type": "bool"
          },
          {
            "name": "isUnderwriter",
            "type": "bool"
          },
          {
            "name": "active",
            "type": "bool"
          }
        ]
      }
    }
  ],
  "errors": [
    {
      "code": 6000,
      "name": "NotEnoughLiquidity",
      "msg": "Not enough liquidity."
    },
    {
      "code": 6001,
      "name": "UnauthorizedSigner",
      "msg": "The Signer is not authorized to use this instruction."
    },
    {
      "code": 6002,
      "name": "CredixPassInvalid",
      "msg": "Credix pass is invalid for this request."
    },
    {
      "code": 6003,
      "name": "CredixPassInactive",
      "msg": "Credix pass is inactive at the moment."
    },
    {
      "code": 6004,
      "name": "Overflow",
      "msg": "Overflow occured."
    },
    {
      "code": 6005,
      "name": "Underflow",
      "msg": "Underflow occured."
    },
    {
      "code": 6006,
      "name": "ZeroDivision",
      "msg": "Tried to divide by zero."
    },
    {
      "code": 6007,
      "name": "ZeroDenominator",
      "msg": "Invalid Ratio: denominator can't be zero."
    },
    {
      "code": 6008,
      "name": "InvalidPreciseNumber",
      "msg": "Invalid u64 used as value for PreciseNumber."
    },
    {
      "code": 6009,
      "name": "PreciseNumberCastFailed",
      "msg": "Unable to cast PreciseNumber to u64"
    },
    {
      "code": 6010,
      "name": "NotEnoughLPTokens",
      "msg": "Not enough LP tokens."
    },
    {
      "code": 6011,
      "name": "NotEnoughBaseTokens",
      "msg": "Not enough Base tokens."
    }
  ]
};

export const IDL: Credix = {
  "version": "0.1.0",
  "name": "credix",
  "instructions": [
    {
      "name": "initializeMarket",
      "accounts": [
        {
          "name": "owner",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "gatekeeperNetwork",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "globalMarketState",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "signingAuthority",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "liquidityPoolTokenAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "lpTokenMintAccount",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "baseMintAccount",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "associatedTokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "rent",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "signingAuthorityBump",
          "type": "u8"
        },
        {
          "name": "globalMarketStateBump",
          "type": "u8"
        },
        {
          "name": "globalMarketSeed",
          "type": "string"
        }
      ]
    },
    {
      "name": "depositFunds",
      "accounts": [
        {
          "name": "investor",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "gatewayToken",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "globalMarketState",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "signingAuthority",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "investorTokenAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "liquidityPoolTokenAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "lpTokenMintAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "investorLpTokenAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "credixPass",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "baseMintAccount",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "associatedTokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "rent",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "amount",
          "type": "u64"
        }
      ]
    },
    {
      "name": "createCredixPass",
      "accounts": [
        {
          "name": "owner",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "passHolder",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "credixPass",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "globalMarketState",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "rent",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "passBump",
          "type": "u8"
        },
        {
          "name": "isUnderwriter",
          "type": "bool"
        },
        {
          "name": "isBorrower",
          "type": "bool"
        }
      ]
    },
    {
      "name": "updateCredixPass",
      "accounts": [
        {
          "name": "owner",
          "isMut": false,
          "isSigner": true
        },
        {
          "name": "passHolder",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "credixPass",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "globalMarketState",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "isActive",
          "type": "bool"
        },
        {
          "name": "isUnderwriter",
          "type": "bool"
        },
        {
          "name": "isBorrower",
          "type": "bool"
        }
      ]
    },
    {
      "name": "freezeLpTokens",
      "accounts": [
        {
          "name": "credixPermissionedPda",
          "isMut": false,
          "isSigner": true
        },
        {
          "name": "lpHolder",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "credixPass",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "lpTokenAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "globalMarketState",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "signingAuthority",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "lpTokenMintAccount",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "associatedTokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "rent",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "gatewayToken",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": []
    },
    {
      "name": "thawLpTokens",
      "accounts": [
        {
          "name": "credixPermissionedPda",
          "isMut": false,
          "isSigner": true
        },
        {
          "name": "lpHolder",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "credixPass",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "lpTokenAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "globalMarketState",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "signingAuthority",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "lpTokenMintAccount",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "associatedTokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "rent",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "gatewayToken",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": []
    }
  ],
  "accounts": [
    {
      "name": "globalMarketState",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "gatekeeperNetwork",
            "type": "publicKey"
          },
          {
            "name": "liquidityPoolTokenMintAccount",
            "type": "publicKey"
          },
          {
            "name": "lpTokenMintAccount",
            "type": "publicKey"
          },
          {
            "name": "signingAuthorityBump",
            "type": "u8"
          },
          {
            "name": "bump",
            "type": "u8"
          }
        ]
      }
    },
    {
      "name": "credixPass",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "bump",
            "type": "u8"
          },
          {
            "name": "isBorrower",
            "type": "bool"
          },
          {
            "name": "isUnderwriter",
            "type": "bool"
          },
          {
            "name": "active",
            "type": "bool"
          }
        ]
      }
    }
  ],
  "errors": [
    {
      "code": 6000,
      "name": "NotEnoughLiquidity",
      "msg": "Not enough liquidity."
    },
    {
      "code": 6001,
      "name": "UnauthorizedSigner",
      "msg": "The Signer is not authorized to use this instruction."
    },
    {
      "code": 6002,
      "name": "CredixPassInvalid",
      "msg": "Credix pass is invalid for this request."
    },
    {
      "code": 6003,
      "name": "CredixPassInactive",
      "msg": "Credix pass is inactive at the moment."
    },
    {
      "code": 6004,
      "name": "Overflow",
      "msg": "Overflow occured."
    },
    {
      "code": 6005,
      "name": "Underflow",
      "msg": "Underflow occured."
    },
    {
      "code": 6006,
      "name": "ZeroDivision",
      "msg": "Tried to divide by zero."
    },
    {
      "code": 6007,
      "name": "ZeroDenominator",
      "msg": "Invalid Ratio: denominator can't be zero."
    },
    {
      "code": 6008,
      "name": "InvalidPreciseNumber",
      "msg": "Invalid u64 used as value for PreciseNumber."
    },
    {
      "code": 6009,
      "name": "PreciseNumberCastFailed",
      "msg": "Unable to cast PreciseNumber to u64"
    },
    {
      "code": 6010,
      "name": "NotEnoughLPTokens",
      "msg": "Not enough LP tokens."
    },
    {
      "code": 6011,
      "name": "NotEnoughBaseTokens",
      "msg": "Not enough Base tokens."
    }
  ]
};
