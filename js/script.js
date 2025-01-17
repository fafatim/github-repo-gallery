const overview = document.querySelector(".overview");
const username = "fafatim"
const repoList = document.querySelector(".repo-list");
const reposSection = document.querySelector(".repos")
const repoDataInfo = document.querySelector(".repo-data")
const button = document.querySelector('button');
const filterInput = document.querySelector(".filter-repos");

const gitUserInfo = async function(){
    const userInfo = await fetch(`https://api.github.com/users/${username}`)
    const data = await userInfo.json();
    console.log(data);

    displayUserInfo(data)

}

gitUserInfo()
const displayUserInfo = function(data){
    const div = document.createElement("div")
    div.classList.add("user-info");
    div.innerHTML = ` <figure>
      <img alt="user avatar" src=${data.avatar_url} />
    </figure>
    <div>
      <p><strong>Name:</strong> ${data.name}</p>
      <p><strong>Bio:</strong> ${data.bio}</p>
      <p><strong>Location:</strong> ${data.location}</p>
      <p><strong>Number of public repos:</strong> ${data.public_repos}</p>
    </div>`;
    overview.append(div);
    getRepos()
}
const getRepos = async function(){
    const repositories = await fetch(`https://api.github.com/users/${username}/repos?sort=updated&per_page=100`);
    const repoData = await repositories.json()
    console.log(repoData)
    displayInfoAboutRepo(repoData);
}
const displayInfoAboutRepo =  function(repos){
    filterInput.classList.remove("hide")
    for(const repo of repos){
        const repoItem = document.createElement("li")
         repoItem.classList.add("repo");
        repoItem.innerHTML = `<h3>${repo.name}</h3>`
        repoList.append(repoItem)
    }
};
repoList.addEventListener("click",function(e){
    if(e.target.matches("h3")){
        const repoName = e.target.innerText;
       gitRepoInfo(repoName)
    }
})
const gitRepoInfo = async function(repoName){
    const fetchInfo = await fetch(`https://api.github.com/repos/${username}/${repoName}`);
    const repoInfo = await fetchInfo.json();
    const fetchLanguages = await fetch(repoInfo.languages_url);
    const languageData = await fetchLanguages.json();
    console.log(languageData)
    const languages = [];
    for(let language in languageData){
        languages.push(language)
    }
   specificRepoInfo(repoInfo, languages)
}
const specificRepoInfo = function(repoInfo, languages) {
    button.classList.remove("hide");
    repoDataInfo.innerHTML = "";
    repoDataInfo.classList.remove("hide");
    reposSection.classList.add("hide");
    const div = document.createElement("div");
    div.innerHTML = `
<h3>Name: ${repoInfo.name}</h3>
    <p>Description: ${repoInfo.description}</p>
    <p>Default Branch: ${repoInfo.default_branch}</p>
    <p>Languages: ${languages.join(", ")}</p>
    <a class="visit" href="${repoInfo.html_url}" target="_blank" rel="noreferrer noopener">View Repo on GitHub!</a>`
   repoDataInfo.append(div);


};
button.addEventListener("click", function(){
    reposSection.classList.remove("hide");
    repoDataInfo.classList.add("hide");
    button.classList.add("hide")

})
filterInput.addEventListener("input",function(e){
    let searchText = document.querySelector(".filter-repos").value;
    const repos = document.querySelectorAll(".repo")
    const searchLowerText = searchText.toLowerCase();
    for(const repo of repos){
        let repoLowerText = repo.innerText.toLowerCase();
        if(repoLowerText.includes(searchLowerText)){
          repos.classList.remove("hide")
        } else{
            repos.classList.add("hide");
        }
    }

});