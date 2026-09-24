const {withDangerousMod}=require("expo/config-plugins");
const fs=require("fs"),path=require("path"),https=require("https");

const expoFonts=[
 ["@expo-google-fonts/roboto-mono","RobotoMono-Variable.ttf","700Bold"],
 ["@expo-google-fonts/arimo","Arimo-Variable.ttf","700Bold"],
 ["@expo-google-fonts/oswald","Oswald-Variable.ttf","600SemiBold"],
 ["@expo-google-fonts/raleway","Raleway-Variable.ttf","700Bold"],
 ["@expo-google-fonts/saira","Saira-Variable.ttf","700Bold"],
 ["@expo-google-fonts/josefin-sans","JosefinSans-Variable.ttf","600SemiBold"],
 ["@expo-google-fonts/fraunces","Fraunces-Variable.ttf","700Bold"],
 ["@expo-google-fonts/caveat","Caveat-Regular.ttf","400Regular"],
 ["@expo-google-fonts/dyna-puff","DynaPuff-Variable.ttf","600SemiBold"]
];

const remoteFonts=[
 ["https://raw.githubusercontent.com/google/fonts/main/ofl/geistpixel/GeistPixel%5BELSH%5D.ttf","GeistPixel-Variable.ttf"],
 ["https://raw.githubusercontent.com/SorkinType/QLDSchoolHandAustralia/main/fonts/variable/EduQLDHand%5Bwght%5D.ttf","EduQLDHand-Variable.ttf"]
];

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
    file.close();fs.unlinkSync(dest);return download(res.headers.location,dest).then(resolve,reject);
   }
   if(res.statusCode!==200){file.close();fs.unlinkSync(dest);return reject(new Error("HTTP "+res.statusCode+" for "+url));}
   res.pipe(file);file.on("finish",()=>file.close(resolve));
  }).on("error",e=>{try{file.close();fs.unlinkSync(dest)}catch{};reject(e)});
 });
}

module.exports=function(config){
 return withDangerousMod(config,["ios",async c=>{
  const projectRoot=c.modRequest.projectRoot;
  const target=path.join(projectRoot,"targets","v1ce-widget","assets");
  fs.mkdirSync(target,{recursive:true});

  for(const [pkg,outName,weight] of expoFonts){
   const pkgRoot=path.join(projectRoot,"node_modules",pkg);
   const source=findTtf(pkgRoot,weight);
   if(source)fs.copyFileSync(source,path.join(target,outName));
  }

  for(const [url,outName] of remoteFonts){
   const dest=path.join(target,outName);
   if(!fs.existsSync(dest))await download(url,dest);
  }
  return c;
 }]);
};
