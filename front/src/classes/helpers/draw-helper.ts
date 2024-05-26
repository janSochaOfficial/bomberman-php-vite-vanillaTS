import { gameSprite, position } from "../../types";
import spritesheet from "../../assets/Spritesheet.png";
import { positionHelper } from "..";
import { sprite_names, sprites } from "../../data";
import { ConstsHelper } from "./consts-helper";

export class DrawHelper {
  readonly ctx: CanvasRenderingContext2D;
  readonly img: HTMLImageElement;
  readonly canvasSize: position;
  imageReady = false;

  constructor(context: CanvasRenderingContext2D, imageLoad: () => void) {
    this.ctx = context;
    this.img = new Image();
    this.img.onload = () => {
      this.imageReady = true;
      imageLoad();
      this.prepareBoard();
    };
    this.img.src = spritesheet;
    this.canvasSize = positionHelper.calcCanvasScale(positionHelper.calcPostionInTiles({
      x: ConstsHelper.game_data!.canvasWidth,
      y: ConstsHelper.game_data!.canvasHeight,
    }));
    this.ctx.fillStyle = ConstsHelper.game_data!.backgroundColor;
  }

  drawAsset(asset: gameSprite) {
    if (!this.imageReady) {
      return;
    }

    this.ctx.drawImage(
      this.img,
      asset.sheetPostion.x,
      asset.sheetPostion.y,
      ConstsHelper.game_data!.tileSize,
      ConstsHelper.game_data!.tileSize,
      asset.canvasPosition.x,
      asset.canvasPosition.y,
      ConstsHelper.game_data!.tileSize * ConstsHelper.game_data!.canvasScale,
      ConstsHelper.game_data!.tileSize * ConstsHelper.game_data!.canvasScale
    );
  }

  drawSprite(sprite: sprite_names, pos: position, positionInTiles = true) {
    if (!this.imageReady) {
      return;
    }
    if (positionInTiles) {
      pos = positionHelper.calcPostionInTiles(pos);
    }

    pos = positionHelper.calcCanvasScale(pos);

    this.drawAsset({
      sheetPostion: sprites[sprite],
      canvasPosition: pos,
    });
  }

  prepareBoard() {
    this.clear();
  }

  clear() {
    this.ctx.fillRect(0, 0, this.canvasSize.x, this.canvasSize.y);
  }
}
