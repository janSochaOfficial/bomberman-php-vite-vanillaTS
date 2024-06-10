import { IDrawable } from "./i-drawable";

export interface IAnimation extends IDrawable{
  isDone(): boolean;
}