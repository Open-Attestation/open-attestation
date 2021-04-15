# Purpose

The purpose of this benchmark is to demonstrate the capabilities of storage of OpenAttestation credentials inside QR code.

OpenAttestation credentials are naturally verbose. Before issuance, each field of the credential is prepared (a process known as wrapping), and a salt is added in front of the value. More information in [the documentation](https://www.openattestation.com/docs/how-does-it-work/document-integrity).

# Goal

The goal of the benchmark is just to give an overview of how many additional fields/data can be added into am OpenAttestation credential, before reaching the capacity limit of a QR code.

In this document, we will refer to additional fields, as fields that are not initially required in an OpenAttestation credential.

it is important to note that the result is just an overview and not the general truth. For instance, if the document states that it works for 13 additional fields, it's meant under specific conditions. You must **NOT** expect that it will always work with 13 additional fields. The input (size of the data, character set used) greatly impacts the result.

# Key decisions

We took some decisions to create this benchmark:

- OpenAttestation credentials expect to hold UTF-8 data. Thus, we can only use the [bytes mode](https://www.npmjs.com/package/qrcode#qr-code-capacity) to store data inside the Qr code
- We noticed that using the [L error correction level](https://www.npmjs.com/package/qrcode#error-correction-level) could produce an unreadable QR Code, especially when reaching the capacity limit. We decided to stick with the M error correction level.
- Based on the decision above, the QR Code capacity limit is 2331 bytes.
- All OpenAttestation credentials expect a minimum set of data to work. In this benchmark, we added information about `one` issuer and the template. While the template is not a mandatory field, it enables a key feature of OpenAttestation credential, decentralised rendering.
- We add additional fields at the root of the document and not inside nested object:
  - The keys use Latin character sets and are 9 characters in length.
  - The values use the provided character set (or Latin by default) and use the provided length (or 20 by default).
  - Keys and Values always have the same size.
  - Keys and values content is randomized to avoid gzip to perform to0 well
- We used the following strategies:
  - no compression (stringify the object)
  - [cbor](https://cbor.io/)
  - [gzip](https://www.gnu.org/software/gzip/)
  - cbor + gzip

# Arguments

- `--set chinese` to use `Chinese` characters. Otherwise, it will default to `Latin`.
- `--field-length 30` to use a different field length. Otherwise, it will default to `20`.

# Results

- `npm run benchmark:qr-code`

```bash
┌─────────┬───────────────┬──────────────────┐
│ (index) │     name      │ additionalFields │
├─────────┼───────────────┼──────────────────┤
│    0    │  'stringify'  │        17        │
│    1    │    'cbor'     │        19        │
│    2    │    'gzip'     │        33        │
│    3    │ 'cbor + gzip' │        34        │
└─────────┴───────────────┴──────────────────┘
```

- `npm run benchmark:qr-code -- --set chinese`

```bash
┌─────────┬───────────────┬──────────────────┐
│ (index) │     name      │ additionalFields │
├─────────┼───────────────┼──────────────────┤
│    0    │  'stringify'  │        11        │
│    1    │    'cbor'     │        12        │
│    2    │    'gzip'     │        22        │
│    3    │ 'cbor + gzip' │        23        │
└─────────┴───────────────┴──────────────────┘
```

# Additional Notes

- Sometimes, issuers need to add images into the certificate. Images can be added as base 64. However, most images will exceed the QR Code capacity size. Therefore, it is likely impossible to include any images in your OpenAttestation document if you need it to be fully offline transmissible via QR.
