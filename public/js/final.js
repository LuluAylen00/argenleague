async function loadFinalPage() {
    document.getElementById("main-cont").innerHTML = ``;
    let params = new URLSearchParams(document.location.search);
    let t = params.get("t") || 1;
    tierSelector.value = t;
    let playerList = await fetch(`/api/players/${t}`)
    playerList = await playerList.json();
    // console.log(playerList);
    // await loadGroups(t);
    // loadLeftBar(playerList);
    // loadSeedingGroups(playerList,t);
}

function addFinalStyles() {
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