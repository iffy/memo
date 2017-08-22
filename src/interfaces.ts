export interface Paragraph {
  label?: string;
  text: string;
}
export interface Memorizeable {
  ref: string,
  paras: Paragraph[],
}