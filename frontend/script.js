
function localdashboadr(){
let wish=document.querySelector(".wish");
let date=new Date();
let hour=date.getHours();

function greetUser(){
    if(hour<12){
        wish.innerText="Good Morning !";
    }
    else if(hour<18){
        wish.innerText="Good Afternoon !";
    }
    else{
        wish.innerText="Good Evening !";
    }
}

function dateDisplay(){
    let options={weekday:"long",day:"numeric",month:"short",year:"numeric"};
    let today=date.toLocaleDateString("en-US",options);
    document.querySelector(".date").innerText=today;
}

greetUser();
dateDisplay();

}
localdashboadr();
setInterval(localdashboadr,5000);





// MENU-Script




