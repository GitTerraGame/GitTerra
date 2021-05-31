async function checkJobStatus(postdata, setIsGenerating, setGenerationError) {
  let response = await fetch("/api/mapStatus", {
    method: "POST",
    body: JSON.stringify(postdata),
    headers: { "Content-type": "application/json" },
  });

  if (!response.ok) {
    setIsGenerating(false);
    setGenerationError(
      "We have problems generating your map, please try again later."
    );
    return;
  }

  let job = await response.json();
  if (job.complete) {
    window.location.href = job.mapPageURL;
  } else {
    setTimeout(() => {
      checkJobStatus(postdata, setIsGenerating, setGenerationError);
    }, 3000);
  }
}

export default async function generateMap(
  repo,
  setIsGenerating,
  setGenerationError
) {
  const repoRequest = { repo };

  let response = await fetch("/api/generateMap", {
    method: "POST",
    body: JSON.stringify(repoRequest),
    headers: { "Content-type": "application/json" },
  });

  if (!response.ok) {
    setIsGenerating(false);
    setGenerationError(
      "We couldn't start generating your map, please try again later."
    );
    return;
  }

  setIsGenerating(true);

  checkJobStatus(repoRequest, setIsGenerating, setGenerationError);
}
