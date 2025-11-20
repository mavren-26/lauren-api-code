import fetch from "node-fetch";

async function getUser() {
    const res = await fetch("https://jsonplaceholder.typicode.com/users/1");
    const data = await res.json();

    console.log("Name:", data.name);
    console.log("Email:", data.email);
    console.log("City:", data.address.city);
}

getUser();
