export type Kind = "raw" | "wrapped" | "signed";
export type Mode = "strict" | "non-strict";
export type Diagnose = (props: { kind: Kind; document: any; debug: boolean; mode?: Mode }) => {
  message: string;
}[];
