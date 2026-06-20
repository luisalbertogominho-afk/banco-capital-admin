function getDB(){
    return JSON.parse(localStorage.getItem("BANK_DB") || "{}");
}

function saveDB(db){
    localStorage.setItem("BANK_DB", JSON.stringify(db));
}

// =====================
// CARREGAR USERS
// =====================
function loadUsers(){

    let db = getDB();

    let list = document.getElementById("users");
    list.innerHTML = "";

    for(let u in db){

        if(u === "ADMIN_REQUESTS") continue;

        let li = document.createElement("li");

        li.innerText =
            u +
            " | Conta: " + db[u].conta +
            " | Saldo: $" + db[u].saldo;

        list.appendChild(li);
    }
}

// =====================
// DAR DINHEIRO
// =====================
function giveMoney(){

    let user = document.getElementById("user").value;
    let value = Number(document.getElementById("value").value);

    let db = getDB();

    if(!db[user]){
        alert("Usuário não existe!");
        return;
    }

    db[user].saldo += value;

    db[user].historico.push(
        "[ADMIN] +$" + value
    );

    saveDB(db);

    alert("Dinheiro enviado!");
    loadUsers();
}

// =====================
// EMPRÉSTIMOS
// =====================
function loadLoans(){

    let db = getDB();

    let list = document.getElementById("loans");
    list.innerHTML = "";

    let loans = db["ADMIN_REQUESTS"] || [];

    loans.forEach((l, index) => {

        let li = document.createElement("li");

        li.innerHTML =
            l.user + " pediu $" + l.valor +
            " <button onclick='approve(" + index + ")'>Aprovar</button>";

        list.appendChild(li);
    });
}

// =====================
// APROVAR EMPRÉSTIMO
// =====================
function approve(i){

    let db = getDB();

    let loan = db["ADMIN_REQUESTS"][i];

    if(!db[loan.user]) return;

    db[loan.user].saldo += loan.valor;

    db[loan.user].historico.push(
        "[ADMIN] Empréstimo aprovado +" + loan.valor
    );

    db["ADMIN_REQUESTS"].splice(i,1);

    saveDB(db);

    loadLoans();
    loadUsers();
}

// =====================
// AUTO UPDATE
// =====================
setInterval(() => {
    loadUsers();
    loadLoans();
}, 3000);

// init
loadUsers();
loadLoans();
