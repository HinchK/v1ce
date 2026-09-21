import {Link,Stack} from "expo-router";
import {View,Text} from "react-native";
export default function NotFound(){return <><Stack.Screen options={{title:"Not Found"}}/><View style={{flex:1,alignItems:"center",justifyContent:"center",gap:12}}><Text>This screen does not exist.</Text><Link href="/">Go home</Link></View></>}