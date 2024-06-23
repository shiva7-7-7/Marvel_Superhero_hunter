    const superheroInfo=document.getElementById('superheroInfo');
    const backBtn=document.getElementById('back-btn');
    let removetoFavourate;
    // this event will call render function when the page is load and render data to page
    window.addEventListener('load',()=>{
        let favourateHeros=new Map(JSON.parse(localStorage.getItem('favouritesCharacters')));
        let moreInfo=localStorage.getItem('moreInfo');
        moreInfo=parseInt(moreInfo);
        favourateHeros=favourateHeros.get(moreInfo);
        renderData(favourateHeros);
    })

    // this function display detail information of based on the moreInfo, which contain ID of character 
    // for which data is to display
    function renderData(favourateHero){
        superheroInfo.style.display='inline-block';
        let supheriData=`<div id="profile-pic">
        <img src="${favourateHero.img}.${favourateHero.imgext}" alt="profile-pic">
    </div>
    <div id="Superhero-name">
        <h3>${favourateHero.name}</h3>
    </div>
    <div id="discription">
        <p>
        ${(favourateHero.description=="")?"No Description Found":favourateHero.description}
        </p>
    </div>
    <div id="stats">
        <div class="stats-member">Num of Comics: ${favourateHero.comics}</div>
        <div class="stats-member">Num of Series: ${favourateHero.series}</div>
        <div class="stats-member">Num of Stories: ${favourateHero.stories}</div>
        <div class="stats-member">Num of Events: ${favourateHero.events}</div>
        <div class="stats-member"><a href="${favourateHero.url}">TO know more....</a></div>
    </div> 
    <div id="add-to-favourate" class="toggle-remove">
    <i class="fa-solid fa-heart-circle-minus"></i> &nbsp;Remove from Fav...
    </div>`
    superheroInfo.innerHTML=supheriData;
    removetoFavourate=document.getElementById('add-to-favourate');
    removetoFavourate.addEventListener('click',()=>{
        removeFromFavourate();
    })
    }

    // this function will delete the character data from from charater list when delete button is clicked
    // and take back to favourate character page.
    function removeFromFavourate(){
        let moreInfo=localStorage.getItem('moreInfo');
        moreInfo=parseInt(moreInfo);
        let favouritesCharacterIDs=new Map(JSON.parse(localStorage.getItem('favouritesCharacterIDs')));
        let favouritesCharacters=new Map(JSON.parse(localStorage.getItem('favouritesCharacters')));
        favouritesCharacterIDs.delete(moreInfo);
        favouritesCharacters.delete(moreInfo);
        localStorage.setItem('favouritesCharacterIDs',JSON.stringify([...favouritesCharacterIDs]));
        localStorage.setItem('favouritesCharacters',JSON.stringify([...favouritesCharacters]));
        window.location.assign('favourates.html');
    }

    // take back to favourate page when clicked on back button
    backBtn.addEventListener('click',()=>{
        window.location.assign('favourates.html')
    })