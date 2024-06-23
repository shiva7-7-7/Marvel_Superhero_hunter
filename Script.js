    let hash = CryptoJS.MD5(ts + PRIVATE_KEY + PUBLIC_KEY).toString();
    const inputField=document.getElementById('input-field');
    const submitBtn=document.getElementById('submit-btn');
    const suggetionList=document.getElementById('suggetion-list');
    const superheroInfo=document.getElementById('superheroInfo');
    let addtoFavourate;
    // this function will append suggetionList of superheros based on key enter by user
    // from this list we can click and fill the input field
    async function suggetionFunc(value){
        // based on the letters on input field fetch the list of matching superheros
        const response=await fetch(`https://gateway.marvel.com:443/v1/public/characters?nameStartsWith=${value}&limit=6&ts=${ts}&apikey=${PUBLIC_KEY}&hash=${hash}`)
        if(!(response).ok){
            return false;
        }
        const data= await response.json();
        //  if list of superhero which match first three letter is not empty then render the data to suggetion list
        // from where user can click on any suggested character and data will be filled in input-field.
        // and data will be fetched and displayed
        if(data.data.total>=1){ 
            data.data.results.forEach((element,index)=> {
            let listItem=document.createElement('li');
            listItem.innerHTML=`<img src="${element.thumbnail.path}.${element.thumbnail.extension}" alt="ICON" 
            class="Suggetion-img"> <p class="Suggetion-name">${element.name}</p>` 
            listItem.addEventListener('click',()=>{
                suggetionList.innerHTML='';
                inputField.value=element.name;
                fetchData();
            })
            suggetionList.appendChild(listItem);
            });
        }
    }

    // adding event listener to input field which will check number of characters in input field
    // if number of characters is more than 3 it will call suggetion function which will create suggestion list
    inputField.addEventListener('keyup',()=>{
        suggetionList.innerHTML='';
        let value=inputField.value.trim();
        if(value.length>=3){
            suggetionFunc(value);
        }
    });

    //this will render super hero info to index page
    function renderSuperHeroData(data){
        if(data.data.total>=1){
            superheroInfo.style.display='inline-block';
            let favouritesCharacterIDs = localStorage.getItem("favouritesCharacterIDs");
            if(favouritesCharacterIDs == null){
                // If we did't got the favouritesCharacterIDs then we iniitalize it with empty map
                favouritesCharacterIDs = new Map();
            }
            else if(favouritesCharacterIDs != null){
                // If the we got the favouritesCharacterIDs in localStorage then parsing it and converting it to map
                favouritesCharacterIDs = new Map(JSON.parse(localStorage.getItem("favouritesCharacterIDs")));
            }
            // creating input formated string from the data fetched from Marvel API which will be displayed on home page
            let supheriData=`<div id="profile-pic">
            <img src="${data.data.results[0].thumbnail.path}.${data.data.results[0].thumbnail.extension}" alt="profile-pic">
        </div>
        <div id="Superhero-name">
            <h3>${data.data.results[0].name}</h3>
        </div>
        <div id="discription">
            <p>
            ${(data.data.results[0].description=="")?"No Description Found":data.data.results[0].description}
            </p>
        </div>
        <div id="stats">
            <div class="stats-member">Num of Comics: ${data.data.results[0].comics.available}</div>
            <div class="stats-member">Num of Series: ${data.data.results[0].series.available}</div>
            <div class="stats-member">Num of Stories: ${data.data.results[0].stories.available}</div>
            <div class="stats-member">Num of Events: ${data.data.results[0].events.available}</div>
            <div class="stats-member"><a href="${data.data.results[0].urls[0].url}">TO know more....</a></div>
        </div> 
        <div id="add-to-favourate" class="${favouritesCharacterIDs.has(data.data.results[0].id)?'toggle-remove':'toggle-add'}">
        ${favouritesCharacterIDs.has(data.data.results[0].id) ?'<i class="fa-solid fa-heart-circle-minus"></i> &nbsp;Remove from Fav...'
        :'<i class="fa-solid fa-heart fav-icon"></i> &nbsp; Add to Favourites'}  
        </div>`
        superheroInfo.innerHTML=supheriData;
        // event listener which will add or remove data based on state of the data.
        addtoFavourate=document.getElementById('add-to-favourate');
        addtoFavourate.addEventListener('click',()=>{
            addandRemoveFavourate(data);
        })    
        }
    }
    // search the superhero when search button is clicked 
    // based on status, if data is successfully fetched then it will call render function.
    submitBtn.addEventListener('click',fetchData);

    async function fetchData(){
        try{
            suggetionList.innerHTML='';
            const response=await fetch(`https://gateway.marvel.com:443/v1/public/characters?name=${inputField.value}&ts=${ts}&apikey=${PUBLIC_KEY}&hash=${hash}`)
            inputField.value=''
            if(!(response).ok){
                return false;
            }
            const data= await response.json();
            // addtoFavourateList(data);
            renderSuperHeroData(data);
        }catch(err){
            console.error('An error occurred:', err.message);
            superheroInfo.innerHTML="Error";
        }
    }

    //add and remove the superhero from favourate list
    function addandRemoveFavourate(data){
        //Check if add and remove button have which class if toggle-add then add otherwise remove from favourate
        if(addtoFavourate.classList.contains('toggle-add')){
            // add to favorate ID
            let favouritesCharacterIDs = localStorage.getItem("favouritesCharacterIDs");
            if(favouritesCharacterIDs == null){
                // If we did't got the favouritesCharacterIDs then we iniitalize it with empty map
                favouritesCharacterIDs = new Map();
            }
            else if(favouritesCharacterIDs != null){
                // If the we got the favouritesCharacterIDs in localStorage then parsing it and converting it to map
                favouritesCharacterIDs = new Map(JSON.parse(localStorage.getItem("favouritesCharacterIDs")));
            }
            favouritesCharacterIDs.set(data.data.results[0].id,true);
            localStorage.setItem("favouritesCharacterIDs",JSON.stringify([...favouritesCharacterIDs]));
            // this function will append the data to the favourate list
            addtoFavourateList(data);
            addtoFavourate.innerHTML='<i class="fa-solid fa-heart-circle-minus"></i> &nbsp; Remove from Fav...';
            addtoFavourate.classList.remove('toggle-add');
            addtoFavourate.classList.add('toggle-remove');
        // creating favourate list
        }else{
            // when class if toggle-remove we are removing charater from favourate list
            let favouritesCharacterIDs = new Map(JSON.parse(localStorage.getItem("favouritesCharacterIDs")));;
            favouritesCharacterIDs.delete(data.data.results[0].id);
            localStorage.setItem("favouritesCharacterIDs",JSON.stringify([...favouritesCharacterIDs]));
            // function call to remove data from list
            removeFromFavourateList(data.data.results[0].id);
            addtoFavourate.innerHTML='<i class="fa-solid fa-heart fav-icon"></i> &nbsp; Add to Favourites';
            addtoFavourate.classList.remove('toggle-remove');
            addtoFavourate.classList.add('toggle-add');
        }
    }

    //this function will append or create list of favourate character based on situation
    // this function push data to local storage
    function addtoFavourateList(data){
        let favourateArray=localStorage.getItem('favouritesCharacters');
        if(favourateArray==null){
            favourateArray=new Map();
        }else{
            favourateArray=new Map(JSON.parse(localStorage.getItem('favouritesCharacters')));
        }
        let dataToPush={
            name:data.data.results[0].name,
            img:data.data.results[0].thumbnail.path,
            imgext:data.data.results[0].thumbnail.extension,
            description:data.data.results[0].description,
            comics:data.data.results[0].comics.available,
            series:data.data.results[0].series.available,
            stories:data.data.results[0].stories.available,
            events:data.data.results[0].events.available,
            url:data.data.results[0].urls[0].url
        }
        favourateArray.set(data.data.results[0].id,dataToPush)
        localStorage.setItem('favouritesCharacters',JSON.stringify([...favourateArray]));
    }
    // this function will remove character based on ID of character
    function removeFromFavourateList(data){
        let favourateArray=new Map(JSON.parse(localStorage.getItem('favouritesCharacters')));
        if(favourateArray.has(data)){
            favourateArray.delete(data);
        }
        localStorage.setItem('favouritesCharacters',JSON.stringify([...favourateArray]));
    }