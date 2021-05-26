async function checkJobStatus(postdata) {
  try {
    let response = await fetch("/api/mapStatus", {
      method: "POST",
      body: JSON.stringify(postdata),
      headers: { "Content-type": "application/json" },
    });

    if (!response.ok) {
      throw new Error(`Can't check map status: ${response.statusText}`);
    }

    let job = await response.json();
    if (job.complete) {
      window.location.href = job.mapPageURL;
    }
  } catch (err) {
    console.log(err);
    throw new Error(err.message);
  }
}

export default async function generateMap(repo, setIsGenerating) {
  const repoRequest = { repo };

  try {
    let response = await fetch("/api/generateMap", {
      method: "POST",
      body: JSON.stringify(repoRequest),
      headers: { "Content-type": "application/json" },
    });

    if (!response.ok) {
      throw new Error(`Can't generate map: ${response.statusText}`);
    }
  } catch (err) {
    console.log(err);
    throw new Error(err.message);
  }

  setIsGenerating(true);

  checkJobStatus(repoRequest);
  setInterval(() => {
    checkJobStatus(repoRequest);
  }, 3000); //every 3sec
}
