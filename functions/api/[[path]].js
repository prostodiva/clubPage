export async function onRequest(context) {
  const url = new URL(context.request.url);
  const targetUrl = new URL(context.request.url.replace('/api/', 'http://clubpage-api-env.eba-rstfvjmj.us-west-1.elasticbeanstalk.com/'));
  
  // Clone the request and modify it for the target
  const modifiedRequest = new Request(targetUrl, {
    method: context.request.method,
    headers: context.request.headers,
    body: context.request.body,
    redirect: 'follow',
  });

  try {
    const response = await fetch(modifiedRequest);
    return response;
  } catch (error) {
    return new Response(JSON.stringify({ error: 'API request failed' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
} 