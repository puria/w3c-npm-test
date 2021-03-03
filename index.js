const { execute } = require('@dyne/zencode-chain');

const unsigned = {"my-vc": {
  "@context": [
    "https://www.w3.org/2018/credentials/v1",
    "https://www.w3.org/2018/credentials/examples/v1"
  ],
  "id": "http://example.edu/credentials/1872",
  "type": ["VerifiableCredential", "AlumniCredential"],
  "issuer": "https://example.edu/issuers/565049",
  "issuanceDate": "2010-01-01T19:73:24Z",
  "credentialSubject": {
    "id": "did:example:ebfeb1f712ebc6f1c276e12ec21",
    "alumniOf": {
      "id": "did:example:c276e12ec21ebfeb1f712ebc6f1",
      "name": [{
        "value": "Example University",
        "lang": "en"
      }, {
        "value": "Exemple d'Université",
        "lang": "fr"
      }]
    }
  }
},
"pubkey_url": "https://dyne.org/marziano/keys/1"
}

const steps = {
  steps: [
    {
      id: "keypair",
      zencode: `
      Scenario 'ecdh': Create the keypair
Given that I am known as 'Alice'
When I create the keypair
Then print my data
      `,
    },
    {
      id: "pubkey",
      zencode: `Scenario 'ecdh': Publish the public key
Given that I am known as 'Alice'
and I have my 'keypair'
Then print my 'public key' from 'keypair'`,
      keysFromStep: 'keypair'
    },
    {
      id: "signed",
      zencode: `Scenario w3c
Scenario ecdh
Given that I am 'Alice'
and I have my 'keypair'
and I have a 'verifiable credential' named 'my-vc'
and I have a 'string' named 'pubkey url'
When I sign the verifiable credential named 'my-vc'
and I set the verification method in 'my-vc' to 'pubkey url'
Then print 'my-vc' as 'string'`,
      keysFromStep: 'keypair',
      data: JSON.stringify(unsigned)
    },
    {
      id: "last-step",
      zencode: `Scenario w3c
Scenario ecdh
Given that I am 'Alice'
and I have my 'public key'
and I have a 'verifiable credential' named 'my-vc'
When I verify the verifiable credential named 'my-vc'
Then print 'YES MOFOS'`,
      dataFromStep: 'signed',
      keysFromStep: 'pubkey'
    }
  ]
}

execute(steps).then((r) => console.log(r));

