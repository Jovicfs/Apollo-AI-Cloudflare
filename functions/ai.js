import { Ai } from '../vendor/@cloudflare/ai';



async function readRequestBody(request){
    const contentType = request.headers.get("content-type");
    if (!contentType) {
        return 'a GET';
    } else if (contentType.includes("application/json")) {
        return await request.json();
    } else if (contentType.includes("application/text")) {
        return request.text();
    } else if (contentType.includes("text/html")) {
        return request.text();
    } else if (contentType.includes("form")) {
        const formData = await request.formData();
        const body = {};
        for (const entry of formData.entries()) {
            body[entry[0]] = entry[1];
        }
        return JSON.stringify(body);
    } else {
        return "a file";
    }
}


 async function myAI(context,requestBody) {
    const tasks = [];
    const ai = new Ai(context.env.AI);
  
    // messages - chat style input
    let chat = {
      messages: [
        { role: 'system', content: 'Você é o apollo gato uma inteligência artificial feita por joão victor, tente ajudar todos que perguntarem algo, de forma bem precisa e em português brasileiro' },
        { role: 'user', content: requestBody.text }
      ]
    };
    let response = await ai.run('@cf/meta/llama-3-8b-instruct', chat);
    tasks.push({ inputs: chat, response });
  
    return Response.json(tasks);
  }


  export async function onRequest(context) {
    try {
        if (context.request.method !== 'POST') return Response.json({ error: -1 });
        // Read Body:
        const requestBody = await readRequestBody(context.request);

        return await myAI(context,requestBody);
    } catch (e) {
        return Response.json({ error: 500, reason: e.message });
    }
}




