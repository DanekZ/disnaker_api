import { S3Client, PutObjectCommand, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const REGION = process.env.AWS_REGION || process.env.AWS_DEFAULT_REGION || "";
const BUCKET = process.env.AWS_S3_BUCKET || process.env.S3_BUCKET || "";

const s3 = new S3Client({ region: REGION, credentials: { accessKeyId: process.env.AWS_ACCESS_KEY_ID || "", secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || "" } });

export async function presignPut(key: string, contentType: string) {
  const cmd = new PutObjectCommand({ Bucket: BUCKET, Key: key, ContentType: contentType });
  const url = await getSignedUrl(s3, cmd, { expiresIn: 900 });
  return { url, key };
}

export async function presignGet(key: string) {
  const cmd = new GetObjectCommand({ Bucket: BUCKET, Key: key });
  const url = await getSignedUrl(s3, cmd, { expiresIn: 900 });
  return { url, key };
}
