// import { game_data } from "./data/game_consts";
import { GameService } from "./classes";
import { ConstsHelper } from "./classes/helpers/consts-helper";
import { DrawHelper } from "./classes/helpers/draw-helper";
import { initSprites } from "./data";

const constPromise = ConstsHelper.initValues();

window.onload = async () => {
  await constPromise;
  initSprites();

  const game_data = ConstsHelper.game_data!;

  const canvasWidth =
    game_data.canvasWidth * game_data.tileSize * game_data.canvasScale;
  const canvasHeight =
    game_data.canvasHeight * game_data.tileSize * game_data.canvasScale;

  const canvas = document.createElement("canvas");
  canvas.id = "canvas";
  canvas.width = canvasWidth;
  canvas.height = canvasHeight;

  const app = document.getElementById("app");
  if (!app) {
    throw new Error();
  }

  app.appendChild(canvas);

  const drawHelper = new DrawHelper(canvas.getContext("2d")!, () => {});
  const gameService = new GameService(drawHelper); 
};
