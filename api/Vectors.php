<?php

class Vectors
{
  public static function construct($x, $y)
  {
    return [
      'x' => $x,
      'y' => $y,
    ];
  }

  public static function add($v1, $v2)
  {
    return self::construct($v1['x'] + $v2['x'], $v1['y'] + $v2['y']);
  }

  public static function subtract($v1, $v2) {
    return self::construct($v1['x'] - $v2['x'], $v1['y'] - $v2['y']);
  }

  public static function multiplyBy($v, $n)
  {
    return self::construct($v['x'] * $n, $v['y'] * $n);
  }

  public static function magnitude($v)
  {
    return sqrt($v['x'] * $v['x'] + $v['y'] * $v['y']);
  }

  public static function distance($v1, $v2) {
    return self::magnitude(self::subtract($v1, $v2));
  }
}