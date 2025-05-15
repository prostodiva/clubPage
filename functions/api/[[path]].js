export async function onRequest(context) {
  // Handle CORS preflight requests
  if (context.request.method === 'OPTIONS') {
    console.log('Handling CORS preflight request');
    return new Response(null, {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        'Access-Control-Max-Age': '86400'
      }
    });
  }

  try {
    const url = new URL(context.request.url);
    const path = url.pathname.replace('/api/', '');
    const targetUrl = new URL(`https://clubpage-api-env.eba-rstfvjmj.us-west-1.elasticbeanstalk.com/${path}`);
    
    console.log('Incoming request:', {
      method: context.request.method,
      path: path,
      url: url.toString()
    });

    // Clone the request and modify it for the target
    const modifiedRequest = new Request(targetUrl, {
      method: context.request.method,
      headers: {
        ...Object.fromEntries(context.request.headers),
        'Host': targetUrl.host,
        'Origin': targetUrl.origin,
        'Accept': 'application/json'
      },
      body: context.request.body,
      redirect: 'follow',
    });

    console.log('Proxying request:', {
      from: url.toString(),
      to: targetUrl.toString(),
      method: context.request.method,
      headers: Object.fromEntries(modifiedRequest.headers)
    });

    const response = await fetch(modifiedRequest);
    
    console.log('Received response:', {
      status: response.status,
      statusText: response.statusText,
      headers: Object.fromEntries(response.headers)
    });

    // Clone the response and modify headers
    const modifiedResponse = new Response(response.body, {
      status: response.status,
      statusText: response.statusText,
      headers: {
        ...Object.fromEntries(response.headers),
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization'
      }
    });

    return modifiedResponse;
  } catch (error) {
    console.error('Proxy error:', {
      message: error.message,
      stack: error.stack,
      url: context.request.url
    });
    
    return new Response(JSON.stringify({ 
      error: 'API request failed',
      message: error.message,
      details: error.stack
    }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
    });
  }
} 