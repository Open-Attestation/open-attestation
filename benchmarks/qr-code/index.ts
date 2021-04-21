import QrCode from "qrcode";
import { wrapDocument } from "../../src/index";
import { encode as cborEncode } from "cbor";
import { gzipSync } from "zlib";

type IOverload = {
  (field: string, defaultValue: string): string;
  (field: string, defaultValue: number): number;
};
/**
 * return value from argument. It looks for an existing key, prepended with -- and return the following value associated
 * otherwise return the default value
 */
const getArgument: IOverload = (field: string, defaultValue: any): any => {
  const index = process.argv.findIndex((value) => value === `--${field}`);
  if (index !== -1) {
    const value = process.argv[index + 1];
    if (typeof defaultValue === "number") return parseFloat(value);
    return value;
  }
  return defaultValue;
};

/**
 * Utility function to generate string for a predefined size
 */
const latinCharacters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789 ";
const chineseCharacters =
  "的一不是了人我在有他這中大來上國個到說們為子和你地出道也時年得就那要下以生會自著去之過家學對可她裡后 一二三四五六七八九十";
function makeString(length: number, characters: string) {
  const result = [];
  const charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    result.push(characters.charAt(Math.floor(Math.random() * charactersLength)));
  }
  return result.join("");
}

/**
 * Minimum set of data for oa document. $template is not mandatory, but it's a key feature and widely used
 */
const data: any = {
  id: "SERIAL_NUMBER_123",
  $template: {
    name: "CUSTOM_TEMPLATE",
    type: "EMBEDDED_RENDERER",
    url: "https://localhost:3000/renderer",
  },
  issuers: [
    {
      name: "DEMO STORE",
      documentStore: "0x9178F546D3FF57D7A6352bD61B80cCCD46199C2d",
      identityProof: {
        type: "DNS-TXT",
        location: "tradetrust.io",
      },
    },
  ],
};

/**
 * wrap a document and automatically the fields with random data. data can contain any characters provided as an argument.
 * Two pre-defined sets of characters exist, one with latin characters, one with chinese characters.
 * the fields name is always using the latin characters set.
 * every field name is 8 characters length, and every value is 20 characters length.
 */
const wrap = (fields: number, characters: string) => {
  const clonedData = { ...data };
  for (let i = 1; i <= fields; i++) {
    clonedData[`${makeString(8, latinCharacters)}${i}`] = makeString(getArgument("field-length", 20), characters);
  }
  return wrapDocument(clonedData);
};

/**
 * a method must implement a transformer function, that will transform an open attestation document, into a buffer
 * any new method can be added, as long as it returns a buffer and is synchronous (for the moment)
 */
type Method = {
  name: string;
  transformer: (doc: Record<string, any>) => Buffer;
  result?: { content: Buffer; fields: number; done: boolean };
};
const methods: Method[] = [
  {
    name: "stringify",
    transformer: (doc) => Buffer.from(JSON.stringify(doc), "utf8"),
  },
  {
    name: "cbor",
    transformer: (doc) => cborEncode(doc),
  },
  {
    name: "gzip",
    transformer: (doc) => gzipSync(JSON.stringify(doc)),
  },
  {
    name: "cbor + gzip",
    transformer: (doc) => gzipSync(cborEncode(doc)),
  },
];

// maximum number of byte that a Medium QR code can hold (https://www.npmjs.com/package/qrcode#error-correction-level)
const maxByteLength = 2331;
let fields = 1;

/**
 * let's run the method and gather the results
 */
// my code, my mutation. I do what I want :)
methods.map((method) => (method.result = { content: Buffer.from([]), fields, done: false }));
while (methods.find((method) => !method.result?.done)) {
  const doc = wrap(fields, getArgument("set", "latin") === "chinese" ? chineseCharacters : latinCharacters);
  methods
    .filter((method) => !method.result?.done)
    .forEach((method) => {
      const result = method.transformer(doc);
      if (result.byteLength <= maxByteLength) {
        method.result = { content: result, fields, done: false };
      } else {
        // I know what I do, shut up
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        method.result!.done = true;
      }
    });
  fields++;
}

console.table(
  methods.map((method) => {
    return {
      name: method.name,
      additionalFields: method.result?.fields,
    };
  })
);

console.log(
  "iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAACXBIWXMAAA7EAAAOxAGVKw4bAAAFQklEQVRYhbWWfWzdZRXHP+fcciUNaYxpkBSCS0NMqRCkv4rEBFad4qiCvAwIIQ6Hb9u6UdZVtzEdbqWbe2FbHd0Lb8YQFGQSmONFJ8EsaJx4Z3jJmGRZloUQg81MjLnR2nu+/vHrvf3dtrfrKp7kyU1+v+f5nc/5nu/z3Mc4TWh3W6tgAPgcsqMmltniwq9Pt266YTUT70rqBauBXqR8+jCdbtKTki33pYX3/i8AMZjMNTQI1pwmFmh0ugAE4h/IVgke8nsKIx8IgB5MmoAB0DxlEhoqIo6AzZJoNIQEyDD4k8S3fXnh8EwAHEA7krrY0Xa3xNsK5imAytAjyD5m3Yc/RXA+wSqVKJbfK2gn9FpsSgZiY9JwxgpoILkQ9AtBe0ViCbC3DBbZssKr4xdpS9IsaQeyzkxLAHsPcbuvKhycvgJiD0G7BVgJLCgiVphIJksOYL2F4xZ2nQU3W/CuBYyOJgueal685QoWPtw0LQVia/Jvk/JpIXbCYI71Fo5PtwKtTxoQTyNdo9QTdA51PvPif2bNJZdbi/t2BuYP11YgqFMAJSDoPpPkAHZy4T9v+9vnBxWMEKASnGVRh1k9ZhtxL9D7s8/UBkgTQyrhb88kOUt+3Ir7Kz//10WbKfFOxbgYWGVcgtnvWPn0w6x+5iMTADK9h9D09nPPE/Xc8/gG3P+M+9W45y0YLnvh0typVzB7IQMBZt/A7C/ct28+6/Z7BUBj2yltw+niu0914v4m7itxz+MO7pTlJ6Avf+j35HLX4X4t7scrc9wbcf8JnnuZ9b9qgdQDZDwwdaza24f787g3Zz76Pu6rqwoJYPtXg613vITZpZitx2w4o0YH7q+z6eXOKg9MCfD9Z88jl7s3kxjcH8H9Yn5050+t/J3xhWy6rciGeasxuxyzgxmIPO6bPbOHpwZIq/ZK8lxuBVtu/yZb7zgFlE1c+zt9NxzBfQ5m+zMQF3lZ/vS35p8jVZXncqdw3171PuOBmoWs+dII7vdlzelVfQs+XhMglysnB/cT9N9UOVyiu+1sBbOmZWb3Y9lixjyQ/q5Vb1JXU4EyhHtVjSbrocSHJ/XA+DCLKgUseCfTu+sRB9STtEwKMNaCtPIlbY1akjxKqD/jpRGCE1MAML4F36FkwxkvdBB6Xd1Jf9yd1E8K4E50tc1H9raCuypbMF3f5zsL79cEcK8GsAcK+xGXW3Aws5fzCt2LeFNLkrnqSpxcjspID54+SjQyBn4M8UXfXVg3RQPKLSiOKQDYtsIRZJ+1YAElhjLnQrOCFwmeW/P3A1dWqTA2Z9jE/Sa7zPdM47K6vKOI+ydwfwH3iXdCdSWNSBsRd5UvoUjsbfjkvlvOX3A9ESC9oaM952B2ElhkDxWOnjbx+Bj8g+P+ZR//3AYLQ7bz8NcVdhXBWwpGb0mW9UDL3obLlgJzZpQcoOvKYNEV+yYAlMP3FF4VJMAKYcWzKI1kPJC/5YIFS+3ibefMKHkmpjj6xiK+lTQd/dBHL2ht/cEviTiXCEZb8S5SN9Kz9MyuvfvXPJdHaqHvhjdmBFCJ3a91ID1BRBMSGZD9SEvpmX1iwpp1z19NxC4iWol4DFjB/TcOzQwghWhA6kdaTIRnIIpErAW2s7xjmB8eaCRiMxFfq8xJxzGkT9N/06mZAZRj1x/bkXYR0V6lRsQQ0kkiWoioH5f8SSKWse4rf525AlUQh+oQC5H6iWjIqMGEqiO6+N61E86J/w2gHDsPNSFtQ7p1XOJhIjYRsYGVXyhOtvSDAUghHOkapAdG5f8NEd30zJ7ynPgvLYfBNZQlTZAAAAAASUVORK5CYII="
    .length
);
console.log(
  Buffer.from(
    "iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAACXBIWXMAAA7EAAAOxAGVKw4bAAAFQklEQVRYhbWWfWzdZRXHP+fcciUNaYxpkBSCS0NMqRCkv4rEBFad4qiCvAwIIQ6Hb9u6UdZVtzEdbqWbe2FbHd0Lb8YQFGQSmONFJ8EsaJx4Z3jJmGRZloUQg81MjLnR2nu+/vHrvf3dtrfrKp7kyU1+v+f5nc/5nu/z3Mc4TWh3W6tgAPgcsqMmltniwq9Pt266YTUT70rqBauBXqR8+jCdbtKTki33pYX3/i8AMZjMNTQI1pwmFmh0ugAE4h/IVgke8nsKIx8IgB5MmoAB0DxlEhoqIo6AzZJoNIQEyDD4k8S3fXnh8EwAHEA7krrY0Xa3xNsK5imAytAjyD5m3Yc/RXA+wSqVKJbfK2gn9FpsSgZiY9JwxgpoILkQ9AtBe0ViCbC3DBbZssKr4xdpS9IsaQeyzkxLAHsPcbuvKhycvgJiD0G7BVgJLCgiVphIJksOYL2F4xZ2nQU3W/CuBYyOJgueal685QoWPtw0LQVia/Jvk/JpIXbCYI71Fo5PtwKtTxoQTyNdo9QTdA51PvPif2bNJZdbi/t2BuYP11YgqFMAJSDoPpPkAHZy4T9v+9vnBxWMEKASnGVRh1k9ZhtxL9D7s8/UBkgTQyrhb88kOUt+3Ir7Kz//10WbKfFOxbgYWGVcgtnvWPn0w6x+5iMTADK9h9D09nPPE/Xc8/gG3P+M+9W45y0YLnvh0typVzB7IQMBZt/A7C/ct28+6/Z7BUBj2yltw+niu0914v4m7itxz+MO7pTlJ6Avf+j35HLX4X4t7scrc9wbcf8JnnuZ9b9qgdQDZDwwdaza24f787g3Zz76Pu6rqwoJYPtXg613vITZpZitx2w4o0YH7q+z6eXOKg9MCfD9Z88jl7s3kxjcH8H9Yn5050+t/J3xhWy6rciGeasxuxyzgxmIPO6bPbOHpwZIq/ZK8lxuBVtu/yZb7zgFlE1c+zt9NxzBfQ5m+zMQF3lZ/vS35p8jVZXncqdw3171PuOBmoWs+dII7vdlzelVfQs+XhMglysnB/cT9N9UOVyiu+1sBbOmZWb3Y9lixjyQ/q5Vb1JXU4EyhHtVjSbrocSHJ/XA+DCLKgUseCfTu+sRB9STtEwKMNaCtPIlbY1akjxKqD/jpRGCE1MAML4F36FkwxkvdBB6Xd1Jf9yd1E8K4E50tc1H9raCuypbMF3f5zsL79cEcK8GsAcK+xGXW3Aws5fzCt2LeFNLkrnqSpxcjspID54+SjQyBn4M8UXfXVg3RQPKLSiOKQDYtsIRZJ+1YAElhjLnQrOCFwmeW/P3A1dWqTA2Z9jE/Sa7zPdM47K6vKOI+ydwfwH3iXdCdSWNSBsRd5UvoUjsbfjkvlvOX3A9ESC9oaM952B2ElhkDxWOnjbx+Bj8g+P+ZR//3AYLQ7bz8NcVdhXBWwpGb0mW9UDL3obLlgJzZpQcoOvKYNEV+yYAlMP3FF4VJMAKYcWzKI1kPJC/5YIFS+3ibefMKHkmpjj6xiK+lTQd/dBHL2ht/cEviTiXCEZb8S5SN9Kz9MyuvfvXPJdHaqHvhjdmBFCJ3a91ID1BRBMSGZD9SEvpmX1iwpp1z19NxC4iWol4DFjB/TcOzQwghWhA6kdaTIRnIIpErAW2s7xjmB8eaCRiMxFfq8xJxzGkT9N/06mZAZRj1x/bkXYR0V6lRsQQ0kkiWoioH5f8SSKWse4rf525AlUQh+oQC5H6iWjIqMGEqiO6+N61E86J/w2gHDsPNSFtQ7p1XOJhIjYRsYGVXyhOtvSDAUghHOkapAdG5f8NEd30zJ7ynPgvLYfBNZQlTZAAAAAASUVORK5CYII="
  ).byteLength
);

// make sure it works :)
for (const method of methods) {
  QrCode.toString(
    // eslint-disable-next-line @typescript-eslint/no-non-null-asserted-optional-chain,@typescript-eslint/no-non-null-assertion
    [{ data: method.result?.content!, mode: "byte" }],
    {
      errorCorrectionLevel: "M",
    },
    (err) => {
      if (err) throw err;
      console.log(`qr code for ${method.name} generated successfully`);
    }
  );
}
