export type PermissionedMarkets = {
  "version": "0.1.0",
  "name": "permissioned_markets",
  "instructions": [],
  "accounts": [
    {
      "name": "empty",
      "type": {
        "kind": "struct",
        "fields": []
      }
    }
  ],
  "errors": [
    {
      "code": 6000,
      "name": "InvalidAuth",
      "msg": "Invalid auth token provided"
    },
    {
      "code": 6001,
      "name": "TokenNotRevoked",
      "msg": "Auth token not revoked"
    },
    {
      "code": 6002,
      "name": "MissingRequiredCpiAccounts",
      "msg": "Required cpi accounts and variables not found"
    }
  ]
};

export const IDL: PermissionedMarkets = {
  "version": "0.1.0",
  "name": "permissioned_markets",
  "instructions": [],
  "accounts": [
    {
      "name": "empty",
      "type": {
        "kind": "struct",
        "fields": []
      }
    }
  ],
  "errors": [
    {
      "code": 6000,
      "name": "InvalidAuth",
      "msg": "Invalid auth token provided"
    },
    {
      "code": 6001,
      "name": "TokenNotRevoked",
      "msg": "Auth token not revoked"
    },
    {
      "code": 6002,
      "name": "MissingRequiredCpiAccounts",
      "msg": "Required cpi accounts and variables not found"
    }
  ]
};
