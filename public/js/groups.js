async function loadGroupsPhase(tier){
    let groups = await fetch("/api/groups/"+tier);
    groups = await groups.json();

    let groupPhase = await fetch("/api/group-phase/"+tier);
    groupPhase = await groupPhase.json();

    // console.log(groups);
    let divCont = document.getElementById("groups");
    divCont.innerHTML = "";

    // console.log("groups", groups);
    let list = [groups["1"],groups["2"],groups["3"],groups["4"]]
    // console.log("list",list);
    let groupFromPhase = Object.values(groupPhase)
    list.forEach(function(group, i){
        let g = Object.keys(groups)[i];
        // console.log(g);
        // console.log("Group", groupFromPhase);
        if (g && g != "null") {
            let div = document.createElement("div");
            div.classList.add("group-cont");
            // let header = document.createElement("h3")
            // header.innerText = `Grupo ${g}`
            // div.appendChild(header);

            let topPart = document.createElement("div")
            topPart.classList.add("top-part");

            let groupTable = document.createElement('table');
            groupTable.classList.add("table");
            groupTable.classList.add("table-sm")
            groupTable.classList.add("table-stripped");

            let thead = document.createElement('thead');
            thead.innerHTML = `<tr><th scope="col">Grupo ${g}</th><th scope="col">W/L</th></tr>`
            groupTable.appendChild(thead);

            let tbody = document.createElement('tbody');
            // console.log(group);
            group.forEach((p,i) => {
                // console.log(p);
                let tr = document.createElement('tr');
                tr.classList.add("seed"+p.prevData.seed);
                tr.classList.add("player");
                tr.classList.add("asd");
                // console.log(groupPhase);
                // console.log("points for"+p.nick,calcPoints(p.nick,groupFromPhase));
                let td = document.createElement("td");
                td.innerHTML = p.nick;
                tr.appendChild(td);

                let wlScore = calcPoints(p.nick,groupFromPhase)
                let wl = document.createElement("th");
                wl.setAttribute("scope", "row")
                wl.innerHTML = `${wlScore[0]}/${wlScore[1]}`;
                tr.appendChild(wl);
    
                if (wlScore[0] == 2) {
                    tr.classList.add("qualified")
                } else if(wlScore[1] == 2) {
                    tr.classList.add("disqualified")
                }
                tr.setAttribute("data-score",(wlScore[0]*2)-(wlScore[1]))
                tbody.appendChild(tr);
            })
            sortTable(tbody)
            groupTable.appendChild(tbody);

            topPart.appendChild(groupTable);
            div.appendChild(topPart)

            let botPart = document.createElement('div');
            botPart.classList.add("bot-part");
            
            console.log("asd", groupFromPhase);
            // console.log();

            groupFromPhase[tier-1][i].forEach((gro,f) => {
                let eachJCont = document.createElement("div");
                eachJCont.classList.add("eachJCont")

                let h3 = document.createElement("h3");
                h3.innerHTML = "Ronda "+(f+1)
                eachJCont.appendChild(h3);

                if (f == 1) {
                    gro.forEach((gr,k) => {
                        let t = document.createElement("table");
                        t.classList.add("table");
                        t.classList.add("table-sm");
                        t.style.margin = 0
                        if (k == 0) {
                        }
                        let caption = document.createElement("caption")
                        if (k == 0) {
                            caption.innerHTML = "Match por Clasificación"
                        } else {
                            caption.innerHTML = "Match por Eliminación"
                        }
                        t.appendChild(caption)

                        let tr = document.createElement("tr");
                        
                        let td1 = document.createElement("td");
                        td1.innerHTML = gr.playerOne.nick || "A definir";
                        tr.appendChild(td1);
                        if (gr.winner == 0) {
                            td1.classList.add("winner");
                        } else if (gr.winner == 1){
                            td1.classList.add("loser");
                        }
                        
                        let td2 = document.createElement("th");
                        td2.setAttribute("scope", "row")
                        td2.innerHTML = "vs";
                        tr.appendChild(td2);
    
                        let td3 = document.createElement("td");
                        td3.innerHTML = gr.playerTwo.nick || "A definir";
                        tr.appendChild(td3);
                        if (gr.winner == 1) {
                            td3.classList.add("winner");
                        } else if (gr.winner == 0){
                            td3.classList.add("loser");
                        }
                        tr.addEventListener('dblclick',() => setAWinner(gr,tier,{number: g, members: group},(f+1)))
                        t.appendChild(tr)
                        eachJCont.appendChild(t)
                    })
                    
                } else {
                    let t = document.createElement("table");
                    t.classList.add("table")
                    t.classList.add("caption-top")
                    t.classList.add("table-sm")
                    t.style.margin = 0

                    if (f == 2) {
                        let caption = document.createElement("caption")
                        caption.innerHTML = "Match por Clasificación"
                        t.appendChild(caption)
                    }
    
                    gro.forEach((gr,k) => {
                            let tr = document.createElement("tr");
                            
                            let td1 = document.createElement("td");
                            td1.innerHTML = gr.playerOne.nick || "A definir";
                            tr.appendChild(td1);
                            if (gr.winner == 0) {
                                td1.classList.add("winner");
                            } else if (gr.winner == 1){
                                td1.classList.add("loser");
                            }
                            
                            let td2 = document.createElement("th");
                            td2.setAttribute("scope", "row")
                            td2.innerHTML = "vs";
                            tr.appendChild(td2);
        
                            let td3 = document.createElement("td");
                            td3.innerHTML = gr.playerTwo.nick || "A definir";
                            tr.appendChild(td3);
                            if (gr.winner == 1) {
                                td3.classList.add("winner");
                            } else if (gr.winner == 0){
                                td3.classList.add("loser");
                            }
                            tr.addEventListener('dblclick',() => setAWinner(gr,tier,{number: g, members: group},(f+1)))
                            t.appendChild(tr)
                    })
                    
                    eachJCont.appendChild(t)
                }
                botPart.appendChild(eachJCont)
            })
            div.appendChild(botPart);

            divCont.appendChild(div);
        }
    })
}

async function loadGroupsPage() {
    document.getElementById("main-cont").innerHTML = `
        <div id="main-groups">
            <div id="groups"></div>
        </div>
        <div id="inv"></div>
    `;
    let params = new URLSearchParams(document.location.search);
    let t = params.get("t") || 1;
    tierSelector.value = t;
    let playerList = await fetch(`/api/players/${t}`)
    playerList = await playerList.json();
    // console.log(playerList);
    await loadGroupsPhase(t);
    // loadLeftBar(playerList);
    // loadSeedingGroups(playerList,t);
}

function addGroupsStyles() {
    // document.getElementById("seeding-groups-h3").style.margin = "2px 15px";

    // let elements = [];
    // let seeds = document.getElementById("inv").textContent.split(",");

    // seeds.forEach((seed)=> {
    //     let el = document.getElementsByClassName("seed"+seed);
    //     elements.push(el);
    // })

    // elements.forEach((elements,i) => {
    //     // console.log(Object.values(elements));
    //     Object.values(elements).forEach((activador) => {
    //         console.log();
    //         let tableInfo = Object.values(activador.classList).includes("table-info") ? true : false
            
    //         activador.addEventListener('mouseover', () => {
    //             // Agrega una clase a los elementos que se modificarán
    //             Object.values(document.getElementsByClassName(Object.values(activador.classList).find(c => c.includes("seed")))).forEach(elemento => {
    //                 elemento.classList.add('selected-player');
    //                 if (tableInfo && Object.values(elemento.classList).includes("seeding-tr")) {
    //                     elemento.classList.remove("table-info")
    //                 }
    //             });
    //         })

    //         activador.addEventListener('mouseout', () => {
    //             // Agrega una clase a los elementos que se modificarán
    //             Object.values(document.getElementsByClassName(Object.values(activador.classList).find(c => c.includes("seed")))).forEach(elemento => {
    //                 elemento.classList.remove('selected-player');
    //                 if (tableInfo && Object.values(elemento.classList).includes("seeding-tr")) {
    //                     elemento.classList.add("table-info")
    //                 }
    //             });
    //         })
    //     })
    // })
}