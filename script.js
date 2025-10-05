

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

const octokit = new Octokit({
    auth:TOKEN
})

async function fetchData(username){

    try {
        const response = await Promise.all([
            octokit.request(`GET /users/${username}/followers`),
            octokit.request(`GET /users/${username}/repos`),
            octokit.request(`GET /users/${username}`)
        ])
        return response.map(element => element.data )
    } catch (error) {
        
        console.log("Error handled",error.message)  
        return error
    }   
}
async function  displayeProfile(user){
    let name = document.querySelector(".profile-info > h1");
    let username = document.querySelector(".username");
    let bio = document.querySelector(".bio");
    let stats = document.querySelectorAll(".stats > .stat-item")   
    let img = document.querySelector("img")
    let userData = await fetchData(user)
    name.textContent = userData[2].name
    username.textContent = userData[2].login
    bio.textContent = userData[2].bio
    stats[0].innerHTML = `<strong>${userData[2].followers}</strong> followers`
    stats[1].innerHTML = `<strong>${userData[2].followings}</strong> followings`
    stats[1].innerHTML = `<strong>${userData[2].public_repos}</strong> repositories`
    img.src = userData[2].avatar_url
   
    for (let repo of userData[1]){
        createReposDom(repo)
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
function createReposDom(repo){
    
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
    // language_dot.classList.add(repo.language)
    appendMultipleElements(repo_header,[repo_icon,repo_name]);
    appendMultipleElements(repo_footer,[repo_stat,repo_stat_1,repo_stat_2])
    repo_stat.append(language_dot)
    appendMultipleElements(repo_card,[repo_header,repo_description,repo_footer])
    repo_grid.append(repo_card)

    console.log(repo_stat)
    repo_name.textContent = repo.name

    repo_description.textContent = repo.description || " No description was provided by the created of the repo"
    
    repo_stat.append(" "+repo.language)
    repo_stat_1.textContent = "⭐ "+ repo.watchers
    repo_stat_2.textContent = "🔄 0 "
}



    displayeProfile("itsmoetaz")
    




