import express from "express";

const app = express();
app.use(express.json());

let queue = [];
let jobStore = {};   // jobId → status

// Add job
app.post("/task", (req, res) => {
    const jobId = Date.now().toString();
    jobStore[jobId] = "pending";
    queue.push(jobId);

    res.json({ jobId });
});

// Check job status
app.get("/status/:id", (req, res) => {
    const id = req.params.id;

    if (!jobStore[id]) {
        return res.status(404).json({ error: "Job not found" });
    }

    res.json({ jobId: id, status: jobStore[id] });
});

// Background worker (process one job every 3 sec)
setInterval(() => {
    if (queue.length === 0) return;

    const jobId = queue.shift();
    jobStore[jobId] = "processing";

    setTimeout(() => {
        jobStore[jobId] = "done";
    }, 2000);
}, 3000);

app.listen(5000, () => console.log("Job Queue API running on 5000"));
