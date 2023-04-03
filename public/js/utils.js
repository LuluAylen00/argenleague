function sliceIntoChunks(arr, chunkSize) {
    const res = [];
    for (let i = 0; i < arr.length; i += chunkSize) {
        const chunk = arr.slice(i, i + chunkSize);
        res.push(chunk);
    }
    return res;
}

function insertParam(key, value) {
    const url = new URL(window.location.href);
    url.searchParams.set(key, value);
    window.history.replaceState(null, null, url); // or pushState
}

function calcPoints(nick,totalSeasonMatches){
    let acc = [0,0];
    // console.log(totalSeasonMatches);
    totalSeasonMatches.forEach(function(tier){
        tier.forEach(fechas => {
            fechas.forEach(fecha => {
                fecha.forEach(match => {
                //    console.log("nick", totalSeasonMatches);
                    // console.log((match.playerOne && match.playerOne.nick == nick));
                    // console.log(match.winner == 0);
                    // console.log((match.playerTwo && match.playerTwo.nick == nick));
                    // console.log(match.winner == 1);

                    if ((match.playerOne && match.playerOne.nick == nick) && match.winner == 0 || (match.playerTwo && match.playerTwo.nick == nick) && match.winner == 1) {
                        acc[0]++
                    } else if ((match.playerOne && match.playerOne.nick == nick) && match.winner == 1 || (match.playerTwo && match.playerTwo.nick == nick) && match.winner == 0){
                        acc[1]++
                    }
                })
            })
        })
    })
    // console.log("el jugador "+nick+" va "+acc);
    return acc;
}

function setAWinner(match, tier, group,round) {
    // console.log("match",match);
    // console.log("group",group);
    if (group.members.length == 4 && (match.playerOne != "TBD" && match.playerTwo != "TBD") ) {
        // Muestra el popup con SweetAlert
        Swal.fire({
            title: `Que jugador ganó el duelo de la ronda ${round} en el grupo ${group.number}?`,
            showDenyButton: true,
            showCancelButton: true,
            confirmButtonColor: '#3f47cc',
            denyButtonColor: '#ed1b24',
            confirmButtonText: match.playerOne.nick,
            denyButtonText: match.playerTwo.nick,
            cancelButtonText: `Limpiar`,
            focusCancel: true
        }).then(async(result) => {
            if (result.isConfirmed) {
                let fetching = await fetch(`/api/group-phase/${tier}`,{
                    method: 'POST',
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        match: match.id,
                        winner: 0
                    })
                })
                fetching = await fetching.json();
                console.log(fetching);
                if (fetching.status == 200) {
                    Swal.fire(`${match.playerOne.nick} ha ganado!`, '', 'success')
                    await setPage();
                }
            } else if (result.isDenied) {
                let fetching = await fetch(`/api/group-phase/${tier}`,{
                    method: 'POST',
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        match: match.id,
                        winner: 1
                    })
                })
                fetching = await fetching.json();

                if (fetching.status == 200) {
                    Swal.fire(`${match.playerTwo.nick} ha ganado!`, '', 'success')
                    await setPage();
                }
            }  else if (result.isDismissed && result.dismiss == "cancel") {
                let fetching = await fetch(`/api/group-phase/${tier}`,{
                    method: 'POST',
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        match: match.id,
                        winner: null
                    })
                })
                fetching = await fetching.json();

                if (fetching.status == 200) {
                    Swal.fire(`Se ha reiniciado la partida`, '', 'info')
                    await setPage();
                }
            }
        });
    } else if (group.members.length != 4) {
        Swal.fire({
            title: `El grupo ${group.number} no está completo. No es posible completar partidas hasta que el grupo tenga la cantidad necesaria de jugadores`,
            confirmButtonText: 'Ok'
        })
    } else if (!(match.playerOne != "TBD" && match.playerTwo != "TBD")) {
        Swal.fire({
            title: `La llave de esta partida no está completa, deben estar ambos jugadores ya seleccionados para poder asignar un ganador`,
            confirmButtonText: 'Ok'
        })
    } else {
        Swal.fire({
            title: `Ha ocurrido un error inesperado, vuelve a intentarlo mas tarde`,
            confirmButtonText: 'Ok'
        })
    }
}

function sortTable(table) {
    var rows, switching, i, x, y, shouldSwitch;
    switching = true;
    while (switching) {
      switching = false;
      rows = table.rows;
      for (i = 0; i < (Array.from(table.rows).length - 1); i++) {
        shouldSwitch = false;
        x = rows[i].getAttribute('data-score');
        y = rows[i + 1].getAttribute('data-score');
        if (x < y) {
          shouldSwitch = true;
          break;
        }
      }
      if (shouldSwitch) {
        rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
        switching = true;
      }
    }
  }