let input = document.getElementById('inp');
let searchBtn = document.getElementById('search');
let pic= document.getElementById('image');
let defDiv= document.getElementById('defDiv');
let loader =document.getElementById('loaderDiv');
let nightMode= document.getElementById('nightMode');
let ball= document.getElementById('ball');
let ballFlag=true;
let pixabayKey= `20604574-32ddade49411802adc7b5891c`;
let picUrl=null;
let DictionaryUrl = null;
let term = "";
let picTerm="";
let optionsforDict = {
    method: 'GET',
    headers: {
        'authorization': 'Token 3b4f70c7d990e2731f095532f2049bb47b4d7a23',
    }
};
let picOptions= {
     method: 'GET',
    headers: {
        'Authorization': '563492ad6f917000010000011fe329fa65a94b8495d92976ebd3fda9',
    }
};

async function fetchDictionayData() {
    loader.style.display="flex";
    term = input.value.trim();
    if (term === "" || term===null) {
    loader.style.display="none";
        return;
    }
    DictionaryUrl = `https://owlbot.info/api/v4/dictionary/${term}`;
    try{
        let res = await fetch(DictionaryUrl, optionsforDict);
        if(res.status===200){
            getPic(term);    
        }
        res = await res.json();

        defDiv.innerHTML=null;
        pic.style.display="none";
        if(res[0]?.message){
            let msg= document.createElement('h2');
            msg.id="msg";
            msg.textContent= "no definition found :(";
            defDiv.append(msg);
            loader.style.display="none";
            return;
        }
        let frag= document.createDocumentFragment();
        let word= document.createElement('p');
        word.id="word";
        word.textContent= res.word;
        frag.append(word);
        res.definitions.forEach(item=>{
              let define= document.createElement('p');
              define.id="defin";
              define.textContent= item.definition;
              let example= document.createElement('p');
              example.id="eg";
              example.innerHTML= item.example;
              let type= document.createElement('p');
              type.id= "type";
              type.textContent= item.type;
              let line= document.createElement('hr');
              frag.append(type);
              frag.append(define);
              frag.append(example);
              frag.append(line);
        });
        defDiv.append(frag);
    loader.style.display="none";
    }
    catch(err){
        let msg= document.createElement('h2');
        msg.id="msg";
        msg.textContent= "some error occured,try again :(";
        defDiv.innerHTML=null;
        defDiv.append(msg);
    loader.style.display="none";
    }
    
};
async function getPic(picTerm){
    try{
        picTerm= picTerm.replace(/[\s]+/g,'+');
        // picUrl= `https://pixabay.com/api/?key=${pixabayKey}&q=${picTerm}&image_type=photo&per_page=3`;
        // let res= await fetch(picUrl);
        // let imgUrl= res?.hits[0]?.webformatURL;
        picUrl=`https://api.pexels.com/v1/search?query=${picTerm}&orientation=square&per_page=1`;
        let res= await fetch(picUrl,picOptions);
        res= await res.json();
        let imgUrl= res?.photos[0]?.src?.medium;
        if(imgUrl){
            pic.src= res.photos[0].src.medium;
            // pic.src=res.hits[0].webformatURL;
            pic.onload=()=>{
                pic.style.display="block";
            };
            pic.onerror=()=>{
                pic.style.display="none";
            };
        }
        else{
            console.log("no image");
        }
        
    }
    catch(err){
        console.log(err);
    }
    
};

let debounce= function(fun,delay){
    let timer;
    return function(){
        clearTimeout(timer);
          timer= setTimeout(() => {
              fun.call(this);
          }, delay);
    };
};
let ff= debounce(fetchDictionayData,150);

searchBtn.addEventListener("click", debounce(fetchDictionayData,150));
input.addEventListener("keyup",function(ev){
     if(ev?.key==="Enter"){
        ff();
     }
});

nightMode.addEventListener("click",nightModeFunction)

function nightModeFunction(){
    if(ballFlag){
        ballFlag=!ballFlag;
        ball.style.transform= 'translateX(7vw)';
        ball.style.background='teal';
        document.body.style.background='black';
        document.body.style.color="white";
        searchBtn.style.color='white';
        searchBtn.style.background='black';
        input.style.background="lightgrey";
    }
    else{
        ballFlag=!ballFlag;
        ball.style.transform= 'translateX(0vw)'; 
        ball.style.background='tomato';
        document.body.style.background='white';  
        document.body.style.color="black";
        searchBtn.style.color='black';
        searchBtn.style.background='white';
        input.style.background="white";
    }
    
}