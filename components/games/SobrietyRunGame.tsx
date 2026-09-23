import React,{useCallback,useEffect,useRef,useState} from "react";
import {StyleSheet,Text,TouchableOpacity,View} from "react-native";
import Svg,{Circle,Line,Rect} from "react-native-svg";

const W=320,H=240,G=H-40,PLAYER=12,OBW=16,OBH=16,COIN=8,INITIAL_SPEED=2.8,MAX_SPEED=6;
const OBSTACLE_TYPES=["methpipe","bong","weedleaf","bottle","syringe","phone"] as const;
type Ob={x:number;y:number;type:typeof OBSTACLE_TYPES[number]};type Coin={x:number;y:number;shape:"circle"|"hexagon"|"diamond"};type Projectile={x:number;y:number;vx:number;vy:number};
const obstacle=(type:Ob["type"],x:number,y:number)=><React.Fragment>
{type==="methpipe"&&<><Rect x={x+2} y={y+6} width={8} height={4} fill="#fff"/><Rect x={x+10} y={y+2} width={4} height={8} fill="#fff"/></>}
{type==="bong"&&<><Rect x={x+3} y={y} width={10} height={3} fill="#fff"/><Rect x={x+4} y={y+3} width={8} height={10} fill="#fff"/><Rect x={x+2} y={y+13} width={12} height={3} fill="#fff"/></>}
{type==="weedleaf"&&<><Rect x={x+7} y={y} width={2} height={16} fill="#fff"/><Rect x={x+3} y={y+4} width={10} height={2} fill="#fff"/><Rect x={x+3} y={y+10} width={10} height={2} fill="#fff"/></>}
{type==="bottle"&&<><Rect x={x+5} y={y} width={6} height={3} fill="#fff"/><Rect x={x+4} y={y+3} width={8} height={10} fill="#fff"/><Rect x={x+3} y={y+13} width={10} height={3} fill="#fff"/></>}
{type==="syringe"&&<><Rect x={x+2} y={y+6} width={6} height={3} fill="#fff"/><Rect x={x+8} y={y+2} width={3} height={12} fill="#fff"/><Rect x={x+11} y={y+8} width={3} height={2} fill="#fff"/></>}
{type==="phone"&&<><Rect x={x+3} y={y+2} width={10} height={12} fill="#fff"/><Rect x={x+5} y={y+4} width={6} height={8} fill="#000"/></>}
</React.Fragment>;

export default function SobrietyRunGame(){
 const[gameState,setGameState]=useState<"start"|"playing"|"gameOver"|"victory">("start"),[score,setScore]=useState(0),[level,setLevel]=useState(1),[,force]=useState(0);
 const d=useRef({playerX:W/2-PLAYER/2,playerY:G-PLAYER,velY:0,jump:false,obstacles:[] as Ob[],coins:[] as Coin[],speed:INITIAL_SPEED,spawn:0,time:0,score:0,level:1,boss:null as null|{x:number;y:number;width:number;height:number;attack:number;health:number},projectiles:[] as Projectile[],throwing:null as null|Projectile,scroll:0,last:Date.now()});
 const reset=useCallback(()=>{d.current={playerX:W/2-PLAYER/2,playerY:G-PLAYER,velY:0,jump:false,obstacles:[],coins:[],speed:INITIAL_SPEED,spawn:0,time:0,score:0,level:1,boss:null,projectiles:[],throwing:null,scroll:0,last:Date.now()};setScore(0);setLevel(1);setGameState("start")},[]);
 const action=useCallback(()=>{if(gameState==="start"){setGameState("playing");return}if(gameState==="gameOver"||gameState==="victory"){reset();return}if(d.current.level===12&&d.current.boss&&!d.current.throwing){d.current.throwing={x:d.current.playerX+PLAYER/2,y:d.current.playerY,vx:6,vy:-4};return}if(!d.current.jump){d.current.velY=-12;d.current.jump=true}},[gameState,reset]);
 useEffect(()=>{if(gameState!=="playing")return;let raf:number;const loop=()=>{const x=d.current,now=Date.now(),dt=Math.min(3,(now-x.last)/16.67);x.last=now;x.velY+=.8*dt;x.playerY+=x.velY*dt;if(x.playerY>=G-PLAYER){x.playerY=G-PLAYER;x.velY=0;x.jump=false}x.time++;
 if(x.time%10===0){x.score++;setScore(x.score)}
 if(x.score>0&&x.score%500===0&&x.coins.length===0)x.coins.push({x:W-60,y:G-60,shape:["circle","hexagon","diamond"][Math.floor(Math.random()*3)] as Coin["shape"]});
 x.obstacles=x.obstacles.filter(o=>{o.x-=x.speed*dt;const hit=x.playerX<o.x+OBW&&x.playerX+PLAYER>o.x&&x.playerY<o.y+OBH&&x.playerY+PLAYER>o.y;if(hit)setGameState("gameOver");return !hit&&o.x>-OBW});
 x.coins=x.coins.filter(c=>{c.x-=x.speed*dt;const hit=x.playerX<c.x+COIN&&x.playerX+PLAYER>c.x&&x.playerY<c.y+COIN&&x.playerY+PLAYER>c.y;if(hit){x.score+=50;setScore(x.score)}return !hit&&c.x>-COIN});
 const lvl=Math.min(Math.floor(x.score/1000)+1,12);if(lvl!==x.level){x.level=lvl;setLevel(lvl);if(lvl===12)x.boss={x:W-50,y:G-80,width:60,height:60,attack:0,health:3};else{x.boss=null;x.projectiles=[]}}
 x.speed=Math.min(INITIAL_SPEED+x.time*.001,MAX_SPEED);
 if(x.level===12&&x.boss){x.attack++;if(x.attack>60){x.projectiles.push({x:x.boss.x,y:x.boss.y+20,vx:-5,vy:(Math.random()-.5)*3});x.attack=0}
  x.projectiles=x.projectiles.filter(p=>{p.x+=p.vx;p.y+=p.vy;const hit=x.playerX<p.x+6&&x.playerX+PLAYER>p.x&&x.playerY<p.y+6&&x.playerY+PLAYER>p.y;if(hit)setGameState("gameOver");return !hit&&p.x>-10});
  if(x.throwing){x.throwing.x+=x.throwing.vx;x.throwing.y+=x.throwing.vy;x.throwing.vy+=.3;if(x.throwing.x>x.boss.x&&x.throwing.x<x.boss.x+x.boss.width&&x.throwing.y>x.boss.y&&x.throwing.y<x.boss.y+x.boss.height){x.boss.health--;x.throwing=null;if(x.boss.health<=0)setGameState("victory")}else if(x.throwing.x>W||x.throwing.y>H)x.throwing=null}
  x.obstacles=[];
 }else{x.spawn++;const rate=Math.max(20,120-(x.time*.5+x.level*5));if(x.spawn>rate){x.obstacles.push({x:W,y:G-OBH,type:OBSTACLE_TYPES[Math.floor(Math.random()*OBSTACLE_TYPES.length)]});x.spawn=0}}
 force(v=>v+1);raf=requestAnimationFrame(loop)};raf=requestAnimationFrame(loop);return()=>cancelAnimationFrame(raf)},[gameState]);

 const x=d.current;
 return <View style={s.wrap}><View style={s.hud}><Text style={s.hudText}>LEVEL {level}/12</Text><Text style={s.hudText}>SCORE {score}</Text></View>
  <TouchableOpacity activeOpacity={1} onPress={action} style={s.scene}>
   <Svg width={W} height={H} viewBox="0 0 320 240"><Rect width={W} height={H} fill="#000"/><Line x1="0" y1={G} x2={W} y2={G} stroke="#fff" strokeWidth="1"/>
    <Circle cx={x.playerX+PLAYER/2} cy={x.playerY+3} r="3" fill="none" stroke="#00E676" strokeWidth="2"/>
    <Line x1={x.playerX+PLAYER/2} y1={x.playerY+6} x2={x.playerX+PLAYER/2} y2={x.playerY+9} stroke="#00E676" strokeWidth="2"/>
    <Line x1={x.playerX+2} y1={x.playerY+7} x2={x.playerX+PLAYER-2} y2={x.playerY+7} stroke="#00E676" strokeWidth="2"/>
    <Line x1={x.playerX+PLAYER/2} y1={x.playerY+9} x2={x.playerX+4} y2={x.playerY+PLAYER} stroke="#00E676" strokeWidth="2"/>
    <Line x1={x.playerX+PLAYER/2} y1={x.playerY+9} x2={x.playerX+PLAYER-4} y2={x.playerY+PLAYER} stroke="#00E676" strokeWidth="2"/>
    {x.obstacles.map((o,i)=><React.Fragment key={i}>{obstacle(o.type,o.x,o.y)}</React.Fragment>)}{x.coins.map((c,i)=><Rect key={"c"+i} x={c.x} y={c.y} width={COIN} height={COIN} fill="#fff"/>)}
    {x.projectiles.map((p,i)=><Rect key={"p"+i} x={p.x-3} y={p.y-3} width="6" height="6" fill="#fff"/>)}{x.throwing&&<Circle cx={x.throwing.x} cy={x.throwing.y} r="4" fill="#fff"/>}
    {x.boss&&<><Rect x={x.boss.x-20} y={x.boss.y+10} width="40" height="40" fill="#fff"/><Rect x={x.boss.x-15} y={x.boss.y-10} width="30" height="20" fill="#fff"/><Rect x={x.boss.x-10} y={x.boss.y} width="6" height="6" fill="#000"/><Rect x={x.boss.x+4} y={x.boss.y} width="6" height="6" fill="#000"/><Line x1={x.boss.x-8} y1={x.boss.y+15} x2={x.boss.x+8} y2={x.boss.y+15} stroke="#000" strokeWidth="2"/></>}
   </Svg>
   {gameState==="start"&&<View style={s.overlay}><Text style={s.green}>SOBRIETY RUN</Text><Text style={s.greenSmall}>12 LEVELS TO FREEDOM</Text><Text style={s.whiteSmall}>TAP TO START</Text></View>}
   {gameState==="gameOver"&&<View style={s.overlay}><Text style={s.white}>GAME OVER</Text><Text style={s.greenSmall}>LEVEL: {level}/12</Text><Text style={s.greenSmall}>SCORE: {score}</Text><Text style={s.whiteSmall}>TAP TO RETRY</Text></View>}
   {gameState==="victory"&&<View style={s.overlay}><Text style={s.green}>YOU SURVIVED.</Text><Text style={s.whiteSmall}>PASS THE STRENGTH ON.</Text><Text style={s.whiteSmall}>FINAL SCORE: {score}</Text><Text style={s.greenSmall}>TAP TO RETRY</Text></View>}
  </TouchableOpacity><Text style={s.hint}>TAP OR PRESS SPACE TO JUMP</Text>
 </View>
}
const s=StyleSheet.create({wrap:{alignItems:"center",gap:4},hud:{width:W,flexDirection:"row",justifyContent:"space-between"},hudText:{color:"#fff",fontSize:10,fontFamily:"SpaceMono_700Bold"},scene:{width:W,height:H,borderWidth:2,borderColor:"#fff",backgroundColor:"#000",overflow:"hidden"},overlay:{position:"absolute",left:0,top:0,right:0,bottom:0,alignItems:"center",justifyContent:"center",backgroundColor:"rgba(0,0,0,.75)"},green:{color:"#00E676",fontSize:16,fontFamily:"SpaceMono_700Bold"},greenSmall:{color:"#00E676",fontSize:10,fontFamily:"SpaceMono_700Bold",marginTop:4},white:{color:"#fff",fontSize:16,fontFamily:"SpaceMono_700Bold"},whiteSmall:{color:"#fff",fontSize:9,fontFamily:"SpaceMono_700Bold",marginTop:4},hint:{fontSize:9,letterSpacing:1.5,marginTop:4}});
