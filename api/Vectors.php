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

  public static function subtract($v1, $v2)
  {
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

  public static function distance($v1, $v2)
  {
    return self::magnitude(self::subtract($v1, $v2));
  }

  public static function toInegerVector($v1)
  {
    return self::construct(round($v1['x']), round($v1['y']));
  }

  public static function areEqual($v1, $v2)
  {
    return $v1['x'] == $v2['x'] && $v1['y'] == $v2['y'];
  }

  public static function areIntegerEqual($v1, $v2)
  {
    return self::areEqual(self::toInegerVector($v1), self::toInegerVector($v2));
  }

  public static function travel(array $from, array $to, float $distanceFraction = 1)
  {
    return self::add(
      $from, // current position
      Vectors::multiplyBy(
        Vectors::subtract($to, $from), // Vector from current to next point
        $distanceFraction // franction of distance to travel
      )
    );
  }

}