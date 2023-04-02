let divCont = document.getElementById("cont");

function addStyles() {
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
            
            activador.addEventListener('mouseover', () => {
                // Agrega una clase a los elementos que se modificarán
                Object.values(document.getElementsByClassName(Object.values(activador.classList).find(c => c.includes("seed")))).forEach(elemento => {
                    elemento.classList.add('selected-player');
                });
            })

            activador.addEventListener('mouseout', () => {
                // Agrega una clase a los elementos que se modificarán
                Object.values(document.getElementsByClassName(Object.values(activador.classList).find(c => c.includes("seed")))).forEach(elemento => {
                    elemento.classList.remove('selected-player');
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

    groups.forEach(function(group, i){
        let table = document.createElement('table');
        table.classList.add("table");
        table.classList.add("table-stripped");

        table.innerHTML = `
        <caption>Tómbola ${i+1} (${(i*4)+1}-${(i*4)+4})</caption>
        `
        let tbody = document.createElement('tbody');
        group.forEach((p,i) => {
            let tr = document.createElement('tr');
            tr.classList.add("seed"+p.prevData.seed);
            tr.classList.add("player");
            tr.classList.add("asd");

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

async function loadPlayers(tier) {
    let playerList = await fetch(`/api/players/${tier}`)
    playerList = await playerList.json();
    // console.log(playerList);
    await loadGroups(tier);
    loadLeftBar(playerList);
    loadSeedingGroups(playerList,tier);
}

async function updateGroups(tier){
    await loadGroups(tier);
    addStyles();
}

loadPlayers(1).then(()=>{

    addStyles();
})
