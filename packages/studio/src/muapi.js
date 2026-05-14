import { getModelById, getVideoModelById, getI2IModelById, getI2VModelById, getV2VModelById, getLipSyncModelById } from './models.js';

const MUAPI_BASE = 'https://api.muapi.ai';

async function pollForResult(requestId, apiKey, maxAttempts = 120, interval = 2000) {
  const pollUrl = `${MUAPI_BASE}/api/v1/predictions/${requestId}/result`;
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    await new Promise(resolve => setTimeout(resolve, interval));
    try {
      const response = await fetch(pollUrl, {
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${apiKey}` }
      });
      if (!response.ok) {
        const errText = await response.text();
        if (response.status >= 500) continue;
        throw new Error(`Poll Failed: ${response.status} - ${errText.slice(0, 100)}`);
      }
      const data = await response.json();
      const status = data.status?.toLowerCase();
      if (status === 'completed' || status === 'succeeded' || status === 'success') return data;
      if (status === 'failed' || status === 'error') throw new Error(`Generation failed: ${data.error || 'Unknown error'}`);
    } catch (error) {
      if (attempt === maxAttempts) throw error;
    }
  }
  throw new Error('Generation timed out after polling.');
}

async function submitAndPoll(endpoint, payload, apiKey, onRequestId, maxAttempts = 60) {
  const url = `${MUAPI_BASE}/api/v1${endpoint}`;
  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${apiKey}` },
    body: JSON.stringify(payload)
  });
  if (!response.ok) {
    const errText = await response.text();
    throw new Error(`API Request Failed: ${response.status} ${response.statusText} - ${errText.slice(0, 100)}`);
  }
  const submitData = await response.json();
  const requestId = submitData.request_id || submitData.id;
  if (!requestId) return submitData;
  if (onRequestId) onRequestId(requestId);
  const result = await pollForResult(requestId, apiKey, maxAttempts);
  const outputUrl = result.outputs?.[0] || result.url || result.output?.url;
  return { ...result, url: outputUrl };
}

export async function generateImage(apiKey, params) {
  if (!apiKey) throw new Error('API key required. Add your Muapi key in Settings.')
  if (!params?.prompt?.trim()) throw new Error('Please enter a prompt.')

  const payload = {
    prompt: params.prompt.trim(),
  }

  // ONLY pass fields the user explicitly specified — strict prompt adherence
  if (params.aspect_ratio) payload.aspect_ratio = params.aspect_ratio
  if (params.quality) payload.quality = params.quality
  if (params.num_images) payload.num_images = params.num_images
  if (params.negative_prompt?.trim()) payload.negative_prompt = params.negative_prompt.trim()
  if (params.style && params.style !== 'None') payload.style = params.style
  if (params.resolution) payload.resolution = params.resolution
  if (params.image_url) {
    payload.image_url = params.image_url
    payload.strength = params.strength || 0.6
  } else if (params.images_list?.length > 0) {
    payload.images_list = params.images_list
  }
  if (params.seed && params.seed !== -1) payload.seed = params.seed
  if (params.width) payload.width = params.width
  if (params.height) payload.height = params.height

  const modelDef = getModelById(params.model)
  const endpoint = modelDef?.endpoint || params.model || '/gpt4o-text-to-image'
  return await submitAndPoll(endpoint, payload, apiKey, null, 60)
}

// New object-based API for callers that want strict prompt adherence
export async function generateImageV2({
  apiKey,
  model,
  prompt,
  aspectRatio = '1:1',
  quality = 'standard',
  numImages = 1,
  negativePrompt = '',
  style = null,
  referenceImages = [],
}) {
  return generateImage(apiKey, {
    model,
    prompt,
    aspect_ratio: aspectRatio,
    quality,
    num_images: numImages,
    negative_prompt: negativePrompt || undefined,
    style: style === 'None' ? undefined : style,
    images_list: referenceImages.length > 0 ? referenceImages : undefined,
  })
}

export async function generateVideo(apiKey, params) {
  if (!apiKey) throw new Error('API key required.')
  if (!params?.prompt?.trim()) throw new Error('Please enter a prompt.')

  const payload = {
    prompt: params.prompt.trim(),
  }

  if (params.aspect_ratio) payload.aspect_ratio = params.aspect_ratio
  if (params.duration) payload.duration = params.duration
  if (params.quality) payload.quality = params.quality
  if (params.resolution) payload.resolution = params.resolution
  if (params.image_url) payload.image_url = params.image_url
  if (params.mode) payload.mode = params.mode
  if (params.motion && params.motion !== 'Medium') payload.motion = params.motion
  if (params.camera && params.camera !== 'Static') payload.camera_movement = params.camera

  const modelDef = getModelById(params.model)
  const endpoint = modelDef?.endpoint || params.model || '/seedance-v2.0-t2v'
  return await submitAndPoll(endpoint, payload, apiKey, null, 900)
}

export async function generateLipsync(apiKey, params) {
  if (!apiKey) throw new Error('API key required.')
  const payload = params.image_url
    ? { image_url: params.image_url, audio_url: params.audio_url }
    : { video_url: params.video_url, audio_url: params.audio_url }

  const modelDef = getModelById(params.model)
  const endpoint = modelDef?.endpoint || params.model || '/infinite-talk'
  return await submitAndPoll(endpoint, payload, apiKey, null, 900)
}

export async function generateI2I(apiKey, params) {
  const modelInfo = getI2IModelById(params.model);
  const endpoint = modelInfo?.endpoint || params.model;
  const payload = {};
  if (params.prompt) payload.prompt = params.prompt;
  const imageField = modelInfo?.imageField || 'image_url';
  const imagesList = params.images_list?.length > 0 ? params.images_list : (params.image_url ? [params.image_url] : null);
  if (imagesList) {
    if (imageField === 'images_list') payload.images_list = imagesList;
    else payload[imageField] = imagesList[0];
  }
  if (params.aspect_ratio) payload.aspect_ratio = params.aspect_ratio;
  if (params.resolution) payload.resolution = params.resolution;
  if (params.quality) payload.quality = params.quality;
  return submitAndPoll(endpoint, payload, apiKey, null, 60);
}

export async function generateI2V(apiKey, params) {
  const modelInfo = getI2VModelById(params.model);
  const endpoint = modelInfo?.endpoint || params.model;
  const payload = {};
  if (params.prompt) payload.prompt = params.prompt;
  const imageField = modelInfo?.imageField || 'image_url';
  if (params.image_url) {
    if (imageField === 'images_list') payload.images_list = [params.image_url];
    else payload[imageField] = params.image_url;
  }
  const lastImageField = modelInfo?.lastImageField;
  if (lastImageField && params.last_image) {
    payload[lastImageField] = params.last_image;
  }
  if (params.aspect_ratio) payload.aspect_ratio = params.aspect_ratio;
  if (params.duration) payload.duration = params.duration;
  if (params.resolution) payload.resolution = params.resolution;
  if (params.quality) payload.quality = params.quality;
  if (params.mode) payload.mode = params.mode;
  return submitAndPoll(endpoint, payload, apiKey, null, 900);
}

export async function marketingGenerateVideo(apiKey, params) {
  const endpoint = params.resolution === '1080p' ? 'sd-2-vip-omni-reference-1080p' : 'seedance-2-vip-omni-reference';
  const payload = {
    prompt: params.prompt,
    aspect_ratio: params.aspect_ratio || '16:9',
    duration: params.duration || 5,
    images_list: params.images_list || [],
    video_files: params.video_files || []
  };
  return submitAndPoll(endpoint, payload, apiKey, null, 900);
}

export { marketingGenerateVideo as generateMarketingStudioAd }

export async function processV2V(apiKey, params) {
  const modelInfo = getV2VModelById(params.model);
  const endpoint = modelInfo?.endpoint || params.model;
  const videoField = modelInfo?.videoField || 'video_url';
  const payload = { [videoField]: params.video_url };
  if (modelInfo?.imageField && params.image_url) {
    payload[modelInfo.imageField] = params.image_url;
  }
  if (modelInfo?.hasPrompt && params.prompt) {
    payload.prompt = params.prompt;
  }
  return submitAndPoll(endpoint, payload, apiKey, null, 900);
}

export async function processLipSync(apiKey, params) {
  const modelInfo = getLipSyncModelById(params.model);
  const endpoint = modelInfo?.endpoint || params.model;
  const payload = {};
  if (params.audio_url) payload.audio_url = params.audio_url;
  if (params.image_url) payload.image_url = params.image_url;
  if (params.video_url) payload.video_url = params.video_url;
  if (modelInfo?.hasPrompt) payload.prompt = params.prompt || '';
  if (params.resolution) payload.resolution = params.resolution;
  if (params.seed !== undefined && params.seed !== -1) payload.seed = params.seed;
  return submitAndPoll(endpoint, payload, apiKey, null, 900);
}

export function uploadFile(apiKey, file, onProgress) {
  return new Promise((resolve, reject) => {
    const url = `${MUAPI_BASE}/api/v1/upload_file`;
    const formData = new FormData();
    formData.append('file', file);

    const xhr = new XMLHttpRequest();
    xhr.open('POST', url);
    xhr.setRequestHeader('x-api-key', apiKey);

    if (onProgress) {
      xhr.upload.onprogress = (event) => {
        if (event.lengthComputable) {
          const percentComplete = Math.round((event.loaded / event.total) * 100);
          onProgress(percentComplete);
        }
      };
    }

    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        try {
          const data = JSON.parse(xhr.responseText);
          const fileUrl = data.url || data.file_url || data.data?.url;
          if (!fileUrl) {
            reject(new Error('No URL returned from file upload'));
          } else {
            resolve(fileUrl);
          }
        } catch (e) {
          reject(new Error('Failed to parse upload response'));
        }
      } else {
        let detail = xhr.statusText;
        try {
          const errObj = JSON.parse(xhr.responseText);
          detail = errObj.detail || detail;
        } catch (e) {}
        reject(new Error(`File upload failed: ${xhr.status} - ${detail}`));
      }
    };

    xhr.onerror = () => reject(new Error('Network error during file upload'));
    xhr.send(formData);
  });
}

export async function getUserBalance(apiKey) {
  const response = await fetch(`${MUAPI_BASE}/api/v1/account/balance`, {
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey
    }
  });
  if (!response.ok) {
    const errText = await response.text();
    throw new Error(`Failed to fetch balance: ${response.status} - ${errText.slice(0, 100)}`);
  }
  return await response.json();
}

export async function getTemplateWorkflows(apiKey) {
  const response = await fetch(`${MUAPI_BASE}/workflow/get-template-workflows`, {
    headers: { 'Content-Type': 'application/json', 'x-api-key': apiKey }
  });
  if (!response.ok) throw new Error(`Failed to fetch template workflows: ${response.status}`);
  return await response.json();
};

export async function getUserWorkflows(apiKey) {
  const response = await fetch(`${MUAPI_BASE}/workflow/get-workflow-defs`, {
    headers: { 'Content-Type': 'application/json', 'x-api-key': apiKey }
  });
  if (!response.ok) throw new Error(`Failed to fetch user workflows: ${response.status}`);
  return await response.json();
};

export async function getPublishedWorkflows(apiKey) {
  const response = await fetch(`${MUAPI_BASE}/workflow/get-published-workflows`, {
    headers: { 'Content-Type': 'application/json', 'x-api-key': apiKey }
  });
  if (!response.ok) throw new Error(`Failed to fetch published workflows: ${response.status}`);
  return await response.json();
};

export async function getTemplateAgents(apiKey) {
  const response = await fetch(`${MUAPI_BASE}/agents/templates/agents`, {
    headers: { 'Content-Type': 'application/json', 'x-api-key': apiKey }
  });
  if (!response.ok) throw new Error(`Failed to fetch template agents: ${response.status}`);
  const data = await response.json();
  return Array.isArray(data) ? data : (data.agents || data.items || []);
};

export async function getUserAgents(apiKey) {
  const response = await fetch(`${MUAPI_BASE}/agents/user/agents`, {
    headers: { 'Content-Type': 'application/json', 'x-api-key': apiKey }
  });
  if (!response.ok) throw new Error(`Failed to fetch user agents: ${response.status}`);
  const data = await response.json();
  return Array.isArray(data) ? data : (data.agents || data.items || []);
};

export async function getPublishedAgents(apiKey) {
  const response = await fetch(`${MUAPI_BASE}/agents/featured/agents`, {
    headers: { 'Content-Type': 'application/json', 'x-api-key': apiKey }
  });
  if (!response.ok) throw new Error(`Failed to fetch featured agents: ${response.status}`);
  const data = await response.json();
  return Array.isArray(data) ? data : (data.agents || data.items || []);
};

export async function getUserConversations(apiKey) {
  const response = await fetch(`${MUAPI_BASE}/agents/user/conversations`, {
    headers: { 'Content-Type': 'application/json', 'x-api-key': apiKey }
  });
  if (!response.ok) throw new Error(`Failed to fetch conversations: ${response.status}`);
  const data = await response.json();
  return Array.isArray(data) ? data : [];
};

export async function createWorkflow(apiKey, payload) {
  const response = await fetch(`${MUAPI_BASE}/workflow/create`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'x-api-key': apiKey },
    body: JSON.stringify(payload)
  });
  if (!response.ok) throw new Error(`Failed to create workflow: ${response.status}`);
  return await response.json();
};

export async function updateWorkflowName(apiKey, workflowId, name) {
  const response = await fetch(`${MUAPI_BASE}/workflow/update-name/${workflowId}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'x-api-key': apiKey },
    body: JSON.stringify({ name })
  });
  if (!response.ok) throw new Error(`Failed to rename workflow: ${response.status}`);
  return await response.json();
};

export async function deleteWorkflow(apiKey, workflowId) {
  const response = await fetch(`${MUAPI_BASE}/workflow/delete-workflow-def/${workflowId}`, {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json', 'x-api-key': apiKey }
  });
  if (!response.ok) throw new Error(`Failed to delete workflow: ${response.status}`);
  return await response.json();
};

export async function getWorkflowInputs(apiKey, workflowId) {
  const response = await fetch(`${MUAPI_BASE}/workflow/${workflowId}/api-inputs`, {
    headers: { 'Content-Type': 'application/json', 'x-api-key': apiKey }
  });
  if (!response.ok) throw new Error(`Failed to fetch workflow inputs: ${response.status}`);
  return await response.json();
};

export async function executeWorkflow(apiKey, workflowId, inputs) {
  const response = await fetch(`${MUAPI_BASE}/workflow/${workflowId}/api-execute`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'x-api-key': apiKey },
    body: JSON.stringify({ inputs })
  });
  if (!response.ok) throw new Error(`Failed to execute workflow: ${response.status}`);
  const submitData = await response.json();
  const runId = submitData.run_id || submitData.id;
  if (!runId) return submitData;
  return await pollWorkflowResult(runId, apiKey);
};

async function pollWorkflowResult(runId, apiKey, maxAttempts = 900, interval = 2000) {
  const pollUrl = `${MUAPI_BASE}/workflow/run/${runId}/api-outputs`;
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    await new Promise(resolve => setTimeout(resolve, interval));
    try {
      const response = await fetch(pollUrl, {
        headers: { 'Content-Type': 'application/json', 'x-api-key': apiKey }
      });
      if (!response.ok) {
        if (response.status >= 500) continue;
        throw new Error(`Poll Failed: ${response.status}`);
      }
      const data = await response.json();
      const status = data.status?.toLowerCase();
      if (status === 'completed' || status === 'succeeded' || status === 'success') return data;
      if (status === 'failed' || status === 'error') throw new Error(`Workflow failed: ${data.error || 'Unknown error'}`);
    } catch (error) {
      if (attempt === maxAttempts) throw error;
    }
  }
  throw new Error('Workflow timed out after polling.');
};

export async function getAllNodeSchemas(apiKey, workflowId) {
  const response = await fetch(`${MUAPI_BASE}/workflow/${workflowId}/node-schemas`, {
    headers: { 'Content-Type': 'application/json', 'x-api-key': apiKey }
  });
  if (!response.ok) throw new Error(`Failed to fetch node schemas: ${response.status}`);
  return await response.json();
};

export async function getWorkflowData(apiKey, workflowId) {
  const response = await fetch(`${MUAPI_BASE}/workflow/get-workflow-def/${workflowId}`, {
    headers: { 'Content-Type': 'application/json', 'x-api-key': apiKey }
  });
  if (!response.ok) throw new Error(`Failed to fetch workflow data: ${response.status}`);
  return await response.json();
};

export async function getNodeSchemas(apiKey, workflowId) {
  const response = await fetch(`${MUAPI_BASE}/workflow/${workflowId}/api-node-schemas`, {
    headers: { 'Content-Type': 'application/json', 'x-api-key': apiKey }
  });
  if (!response.ok) throw new Error(`Failed to fetch node schemas: ${response.status}`);
  return await response.json();
}

export async function runSingleNode(apiKey, workflowId, nodeId, payload) {
  const response = await fetch(`${MUAPI_BASE}/workflow/${workflowId}/node/${nodeId}/run`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'x-api-key': apiKey },
    body: JSON.stringify(payload)
  });
  if (!response.ok) throw new Error(`Failed to run single node: ${response.status}`);
  return await response.json();
}

export async function deleteNodeRun(apiKey, nodeRunId) {
  const response = await fetch(`${MUAPI_BASE}/workflow/node-run/${nodeRunId}`, {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json', 'x-api-key': apiKey }
  });
  if (!response.ok) throw new Error(`Failed to delete node run: ${response.status}`);
  return await response.json();
}

export async function getNodeStatus(apiKey, runId) {
  const response = await fetch(`${MUAPI_BASE}/workflow/run/${runId}/status`, {
    headers: { 'Content-Type': 'application/json', 'x-api-key': apiKey }
  });
  if (!response.ok) throw new Error(`Failed to get node status: ${response.status}`);
  return await response.json();
}

export async function handleProxyRequest(prefix, path, method, headers, body, apiKey) {
  const url = `${MUAPI_BASE}/${prefix}/${path}`;
  const finalHeaders = new Headers(headers);
  finalHeaders.delete('host');
  finalHeaders.delete('connection');
  finalHeaders.delete('content-length');
  if (apiKey) finalHeaders.set('x-api-key', apiKey);

  try {
    const response = await fetch(url, {
      method,
      headers: finalHeaders,
      body: (method !== 'GET' && method !== 'HEAD') ? body : undefined,
      redirect: 'follow',
    });
    const contentType = response.headers.get('Content-Type') || 'application/json';
    const buffer = await response.arrayBuffer();
    return { status: response.status, contentType, data: buffer };
  } catch (error) {
    console.error(`MuAPI Proxy error for ${url}:`, error);
    throw error;
  }
}

export async function handleServerSideProxy(prefix, request, params, apiKey) {
  try {
    const slug = await params;
    const pathSegments = slug.path || [];
    const path = pathSegments.join('/');
    const method = request.method;
    let body = null;
    if (method !== 'GET' && method !== 'HEAD') {
      body = await request.arrayBuffer();
    }
    const { search } = new URL(request.url);
    const pathWithSearch = search ? `${path}${search}` : path;
    return await handleProxyRequest(prefix, pathWithSearch, method, request.headers, body, apiKey);
  } catch (error) {
    console.error(`Server proxy failed:`, error);
    throw error;
  }
}

export async function calculateDynamicCost(apiKey, taskName, payload) {
  const response = await fetch(`${MUAPI_BASE}/api/v1/app/calculate_dynamic_cost`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'x-api-key': apiKey },
    body: JSON.stringify({ task_name: taskName, payload })
  });
  if (!response.ok) throw new Error(`Failed to calculate dynamic cost: ${response.status}`);
  return await response.json();
}

export async function registerAppInterest(apiKey, appName) {
  const response = await fetch(`${MUAPI_BASE}/app/interest`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'x-api-key': apiKey },
    body: JSON.stringify({ app_name: appName })
  });
  if (!response.ok) throw new Error(`Failed to register interest: ${response.status}`);
  return await response.json();
}

export async function getAppInterests(apiKey) {
  const response = await fetch(`${MUAPI_BASE}/app/interests`, {
    headers: { 'Content-Type': 'application/json', 'x-api-key': apiKey }
  });
  if (!response.ok) throw new Error(`Failed to fetch interests: ${response.status}`);
  return await response.json();
}

// ============================================================
// Cinema & Marketing API helpers
// ============================================================

export async function pollResult(apiKey, jobId, maxAttempts = 120) {
  for (let i = 0; i < maxAttempts; i++) {
    await new Promise(r => setTimeout(r, 2500))
    const res = await fetch(`${MUAPI_BASE}/api/v1/predict/results/${jobId}`, {
      headers: { 'Authorization': `Bearer ${apiKey}` }
    })
    if (!res.ok) continue
    const data = await res.json()
    if (data.status === 'succeeded' || data.output || data.url) {
      return { url: data.url || data.output?.url || data.output?.[0], thumbnail: data.thumbnail_url }
    }
    if (data.status === 'failed') throw new Error('Generation failed')
  }
  throw new Error('Timed out')
}

export async function uploadFileV2(apiKey, file) {
  const fd = new FormData()
  fd.append('file', file)
  const res = await fetch(`${MUAPI_BASE}/api/v1/upload`, {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${apiKey}` },
    body: fd,
  })
  if (!res.ok) throw new Error('Upload failed')
  const data = await res.json()
  return data.url || data.file_url
}

export async function applyVFX(apiKey, { effectName, imageUrl, prompt, aspectRatio, duration, quality }) {
  const body = {
    prompt: prompt ? `${effectName}: ${prompt}` : effectName,
    image_url: imageUrl,
    name: effectName,
    aspect_ratio: aspectRatio || '16:9',
    duration: duration || 5,
    quality: quality || 'medium',
  }
  const res = await fetch(`${MUAPI_BASE}/api/v1/vfx`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${apiKey}` },
    body: JSON.stringify(body),
  })
  if (!res.ok) { const e = await res.json().catch(()=>({})); throw new Error(e.message || 'VFX failed') }
  const data = await res.json()
  const jobId = data.id || data.request_id
  if (!jobId) return { url: data.url }
  return await pollResult(apiKey, jobId)
}

export async function generateVideoAd(apiKey, { modelId, prompt, aspectRatio, duration, quality }) {
  const body = { prompt, aspect_ratio: aspectRatio, duration, quality: quality || 'high' }
  const res = await fetch(`${MUAPI_BASE}/api/v1/${modelId}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${apiKey}` },
    body: JSON.stringify(body),
  })
  if (!res.ok) { const e = await res.json().catch(()=>({})); throw new Error(e.message || 'Failed') }
  const data = await res.json()
  const jobId = data.id || data.request_id
  if (!jobId) return { url: data.url }
  return await pollResult(apiKey, jobId)
}

export async function applyColorGrade(apiKey, { videoUrl, gradeStyle, customParams }) {
  const body = { video_url: videoUrl, style: gradeStyle, ...customParams }
  const res = await fetch(`${MUAPI_BASE}/api/v1/ai-video-effects`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${apiKey}` },
    body: JSON.stringify(body),
  })
  if (!res.ok) throw new Error('Color grade failed')
  const data = await res.json()
  const jobId = data.id || data.request_id
  if (!jobId) return { url: data.url }
  return await pollResult(apiKey, jobId)
}
