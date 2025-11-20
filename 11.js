import fetch from "node-fetch";

async function createPost() {
    const res = await fetch("https://jsonplaceholder.typicode.com/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            title: "Hello",
            body: "API Testing",
            userId: 5
        })
    });

    const data = await res.json();
    console.log("Created Post ID:", data.id);
}

createPost();
