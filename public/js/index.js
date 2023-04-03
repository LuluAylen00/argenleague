
let divCont = document.getElementById("cont");

function addSeedingStyles() {
    document.getElementById("seeding-groups-h3").style.margin = "2px 15px";

    let elements = [];
    let seeds = document.getElementById("inv").textContent.split(",");

    seeds.forEach((seed)=> {
        let el = document.getElementsByClassName("seed"+seed);
        elements.push(el);
    })

    elements.forEach((elements,i) => {
        // console.log(Object.values(elements));
        Object.values(elements).forEach((activador) => {
            console.log();
            let tableInfo = Object.values(activador.classList).includes("table-info") ? true : false
            
            activador.addEventListener('mouseover', () => {
                // Agrega una clase a los elementos que se modificarán
                Object.values(document.getElementsByClassName(Object.values(activador.classList).find(c => c.includes("seed")))).forEach(elemento => {
                    elemento.classList.add('selected-player');
                    if (tableInfo && Object.values(elemento.classList).includes("seeding-tr")) {
                        elemento.classList.remove("table-info")
                    }
                });
            })

            activador.addEventListener('mouseout', () => {
                // Agrega una clase a los elementos que se modificarán
                Object.values(document.getElementsByClassName(Object.values(activador.classList).find(c => c.includes("seed")))).forEach(elemento => {
                    elemento.classList.remove('selected-player');
                    if (tableInfo && Object.values(elemento.classList).includes("seeding-tr")) {
                        elemento.classList.add("table-info")
                    }
                });
            })
        })
    })
}

async function loadLeftBar(players) {
    let leftTable = document.getElementById("seed-table");
    leftTable.innerHTML = `
    <thead class="thead-dark">
        <tr>
            <th scope="col">Seed</th>
            <th scope="col">Jugador</th>
            <th scope="col">Elo</th>
        </tr>
    </thead>
    `;
    let body = document.createElement("tbody");
    // console.log(players);
    let inv = document.getElementById("inv");
    let acc = [];
    players.forEach((player) => {
        acc.push(player.prevData.seed);
        let tr = document.createElement("tr");
        tr.classList.add("seed"+player.prevData.seed);
        tr.classList.add("player");
        tr.classList.add("asd");

        let seed = document.createElement("th");
        seed.setAttribute("scope", "row")
        seed.innerHTML = player.prevData.seed;
        tr.appendChild(seed);

        let td = document.createElement("td");
        td.innerHTML = player.nick;
        tr.appendChild(td);

        let eloTd = document.createElement("td");
        eloTd.innerHTML = player.prevData.elo;
        tr.appendChild(eloTd);

        body.appendChild(tr);
    })
    inv.textContent = acc.toString();
    leftTable.appendChild(body);
}

function loadSeedingGroups(players, tier){
    let groups = sliceIntoChunks(players, 4);
    let divCont = document.getElementById("seeding-groups");
    divCont.innerHTML = "";

    groups.forEach(function(group, i){
        let table = document.createElement('table');
        table.classList.add("table");
        table.classList.add("table-stripped");
        table.classList.add("table-sm")

        table.innerHTML = `
        <caption>Tómbola ${i+1} (Seeds ${(i*4)+1}-${(i*4)+4})</caption>
        `
        let tbody = document.createElement('tbody');
        group.forEach((p,i) => {
            let tr = document.createElement('tr');
            tr.classList.add("seed"+p.prevData.seed);
            tr.classList.add("player");
            tr.classList.add("asd");
            tr.classList.add("seeding-tr");
            if (p.group != null) {
                tr.classList.add("table-info")
            } else {
                tr.classList.remove("table-info")
            }

            let seed = document.createElement("th");
            seed.setAttribute("scope", "row")
            seed.innerHTML = p.prevData.seed;
            tr.appendChild(seed);

            let td = document.createElement("td");
            td.innerHTML = p.nick;
            tr.appendChild(td);

            let aTd = document.createElement("td");
            let a = document.createElement("a");
            a.classList.add("btn");
            a.classList.add("btn-success");
            a.setAttribute("href","#");
            a.setAttribute("role","button");
            a.innerHTML = `<i class="fas fa-pen"></i>`

            a.addEventListener("click", ()=>{
                Swal.fire({
                    title: `Introduce el nuevo grupo para ${p.nick}`,
                    input: 'text',
                    allowOutsideClick: false,
                    inputAttributes: {
                      autocapitalize: 'off'
                    },
                    showCancelButton: true,
                    cancelButtonText: "Cancelar",
                    confirmButtonText: 'Aceptar',
                    showLoaderOnConfirm: true,
                    preConfirm: async (info) => {
                        console.log(info);
                        let fetching = await fetch(`/api/groups/`,{
                            method: 'POST',
                            headers: {
                                "Content-Type": "application/json",
                            },
                            body: JSON.stringify({
                                id: p.id,
                                group: info
                            })
                        })
                        fetching = await fetching.json();

                        if (fetching.status == 200) {
                            Swal.fire({
                                title: `${p.nick} ahora es parte del grupo ${info}`,
                                confirmButtonText: 'Ok',
                            })
                            await updateGroups(tier)
                        } else if (fetching.status == 400) {
                            Swal.fire({
                                title: `El valor ingresado (${info}) no parece ser válido`,
                                confirmButtonText: 'Ok'
                            })
                        } else {
                            Swal.fire({
                                title: `El grupo ${info} está lleno, remueve algún integrante para seguir agregando`,
                                confirmButtonText: 'Ok'
                            })
                        }
                    },
                })
            })

            aTd.appendChild(a);
            tr.appendChild(aTd);

            tbody.appendChild(tr);
        })
        table.appendChild(tbody);

        
        divCont.appendChild(table);
    })
}

async function loadGroups(tier){
    let groups = await fetch("/api/groups/"+tier);
    groups = await groups.json();

    // console.log(groups);
    let divCont = document.getElementById("groups");
    divCont.innerHTML = "";

    Object.values(groups).forEach(function(group, i){
        let g = Object.keys(groups)[i];
        if (g != "null") {
            let div = document.createElement("div");
            div.classList.add("table-cont");
            // let header = document.createElement("h3")
            // header.innerText = `Grupo ${g}`
            // div.appendChild(header);

            let table = document.createElement('table');
            table.classList.add("table");
            table.classList.add("table-stripped");

            let thead = document.createElement('thead');
            thead.innerHTML = `<tr><th scope="col">Grupo ${g}</th></tr>`
            table.appendChild(thead);

            let tbody = document.createElement('tbody');
            group.forEach((p,i) => {
                let tr = document.createElement('tr');
                tr.classList.add("seed"+p.prevData.seed);
                tr.classList.add("player");
                tr.classList.add("asd");

                tr.addEventListener("dblclick", () => {
                    Swal.fire({
                        title: `Quieres remover a ${p.nick} del grupo ${p.group}`,
                        showCancelButton: true,
                        confirmButtonText: 'Confirmar',
                        cancelButtonText: `Volver`,
                      }).then(async (result) => {
                        /* Read more about isConfirmed, isDenied below */
                        if (result.isConfirmed) {
                            await fetch(`/api/groups/`,{
                                method: 'DELETE',
                                headers: {
                                    "Content-Type": "application/json",
                                },
                                body: JSON.stringify({
                                    id: p.id
                                })
                            })
                            Swal.fire(`${p.nick} ahora está sin grupo`, '', 'success')
                            await updateGroups(tier);
                        }
                      })
                })
    
                let td = document.createElement("td");
                td.innerHTML = p.nick;
                tr.appendChild(td);
    
                tbody.appendChild(tr);
            })
            table.appendChild(tbody);
    
            div.appendChild(table)
            divCont.appendChild(div);
        }
    })
}

let tierSelector = document.getElementById("tier-selector");

async function loadSeedingPage() {
    document.getElementById("main-cont").innerHTML = `
    <div id="left-bar" class="table-cont">
            <table id="seed-table" class="table table-striped"></table>
        </div>
        <div id="main">
            <div id="groups"></div>
            <div id="cont" class="table-cont">
                <h3 id="seeding-groups-h3">
                    Grupos de sorteo 
                    <i class="fa-solid fa-circle-info"></i>
                    <p class="seeding-info">
                        Los grupos de sorteo son creados dividiendo por 4 los jugadores según su número de seed inicial (basado en su elo), es decir, el primer grupo está conformado por los primeros 4 jugadores clasificados en cada categoría, el segundo por los segundos 4 (5-8) y así. <br />De estos grupos saldrá sorteado un jugador para cada uno de los grupos finales, quedando cada uno en un grupo distinto.
                    </p>
                </h3>
                <div id="seeding-groups" class="table-responsive"></div>
            </div>
        </div>
        <div id="inv"></div>
    `;
    let params = new URLSearchParams(document.location.search);
    let t = params.get("t") || 1;
    tierSelector.value = t;
    let playerList = await fetch(`/api/players/${t}`)
    playerList = await playerList.json();
    // console.log(playerList);
    await loadGroups(t);
    loadLeftBar(playerList);
    loadSeedingGroups(playerList,t);
}

async function updateGroups(){
    let params = new URLSearchParams(document.location.search);
    let t = params.get("t");
    tierSelector.value = t;
    let playerList = await fetch(`/api/players/${t}`)
    playerList = await playerList.json();
    await loadGroups(t);
    loadLeftBar(playerList);
    loadSeedingGroups(playerList,t);
    addSeedingStyles();
}

tierSelector.addEventListener("change", (e)=>{
    insertParam('t', e.target.value);
    // updateGroups(e.target.value);
    setPage()
})

async function setPage() {
    let params = new URLSearchParams(document.location.search);
    let p = params.get("p") || "seeding"
    if (p == "seeding") {
        await loadSeedingPage().then(()=>{
            addSeedingStyles();
        })
    } else if (p == "groups") {
        await loadGroupsPage().then(()=>{
            addGroupsStyles();
        })
    } else if (p == "final") {
        await loadFinalPage().then(()=>{
            addFinalStyles();
        })
    } else {
        insertParam('p', "seeding");
        await loadSeedingPage().then(()=>{
            addSeedingStyles();
        })
    }
}

setPage();

document.getElementById("sort").addEventListener("click", ()=>{
    insertParam('p', "seeding")
    setPage();
})
document.getElementById("groupPhase").addEventListener("click", ()=>{
    insertParam('p', "groups")
    setPage();
})
document.getElementById("finalPhase").addEventListener("click", ()=>{
    insertParam('p', "final")
    setPage();
})
