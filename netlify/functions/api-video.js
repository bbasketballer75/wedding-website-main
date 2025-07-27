import { Storage } from '@google-cloud/storage';

// Initialize storage with credentials from environment
let storageConfig = {};
if (process.env.GCP_SERVICE_ACCOUNT_JSON_BASE64) {
  try {
    const credentials = JSON.parse(
      Buffer.from(process.env.GCP_SERVICE_ACCOUNT_JSON_BASE64, 'base64').toString('utf8')
    );
    storageConfig.credentials = credentials;
  } catch (error) {
    console.error('Failed to decode GCP credentials:', error);
  }
}

export async function handler(event) {
  const storage = new Storage(storageConfig);
  const gcsPath = process.env.WEDDING_VIDEO_GCS_PATH || 'videos/wedding_video.mp4';
  const bucket = storage.bucket(process.env.GCS_BUCKET_NAME);
  const file = bucket.file(gcsPath);

  try {
    const [metadata] = await file.getMetadata();
    const fileSize = parseInt(metadata.size, 10);
    if (!fileSize) {
      return {
        statusCode: 404,
        body: 'Video file not found in GCS.',
      };
    }
    const range = event.headers['range'];
    let start = 0;
    let end = fileSize - 1;
    if (range) {
      const parts = range.replace(/bytes=/, '').split('-');
      start = parseInt(parts[0], 10);
      end = parts[1] ? parseInt(parts[1], 10) : end;
    }
    const stream = file.createReadStream({ start, end });
    let chunks = [];
    for await (const chunk of stream) {
      chunks.push(chunk);
    }
    const body = Buffer.concat(chunks);
    const headers = {
      'Content-Type': 'video/mp4',
      'Content-Length': body.length,
      'Accept-Ranges': 'bytes',
    };
    if (range) {
      headers['Content-Range'] = `bytes ${start}-${end}/${fileSize}`;
      return {
        statusCode: 206,
        headers,
        body: body.toString('base64'),
        isBase64Encoded: true,
      };
    }
    return {
      statusCode: 200,
      headers,
      body: body.toString('base64'),
      isBase64Encoded: true,
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: err.message,
    };
  }
}
