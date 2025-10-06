

import { Octokit, App } from "https://esm.sh/octokit";
import {TOKEN} from "./config.js"
const REPO_GRID = "repos-grid";
const PROFILE_NAME = "profile-info > h1";
const PROFILE_USERNAME = "username";
const PROFILE_BIO = "bio";
const PROFILE_STATS = "stats > stat-item";
const PROFILE_IMAGE = "img";
const REPO_CARD = "repo-card";
const REPO_HEADER = "repo-header";
const REPO_ICON = "repo-icon";
const REPO_NAME = "repo-name";
const REPO_DESCRIPTION = "repo-description";
const REPO_FOOTER = "repo-footer";
const REPO_STATS = "repo-stats";
const LANGUAGE_DOT = "language-dot";
 
let loadingState = false;
let error = false;


const octokit = new Octokit({
    auth:TOKEN
})

function loading(){
    loadingState = !loadingState;
    let loader = document.querySelector(".loader");
    loader.hidden=!loadingState;
    console.log(loader.hidden)
}
function setLoading(bool){
    loadingState = bool;
}

function setError(bool){
    error = bool
    
}

function displayLoadingOrError(){
    let error_box = document.querySelector(".error-box");
    let loader = document.querySelector(".loader");
    loader.hidden = !loadingState;
    error_box.hidden = !error;

}

async function fetchData(username){

    try {
        setError(false);
        setLoading(true);
        displayLoadingOrError()
        const response = await Promise.all([
            
            octokit.request(`GET /users/${username}/repos`),
            octokit.request(`GET /users/${username}`)
        ])
        
        setLoading(false)
        setError(false)
        displayLoadingOrError()
        return response.map(element => element.data )
    }catch (error) {
        setLoading(false);
        setError(true);
        // Update error message dynamically:
        document.querySelector('.error-message').textContent = 
            error.status === 404 ? 'User not found!' : 'Unable to fetch data. Try again.';
        displayLoadingOrError();
}
}

// utility function to generate an element with tag and classes
function createElement(tag,classes){
  let element = document.createElement(tag)
  for (let classe of classes){
    element.classList.add(classe)
  } 
  return element
}
// utility function to append multiple elements into a parent element
function appendMultipleElements(parent,childrens){
    for(let children of childrens){
        parent.append(children)
    }


}

//created a  DOM for Repos 
function createRepos(repo){
    let container = document.querySelector(".container");
    let repo_grid = document.querySelector("."+REPO_GRID)
    let repo_card = createElement("div",[REPO_CARD]);
    let repo_header = createElement("div",[REPO_HEADER]);
    let repo_icon =createElement("div",[REPO_ICON]);
    let repo_name = createElement("div",[REPO_NAME]);
    let repo_description =createElement("div",[REPO_DESCRIPTION]);
    let repo_footer = createElement("div",[REPO_FOOTER]);
    let repo_stat = createElement("div",[REPO_STATS]);
    let language_dot = createElement("span",[LANGUAGE_DOT,repo.language ? repo.language.toLowerCase() : "unknown"]);
    let repo_stat_1 = createElement("div",[REPO_STATS]);
    let repo_stat_2 = createElement("div",[REPO_STATS]);

    let repos_section = document.querySelector(".repos-section");
    


    // language_dot.classList.add(repo.language)
    appendMultipleElements(repo_header,[repo_icon,repo_name]);
    appendMultipleElements(repo_footer,[repo_stat,repo_stat_1,repo_stat_2])
    repo_stat.append(language_dot)
    appendMultipleElements(repo_card,[repo_header,repo_description,repo_footer])
    repo_grid.append(repo_card)
    

    
    repo_name.textContent = repo.name

    repo_description.textContent = repo.description || " No description was provided by the creator of the repo"
    
    repo_stat.append(" "+repo.language)
    repo_stat_1.textContent = "⭐ "+ repo.watchers
    repo_stat_2.textContent = "🔄 "+ repo.forks
}
function displayProfile(user){
    let container = document.querySelector(".container");
    if(container.childElementCount > 0){
        container.innerHTML = ""
    }



    let profile_section = createElement("div",["profile-section"])
    let img = createElement("img",["profile-image"])
    let profile_info = createElement("div",["profile-info"])
    let name = createElement("h1",[])
    let user_name = createElement("div",[PROFILE_USERNAME])
    let user_bio = createElement("div",[PROFILE_BIO]);
    let stats = createElement("div",["stats"]);
    let stat_item1 = createElement("div",["stat-item"])
    let stat_item2 = createElement("div",["stat-item"])
    let stat_item3 = createElement("div",["stat-item"])
    let repo_grid = createElement("div",[REPO_GRID])
    let repos_section = createElement("div",["repos-section"]);
    let h2 = document.createElement("h2");
    h2.textContent = "Repositories";
    repos_section.append(h2)

    img.src = user[1].avatar_url;
    name.textContent = "@"+user[1].name;
    user_name.textContent = user[1].login;
    user_bio.textContent = user[1].bio;
    stat_item1.innerHTML = `<strong>${user[1].followers}</strong> followers`
    stat_item2.innerHTML = `<strong>${user[1].following}</strong> following`
    stat_item3.innerHTML = `<strong>${user[1].public_repos}</strong> repositories`

    appendMultipleElements(stats,[stat_item1,stat_item2,stat_item3]);
    appendMultipleElements(profile_info,[name,user_name,user_bio,stats]);
    appendMultipleElements(profile_section,[img,profile_info]);
    appendMultipleElements(container,[profile_section,repos_section,repo_grid]);

     if (user[0].length === 0) {
        repo_grid.innerHTML = '<p style="text-align:center; color:#8b949e;">No public repositories</p>';
    return;
     }

    for (let repo of user[0]){
        createRepos(repo)
    }

}


    
    


    
let form = document.getElementById('form'); 
form.addEventListener('submit', async (e) => {
    e.preventDefault();
    let container = document.querySelector(".container")
    container.innerHTML = ""
    const username = form.username.value.trim();
    if (!username) return;
    const user = await fetchData(username);
    displayProfile(user);
});




