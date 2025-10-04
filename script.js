

import { Octokit, App } from "https://esm.sh/octokit";
import {TOKEN} from "./config.js"

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


console.log(await fetchData("ahmedjebari022"))


