function loading(){
    let main = document.getElementById("main-cont");
    main.innerHTML = `
    <div id="loader">
        <svg viewBox="0 0 60 60" width="160" stroke="#13304c" stroke-linejoin="round">
            <g id="cube" fill="#4a7ba1">
                <path id="base"/>
                <path id="lid"/>
            </g>
        </svg>
    </div>
    `
        var cube = document.getElementById('cube');
        var lid = document.getElementById('lid');
        var base = document.getElementById('base');
        
        var lid_coordinates = [
          // lid outline
          [[-3,3,3],[-3,-3,3],[3,-3,3],[3,3,3],[-3,3,3],[-3,3,1],[-3,-3,1],[3,-3,1],[3,-3,3]],
          // lid inner lines
          [[3,1,3],[-3,1,3],[-3,1,1]],
          [[3,-1,3],[-3,-1,3],[-3,-1,1]],
          [[-3,-3,3],[-3,-3,1]],
          [[-1,-3,1],[-1,-3,3],[-1,3,3]],
          [[1,-3,1],[1,-3,3],[1,3,3]]
        ];
      
        var base_coordinates = [
          [[-3,3,1],[3,3,1],[3,-3,1],[-3,-3,1],[-3,3,1],[-3,3,-3],[-3,-3,-3],[3,-3,-3],[3,-3,1]],
          [[1,-3,-3],[1,-3,1],[1,1,1],[-3,1,1],[-3,1,-3]],
          [[-1,-3,-3],[-1,-3,1],[-1,-1,1],[-3,-1,1],[-3,-1,-3]],
          [[-3,-3,-3],[-3,-3,1]],
          [[-3,3,-1],[-3,-3,-1],[3,-3,-1]]
        ];
      
        var u = 4; // size of the cube
        var t = 0; // time
      
        /*
         * Take in arrays of arrays of coordinates and projects them onto an isometric grid.
         * We also pass a parameter t to control the Z rotation of the object, so it can be animated.
         */
        function project(coordinatesGroup, t) {
          return coordinatesGroup.map(function (coordinatesSubGroup) {
            return coordinatesSubGroup.map(function (coordinates) {
              var x = coordinates[0];
              var y = coordinates[1];
              var z = coordinates[2];
      
              return [
                (x *  Math.cos(t) - y * Math.sin(t)) * u + 30,
                (x * -Math.sin(t) - y * Math.cos(t) - z * Math.sqrt(2)) * u / Math.sqrt(3) + 30
              ];
            });
          });
        }
        
        /*
         * Takes in arrays of arrays of coordinates and outputs an SVG path 'd' attribute.
         * The pen is lifted between child arrays, which represent series of lines.
         * The pen draws a line through all coordinates in the grandchild arrays.
         */
        function toPath(coordinates) {
          return 'M' + (JSON
            .stringify(coordinates)
            .replace(/]],\[\[/g, 'M')
            .replace(/],\[/g, 'L')
            .slice(3, -3)
          );
        }
      
        /*
         * A discontinuous sine ease-in-out easing function.
         * It starts with the lid rotated at 45 degrees (lines up with the rest of the cube).
         * It eases into a rotation, reaching its maximum speed at 90 degrees.
         * It snaps back to 0 degrees (to emulate that it has continued spinning), keeping its velocity.
         * It eases out of the rotation, coming to a stop at 45 degrees, ready to repeat.
        */
        function easing(t) {
          return (2 - Math.cos(Math.PI * t)) % 2 * Math.PI / 4;
        }
        
        /*
         * run every frame
         */
        function tick() {
          t = (t + 1/30) % 3;
          // rotate the entire cube every spin, to mimic differnt faces being turned
          cube.style.transform = 'rotate(' + (Math.floor(t) * 120) + 'deg)';
          
          lid.setAttribute('d', toPath(project(lid_coordinates, easing(t))));
          requestAnimationFrame(tick);
        }
        
        base.setAttribute('d', toPath(project(base_coordinates, Math.PI / 4)));
      
        tick();
      
}

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

function calcPoints(nick,fecha){
    let acc = [0,0];
    // console.log(totalSeasonMatches);
    fecha = fecha.map(asd => [asd[0][0],asd[0][1],asd[1][0],asd[1][1],asd[2][0]])
    fecha = [...fecha[0],...fecha[1],...fecha[2],...fecha[3]]
    // console.log("fecha",fecha);
    // fecha = 
    fecha.forEach(match => {
    //    console.log("nick", totalSeasonMatches);
        // console.log((match.jugadorUno && match.jugadorUno.nick == nick));
        // console.log(match.winner == 0);
        // console.log((match.jugadorDos && match.jugadorDos.nick == nick));
        // console.log(match.winner == 1);
        // console.log(nick, match.jugadorUno ? match.jugadorUno.nick : "Nadie", match.jugadorDos ? match.jugadorDos.nick : "Nadie");
        if ((match.jugadorUno && match.jugadorUno.nick == nick) && match.ganador == 0) {
            // console.log(nick + " ganó en la fecha "+ match.fechaId + " a "+match.jugadorDos.nick);
        } else if ((match.jugadorDos && match.jugadorDos.nick == nick) && match.ganador == 1) {
            // console.log(nick + " ganó en la fecha "+ match.fechaId + " a "+match.jugadorUno.nick);
        } else if ((match.jugadorUno && match.jugadorUno.nick == nick) && match.ganador == 1) {
            // console.log(nick + " perdió en la fecha "+ match.fechaId + " contra "+match.jugadorDos.nick);
        } else if ((match.jugadorDos && match.jugadorDos.nick == nick) && match.ganador == 1) {
            // console.log(nick + " perdió en la fecha "+ match.fechaId + " contra "+match.jugadorUno.nick);
        }

        if ((match.jugadorUno && match.jugadorUno.nick == nick) && match.ganador == 0 || (match.jugadorDos && match.jugadorDos.nick == nick) && match.ganador == 1) {
            // console.log(nick + " ganó en la fecha "+ match.fecha);
            acc[0]++
        } else if ((match.jugadorUno && match.jugadorUno.nick == nick) && match.ganador == 1 || (match.jugadorDos && match.jugadorDos.nick == nick) && match.ganador == 0){
            acc[1]++
        }
    })
    // console.log("el jugador "+nick+" va "+acc);
    return acc;
}

function getCookie(cname) {
    let name = cname + "=";
    let decodedCookie = decodeURIComponent(document.cookie);
    let ca = decodedCookie.split(';');
    for(let i = 0; i <ca.length; i++) {
      let c = ca[i];
      while (c.charAt(0) == ' ') {
        c = c.substring(1);
      }
      if (c.indexOf(name) == 0) {
        return c.substring(name.length, c.length);
      }
    }
    return "";
  }

function verifyAdmin() {
    let data = getCookie("user");
    return data == "$2a$10$S71t6BVaKWDDPEmietxwme0dN81mzhz5M0mL0LUUA6LqohqfV0Cmq";
}

function setCookie(cname, cvalue, exdays) {
    const d = new Date();
    d.setTime(d.getTime() + (exdays*24*60*60*1000));
    let expires = "expires="+ d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
  }

function deduce(slot, cat) {
    // switch (cat) {
    //     case 1:
            
    //         break;
    
    //     default:
    //         break;
    // }
    // console.log(slot, cat);
    // let slot = parseInt(slot)
    switch (parseInt(slot)) {
        case 1:
        case 8:
            return 1 + ((parseInt(cat)-1) *8);
        case 2:
        case 7:
            return 2 + ((parseInt(cat)-1) *8);
        case 3:
        case 6:
            return 3 + ((parseInt(cat)-1) *8);
        case 4:
        case 5:
            return 4 + ((parseInt(cat)-1) *8);
        default:
            return null;
    }
}

function setAdmin(pass) {
    setCookie("user", pass, 365);
}

function toggleAdminLogin() {
    Swal.fire({
        title: 'Ingresa tu clave',
        input: 'password',
        inputAttributes: {
          autocapitalize: 'off'
        },
        showCancelButton: false,
        confirmButtonText: 'Ok',
        showLoaderOnConfirm: true,
        preConfirm: (login) => {
            setAdmin(login)
            setPage();
        },
        allowOutsideClick: () => !Swal.isLoading()
        }).then((result) => {
            if (result.success) {
                Swal.fire({
                    title: `Contraseña ingresada con éxito`
                })
            }
        })
}

function setAWinner(match, tier, group,round) {
    // console.log("match",match);
    // console.log("group",group);
    if (group.members.length == 4 && (match.jugadorUno && match.jugadorDos ) ) {
        // Muestra el popup con SweetAlert
        Swal.fire({
            title: `Que jugador ganó el duelo de la ronda ${round} en el grupo ${group.number}?`,
            showDenyButton: true,
            showCancelButton: true,
            confirmButtonColor: '#3f47cc',
            denyButtonColor: '#ed1b24',
            confirmButtonText: match.jugadorUno.nick,
            denyButtonText: match.jugadorDos.nick,
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
                // console.log(fetching);
                if (fetching.status == 200) {
                    // Swal.fire(`${match.jugadorUno.nick} ha ganado!`, '', 'success')
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
                    // Swal.fire(`${match.jugadorDos.nick} ha ganado!`, '', 'success')
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
                    // Swal.fire(`Se ha reiniciado la partida`, '', 'info')
                    await setPage();
                }
            }
        });
    } else if (group.members.length != 4) {
        Swal.fire({
            title: `El grupo ${group.number} no está completo. No es posible completar partidas hasta que el grupo tenga la cantidad necesaria de jugadores`,
            confirmButtonText: 'Ok'
        })
    } else if (!(match.jugadorUno && match.jugadorDos )) {
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

function getMatches(matches) {
    let data = [
        matches.filter((p,i) => {
            return (i+1) <= (1 * 5) && (i+1) > ((1-1) * 5)
        }),
        matches.filter((p,i) => {
            return (i+1) <= (2 * 5) && (i+1) > ((2-1) * 5)
        }),
        matches.filter((p,i) => {
            return (i+1) <= (3 * 5) && (i+1) > ((3-1) * 5)
        }),
        matches.filter((p,i) => {
            return (i+1) <= (4 * 5) && (i+1) > ((4-1) * 5)
        })
    ]
    
    return data.map(g => {
        let acc = [[g[0],g[1]],[g[2],g[3]],[g[4]]];
        return acc
    })
}