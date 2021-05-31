async function checkJobStatus({
  postdata,
  onGenerationSuccess,
  onGenerationError,
}) {
  let response = await fetch("/api/mapStatus", {
    method: "POST",
    body: JSON.stringify(postdata),
    headers: { "Content-type": "application/json" },
  });

  if (!response.ok) {
    onGenerationError(
      "We have problems generating your map, please try again later."
    );
    return;
  }

  let job = await response.json();
  if (job.complete) {
    onGenerationSuccess(job.mapPageURL);
  } else {
    setTimeout(() => {
      checkJobStatus({ postdata, onGenerationSuccess, onGenerationError });
    }, 3000);
  }
}

export default async function generateMap({
  repo,
  onGenerationStart,
  onGenerationError,
  onGenerationSuccess,
}) {
  const postdata = { repo };

  let response = await fetch("/api/generateMap", {
    method: "POST",
    body: JSON.stringify(postdata),
    headers: { "Content-type": "application/json" },
  });

  if (!response.ok) {
    onGenerationError(
      "We couldn't start generating your map, please try again later."
    );
    return;
  }

  onGenerationStart();

  checkJobStatus({ postdata, onGenerationSuccess, onGenerationError });
}
