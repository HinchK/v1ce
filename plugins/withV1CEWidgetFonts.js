const {withDangerousMod}=require("expo/config-plugins");
const fs=require("fs"),path=require("path"),https=require("https");

const expoFonts=[
 ["@expo-google-fonts/roboto-mono","RobotoMono-Variable.ttf","700Bold"],
 ["@expo-google-fonts/oswald","Oswald-Variable.ttf","600SemiBold"],
 ["@expo-google-fonts/raleway","Raleway-Variable.ttf","700Bold"],
 ["@expo-google-fonts/fraunces","Fraunces-Variable.ttf","700Bold"],
 ["@expo-google-fonts/caveat","Caveat-Regular.ttf","400Regular"],
 ["@expo-google-fonts/dynapuff","DynaPuff-Variable.ttf","600SemiBold"]
];

const localFonts=[
 ["assets/fonts/BigShouldersStencilDisplay-Regular.ttf","BigShouldersStencilDisplay-Regular.ttf"]
];

const remoteFonts=[];

function findTtf(root,weight){
 const found=[];
 const walk=(dir)=>{
  if(!fs.existsSync(dir))return;
  for(const name of fs.readdirSync(dir)){
   const full=path.join(dir,name),stat=fs.statSync(full);
   if(stat.isDirectory())walk(full);
   else if(name.toLowerCase().endsWith(".ttf"))found.push(full);
  }
 };
 walk(root);
 return found.find(x=>x.includes(weight))||found[0]||null;
}

function download(url,dest){
 return new Promise((resolve,reject)=>{
  const file=fs.createWriteStream(dest);
  https.get(url,res=>{
   if(res.statusCode>=300&&res.statusCode<400&&res.headers.location){
    file.close();fs.unlinkSync(dest);
    return download(res.headers.location,dest).then(resolve,reject);
   }
   if(res.statusCode!==200){
    file.close();fs.unlinkSync(dest);
    return reject(new Error("HTTP "+res.statusCode+" for "+url));
   }
   res.pipe(file);
   file.on("finish",()=>file.close(resolve));
  }).on("error",e=>{
   try{file.close();fs.unlinkSync(dest)}catch{}
   reject(e);
  });
 });
}

module.exports=function(config){
 config=withDangerousMod(config,["ios",async c=>{
  const projectRoot=c.modRequest.projectRoot;
  const target=path.join(projectRoot,"targets","v1ce-widget","assets");
  const appFonts=path.join(projectRoot,"assets","fonts","native");
  fs.mkdirSync(target,{recursive:true});
  fs.mkdirSync(appFonts,{recursive:true});

  for(const [relativePath,outName] of localFonts){
   const source=path.join(projectRoot,relativePath);
   if(fs.existsSync(source)){
    fs.copyFileSync(source,path.join(target,outName));
    fs.copyFileSync(source,path.join(appFonts,outName));
   }
  }

  for(const [pkg,outName,weight] of expoFonts){
   const source=findTtf(path.join(projectRoot,"node_modules",pkg),weight);
   if(source){
    fs.copyFileSync(source,path.join(target,outName));
    fs.copyFileSync(source,path.join(appFonts,outName));
   }
  }

  for(const [url,outName] of remoteFonts){
   const dest=path.join(target,outName);
   if(!fs.existsSync(dest))await download(url,dest);
   if(fs.existsSync(dest))fs.copyFileSync(dest,path.join(appFonts,outName));
  }
  return c;
 }]);

 return withDangerousMod(config,["android",async c=>{
  const projectRoot=c.modRequest.projectRoot;
  const appFonts=path.join(projectRoot,"assets","fonts","native");
  fs.mkdirSync(appFonts,{recursive:true});

  for(const [relativePath,outName] of localFonts){
   const source=path.join(projectRoot,relativePath);
   if(fs.existsSync(source))fs.copyFileSync(source,path.join(appFonts,outName));
  }

  for(const [pkg,outName,weight] of expoFonts){
   const source=findTtf(path.join(projectRoot,"node_modules",pkg),weight);
   if(source)fs.copyFileSync(source,path.join(appFonts,outName));
  }

  for(const [url,outName] of remoteFonts){
   const dest=path.join(appFonts,outName);
   if(!fs.existsSync(dest))await download(url,dest);
  }
  return c;
 }]);
};
