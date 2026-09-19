export type CarouselPiece = {
  type: "carousel";
  title: string;
  images: string[];
  width: number;
  height: number;
  description?: string;
};

export type LinkPiece = {
  type: "link";
  title: string;
  url: string;
  image: string;
  width: number;
  height: number;
};

export type Piece = CarouselPiece | LinkPiece;
