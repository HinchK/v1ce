import React,{createContext,useContext,useEffect,useMemo,useState,type ReactNode} from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {supabase,type SobrietyProfile} from "@/lib/supabase";
type User={email:string;id:string};
type AuthContextType={user:User|null;profile:SobrietyProfile|null;isLoading:boolean;setProfile:(p:SobrietyProfile|null)=>void;signOut:()=>Promise<void>;refreshProfile:()=>Promise<void>};
const AuthContext=createContext<AuthContextType>({user:null,profile:null,isLoading:true,setProfile:()=>{},signOut:async()=>{},refreshProfile:async()=>{}});
export const useAuth=()=>useContext(AuthContext);
export function AuthProvider({children}:{children:ReactNode}){
 const [user,setUser]=useState<User|null>(null),[profile,setProfile]=useState<SobrietyProfile|null>(null),[isLoading,setIsLoading]=useState(true);
 const loadProfile=async(email:string)=>{const {data}=await supabase.from("SobrietyProfile").select("*").eq("email",email).single();setProfile(data as SobrietyProfile|null)};
 const refreshProfile=async()=>{const email=user?.email||(await AsyncStorage.getItem("v1ce_email"));if(email)await loadProfile(email)};
 useEffect(()=>{(async()=>{const {data:{session}}=await supabase.auth.getSession();if(session?.user?.email){setUser({email:session.user.email,id:session.user.id});await loadProfile(session.user.email)}else{const email=await AsyncStorage.getItem("v1ce_email");if(email){setUser({email,id:email});await loadProfile(email)}}setIsLoading(false)})();const {data:{subscription}}=supabase.auth.onAuthStateChange((_,s)=>{if(s?.user?.email){setUser({email:s.user.email,id:s.user.id});loadProfile(s.user.email)}});return()=>subscription.unsubscribe()},[]);
 const signOut=async()=>{await supabase.auth.signOut();await AsyncStorage.removeItem("v1ce_email");setUser(null);setProfile(null)};
 const value=useMemo(()=>({user,profile,isLoading,setProfile,signOut,refreshProfile}),[user,profile,isLoading]);
 return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}