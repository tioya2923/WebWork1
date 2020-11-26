window.onload = function() {
    const urlBase = "https://fcawebbook.herokuapp.com"

    const btnLogin = document.getElementById("btnLogin")
    const btnRegister = document.getElementById("btnRegister")
    const aSponsors = document.getElementById("umUtilizador")

    aUser.addEventListener("click", function() {
        document.getElementById("utilizador").scrollIntoView({ behavior: 'smooth' })
    })

    aUser.addEventListener("mouseover", function() {
        document.getElementById("umUtilizador").style.cursor = "pointer";
    })



    // Autenticar administrador na área privada
    btnLogin.addEventListener("click", function() {
        swal({
            title: "Acesso à área de gestão da Hollywood",
            html: '<input id="txtEmail" class="swal2-input" placeholder="e-mail">' +
                '<input id="txtPass" class="swal2-input" placeholder="password">',
            showCancelButton: true,
            confirmButtonText: "Entrar",
            cancelButtonText: "Cancelar",
            showLoaderOnConfirm: true,
            preConfirm: () => {
                const email = document.getElementById('txtEmail').value
                const pass = document.getElementById('txtPass').value
                return fetch(`${urlBase}/signin`, {
                        headers: {
                            "Content-Type": "application/x-www-form-urlencoded"
                        },
                        method: "POST",
                        body: `email=${email}&password=${pass}`
                    })
                    .then(response => {
                        if (!response.ok) {
                            throw new Error(response.statusText);
                        }
                        return response.json();
                    })
                    .catch(error => {
                        swal.showValidationError(`Pedido falhado: ${error}`);
                    });
            },
            allowOutsideClick: () => !swal.isLoading()
        }).then(result => {
            console.log(result.value)

            if (result.value.sucesss) {
                swal({ title: "Autenticação feita com sucesso!" })
                window.location.replace("admin/participants.html")
            } else {
                swal({ title: `${result.value.message.pt}` })
            }

        });
    });


    // Registar participante
    btnRegister.addEventListener("click", function() {
        swal({
            title: "Registar-se na Hollywood",
            html: '<input id="swal-input1" class="swal2-input" placeholder="nome">' +
                '<input id="swal-input2" class="swal2-input" placeholder="e-mail">',
            showCancelButton: true,
            confirmButtonText: "Inscrever",
            cancelButtonText: "Cancelar",
            showLoaderOnConfirm: true,
            preConfirm: () => {
                const name = document.getElementById('swal-input1').value
                const email = document.getElementById('swal-input2').value
                return fetch(`${urlBase}/utilizador/${email}`, {
                        headers: {
                            "Content-Type": "application/x-www-form-urlencoded"
                        },
                        method: "POST",
                        body: `nomeparticipant=${name}`
                    })
                    .then(response => {
                        if (!response.ok) {
                            throw new Error(response.statusText);
                        }
                        return response.json();
                    })
                    .catch(error => {
                        swal.showValidationError(`Request failed: ${error}`);
                    });
            },
            allowOutsideClick: () => !swal.isLoading()
        }).then(result => {
            if (result.value) {
                if (!result.value.err_code) {
                    swal({ title: "Inscrição feita com sucesso!" })
                } else {
                    swal({ title: `${result.value.err_message}` })
                }
            }
        });
    });


    /* 
      Get peples from server
    */
    (async() => {
        const renderPeople = document.getElementById("renderPeople")
        let txtPeople = ""
        const response = await fetch(`${urlBase}/conferences/1/speakers`)
        const people = await response.json()

        for (const people of people) {
            txtPeople += `
      <div class="col-sm-4">
        <div class="team-member">      
          <img id="${people.idPeople}" class="mx-auto rounded-circle viewSpeaker" src="${people.foto}" alt="">
          <h4>${people.nome}</h4>
          <p class="text-muted">${people.cargo}</p>
          <ul class="list-inline social-buttons">`
            if (people.twitter !== null) {
                txtPeople += `
          <li class="list-inline-item">
            <a href="${people.twitter}" target="_blank">
              <i class="fab fa-twitter"></i>
            </a>
          </li>`
            }
            if (people.facebook !== null) {
                txtPeople += `
          <li class="list-inline-item">
            <a href="${people.facebook}" target="_blank">
              <i class="fab fa-facebook-f"></i>
            </a>
          </li>`
            }
            if (people.linkedin !== null) {
                txtPeople += `
          <li class="list-inline-item">
            <a href="${people.linkedin}" target="_blank">
              <i class="fab fa-linkedin-in"></i>
            </a>
          </li>`
            }
            txtPeople += `                
          </ul>
        </div>
      </div>
      `
        }
        renderPeoples.innerHTML = txtPeople;


        // Gerir clique na imagem para exibição da modal    
        const btnView = document.getElementsByClassName("viewPeople")
        for (let i = 0; i < btnView.length; i++) {
            btnView[i].addEventListener("click", () => {
                for (const people of peoples) {
                    if (people.idPeople == btnView[i].getAttribute("id")) {
                        swal({
                            title: people.nome,
                            text: people.bio,
                            imageUrl: people.foto,
                            imageWidth: 400,
                            imageHeight: 400,
                            imageAlt: 'Foto do orador',
                            animation: false
                        })
                    }
                }
            })
        }

    })();



    /*
      Post user messages to the server
    */

    const contactForm = document.getElementById("contactForm")
    contactForm.addEventListener("submit", async function() {
        const name = document.getElementById("name")
        const email = document.getElementById("email")
        const subject = document.getElementById("subject")
        const response = await fetch(`${urlBase}/hollywood/1/contacts/emails`, {
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            },
            method: "POST",
            body: `email=${email}&name=${name}&subject=${subject}`
        })
        const result = await response.json()

        // What to do with the result?

    });




};

function myMap() {

    // Ponto no mapa a localizar a Hollywood
    const hollywood = new google.maps.LatLng(34.09368925232231, -118.32874681242714)

    // Propriedades do mapa
    const mapProp = {
        center: hollywood,
        zoom: 12,
        scrollwheel: false,
        draggable: false,
        mapTypeId: google.maps.MapTypeId.ROADMAP
    }

    // Mapa
    const map = new google.maps.Map(document.getElementById("googleMap"), mapProp);

    // Janela de informação (info window)
    const infowindow = new google.maps.InfoWindow({
        content: "É aqui a Hollywood!"
    })

    // Marcador
    const marker = new google.maps.Marker({
        position: hollywood,
        map: map,
        title: "Hollywood"
    })

    // Listener
    marker.addListener('click', function() {
        infowindow.open(map, marker);
    })

}