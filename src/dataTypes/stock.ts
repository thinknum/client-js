export interface IStockOverlayDataChunk {
  date: string;
  price: number;
}

export type IStockOverlayData = Array<IStockOverlayDataChunk>;
