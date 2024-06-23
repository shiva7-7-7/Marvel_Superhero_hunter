    // call the favouratehero function on event load, when page is load
    window.addEventListener("load", (event) => {
        console.log("page is fully loaded");
        favourateHero();
    });
    // this function will fatch of favourate characters from the data from local storage and
    // render all data to the favourate page
    function favourateHero(){
        const container=document.getElementById("container");
        let favourateHeros=localStorage.getItem('favouritesCharacters');
        console.log(typeof(favourateHeros));
        if(favourateHeros==null || typeof(favourateHeros)=="object"){
            return;
        }
        favourateHeros=new Map(JSON.parse(favourateHeros));
        favourateHeros=[...favourateHeros];
        container.innerHTML='';
        // iterate over the favourate list and render data to favourate page
        favourateHeros.forEach(element => {
            let removeBtn=document.createElement('div');
            let favContainer=document.createElement('div');
            let moreInfoBtn=document.createElement('button');
            favContainer.classList.add('fav-container');
            removeBtn.classList.add('remove-btn');
            removeBtn.innerHTML='<i class="fa-solid fa-heart-circle-minus"></i> &nbsp;Remove from Fav...';
            moreInfoBtn.innerText="More Info..."
            let data=`
            <div class="img-div">
                <img src="${element[1].img}.${element[1].imgext}" alt="ICON">
            </div>
            <div class="Name">
                <h4>${element[1].name}</h4>
            </div>`
            favContainer.innerHTML=data;
            favContainer.appendChild(removeBtn);
            favContainer.appendChild(moreInfoBtn);
            container.appendChild(favContainer);
            // when remove button clicked call removeFromFavourate function and pass ID of character to remove
            removeBtn.addEventListener('click',()=>{
                removeFromFavourate(element[0]);
            })
            // when more detail button is clicked this will take you to more detail page
            // moreInfo is set to ID based on which data will be fetched in moreInformation page
            moreInfoBtn.addEventListener('click',()=>{
                localStorage.setItem('moreInfo',JSON.stringify(element[0]));
                window.location.assign("moreInformation.html");
            })
        });
    }

    // this function will remove the character from favourate list and load the page again
    function removeFromFavourate(id){
        let favourateHerosArray=localStorage.getItem('favouritesCharacters');
        let favourateHeroIDsArray=localStorage.getItem('favouritesCharacterIDs');
        favourateHerosArray=new Map(JSON.parse(favourateHerosArray));
        favourateHeroIDsArray=new Map(JSON.parse(favourateHeroIDsArray));
        favourateHeroIDsArray.delete(id);
        favourateHerosArray.delete(id);
        localStorage.setItem('favouritesCharacters',JSON.stringify([...favourateHerosArray]));
        localStorage.setItem('favouritesCharacterIDs',JSON.stringify([...favourateHeroIDsArray]));
        location.reload();
    }