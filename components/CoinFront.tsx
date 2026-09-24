import React from "react";
import { StyleSheet, Text, View } from "react-native";
import Svg, { Circle, Image, Path, Polygon } from "react-native-svg";
import { COIN_COLORS, NUMBER_STYLES, resolveCoinColor } from "@/constants/coin";

export { COIN_COLORS, NUMBER_STYLES };

export const SHAPES = ["circle","hexagon","octagon","shield","diamond","star","badge","arrow","drawn"] as const;

const PATHS: Record<string,string> = {
  hexagon:"M25 2 L75 2 L100 50 L75 98 L25 98 L0 50 Z",
  octagon:"M30 2 L70 2 L98 30 L98 70 L70 98 L30 98 L2 70 L2 30 Z",
  shield:"M50 2 L100 17 L100 65 L50 100 L0 65 L0 17 Z",
  diamond:"M50 2 L95 50 L50 100 L5 50 Z",
  star:"M50 2 L61 35 L98 35 L68 57 L79 91 L50 70 L21 91 L32 57 L2 35 L39 35 Z",
  badge:"M50 0 L65 10 L82 5 L90 20 L100 30 L95 50 L100 70 L90 80 L82 95 L65 90 L50 100 L35 90 L18 95 L10 80 L0 70 L5 50 L0 30 L10 20 L18 5 L35 10 Z",
  arrow:"M0 35 L55 35 L55 10 L100 50 L55 90 L55 65 L0 65 Z",
};

const BOUNDS: Record<string,{minX:number;maxX:number;minY:number;maxY:number;width:number;height:number}> = {
  circle:{minX:.04,maxX:.96,minY:.04,maxY:.96,width:.92,height:.92},
  hexagon:{minX:.03,maxX:.97,minY:.02,maxY:.98,width:.94,height:.96},
  octagon:{minX:.02,maxX:.98,minY:.02,maxY:.98,width:.96,height:.96},
  shield:{minX:.03,maxX:.97,minY:.02,maxY:.98,width:.94,height:.96},
  diamond:{minX:.04,maxX:.96,minY:.03,maxY:.97,width:.92,height:.94},
  star:{minX:.02,maxX:.98,minY:.02,maxY:.98,width:.96,height:.96},
  badge:{minX:.02,maxX:.98,minY:.02,maxY:.98,width:.96,height:.96},
  arrow:{minX:0,maxX:1,minY:.35,maxY:.65,width:1,height:.30},
};

const FONT_FAMILIES: Record<string,string> = {
  "Big Shoulders Stencil":"BigShouldersStencilDisplayRegular",
  "Roboto Mono":"RobotoMonoWidget",
  "Oswald":"OswaldWidget",
  "Raleway":"RalewayWidget",
  "Fraunces":"FrauncesWidget",
  "Caveat":"CaveatWidget",
  "DynaPuff":"DynaPuffWidget",
};
