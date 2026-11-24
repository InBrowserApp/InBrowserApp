import {
  CopyObjectCommand,
  DeleteObjectCommand,
  GetObjectCommand,
  HeadObjectCommand,
  ListBucketsCommand,
  ListObjectsV2Command,
  PutObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3"
import { getSignedUrl } from "@aws-sdk/s3-request-presigner"

import type { Connection, Listing } from "./model"

const textLimit = 256 * 1024
const imageLimit = 8 * 1024 * 1024

function checkKey(key: string) {
  // The browser URL parser resolves dot segments before making the request.
  if (key.split("/").some((segment) => segment === "." || segment === "..")) {
    throw new Error(key, { cause: "unsupported-key" })
  }
}

function encodeSegment(value: string) {
  return encodeURIComponent(value).replace(
    /[!'()*]/g,
    (char) => "%" + char.charCodeAt(0).toString(16).toUpperCase()
  )
}

export type ObjectDetails = {
  contentType: string
  text?: string
  image?: Blob
  saveText?: (text: string) => Promise<unknown>
}

export function createStorage(connection: Connection) {
  const client = new S3Client({
    endpoint: connection.endpoint,
    region: connection.region,
    forcePathStyle: connection.pathStyle,
    credentials: connection.credentials,
    requestChecksumCalculation: "WHEN_REQUIRED",
    responseChecksumValidation: "WHEN_REQUIRED",
    maxAttempts: 2,
  })

  function put(
    Bucket: string,
    Key: string,
    Body: Blob | string,
    ContentType?: string
  ) {
    checkKey(Key)
    return client.send(new PutObjectCommand({ Bucket, Key, Body, ContentType }))
  }

  function remove(Bucket: string, Key: string, IfMatch?: string) {
    checkKey(Key)
    return client.send(new DeleteObjectCommand({ Bucket, Key, IfMatch }))
  }

  return {
    async buckets() {
      const names: string[] = []
      let token: string | undefined
      do {
        const result = await client.send(
          new ListBucketsCommand({ MaxBuckets: 1000, ContinuationToken: token })
        )
        for (const { Name } of result.Buckets ?? []) {
          if (Name) names.push(Name)
        }
        token = result.ContinuationToken
      } while (token)
      return names
    },
    async list(
      Bucket: string,
      Prefix: string,
      ContinuationToken?: string,
      abortSignal?: AbortSignal
    ): Promise<Listing> {
      const response = await client.send(
        new ListObjectsV2Command({
          Bucket,
          Prefix,
          Delimiter: "/",
          MaxKeys: 200,
          ContinuationToken,
          EncodingType: "url",
        }),
        { abortSignal }
      )
      return {
        folders: (response.CommonPrefixes ?? []).flatMap(({ Prefix }) =>
          Prefix === undefined ? [] : [decodeURIComponent(Prefix)]
        ),
        objects: (response.Contents ?? []).flatMap(
          ({ Key, Size, LastModified }) => {
            if (Key === undefined) return []
            return [
              {
                key: decodeURIComponent(Key),
                size: Size,
                modified: LastModified,
              },
            ]
          }
        ),
        next: response.NextContinuationToken,
      }
    },
    put,
    remove,
    makeFolder(Bucket: string, Key: string) {
      checkKey(Key)
      return client.send(
        new PutObjectCommand({ Bucket, Key, Body: "", IfNoneMatch: "*" })
      )
    },
    async etag(Bucket: string, Key: string) {
      checkKey(Key)
      return (await client.send(new HeadObjectCommand({ Bucket, Key }))).ETag
    },
    copy(
      sourceBucket: string,
      sourceKey: string,
      Bucket: string,
      Key: string,
      CopySourceIfMatch?: string
    ) {
      checkKey(Key)
      const CopySource = [sourceBucket, ...sourceKey.split("/")]
        .map(encodeSegment)
        .join("/")
      return client.send(
        new CopyObjectCommand({ Bucket, Key, CopySource, CopySourceIfMatch })
      )
    },
    download(Bucket: string, Key: string) {
      checkKey(Key)
      const filename = Key.split("/").filter(Boolean).at(-1) || "download"
      return getSignedUrl(
        client,
        new GetObjectCommand({
          Bucket,
          Key,
          ResponseContentDisposition:
            "attachment; filename*=UTF-8''" + encodeSegment(filename),
        }),
        { expiresIn: 60 }
      )
    },
    async details(
      Bucket: string,
      Key: string,
      abortSignal: AbortSignal
    ): Promise<ObjectDetails> {
      checkKey(Key)
      const head = await client.send(new HeadObjectCommand({ Bucket, Key }), {
        abortSignal,
      })
      const contentType = head.ContentType ?? "application/octet-stream"
      const mime = contentType.toLowerCase().split(";")[0]?.trim() ?? ""
      const isImage = /^image\/(png|jpeg|gif|webp|avif|bmp|x-icon)$/.test(mime)
      const isText =
        mime.startsWith("text/") ||
        /^application\/(json|xml|javascript|yaml)$/.test(mime) ||
        (mime === "application/octet-stream" &&
          /\.(txt|md|json|csv|xml|ya?ml|log|css|js|html|svg)$/i.test(Key))
      const limit = isImage ? imageLimit : textLimit
      if (
        (!isImage && !isText) ||
        head.ContentEncoding ||
        head.ContentLength === undefined ||
        head.ContentLength > limit
      )
        return { contentType }

      const result = await client.send(
        new GetObjectCommand({
          Bucket,
          Key,
          IfMatch: head.ETag,
          Range: head.ContentLength > 0 ? `bytes=0-${limit - 1}` : undefined,
        }),
        { abortSignal }
      )
      const bytes = await result.Body?.transformToByteArray()
      if (!bytes || bytes.byteLength !== head.ContentLength)
        return { contentType }
      if (isImage)
        return {
          contentType,
          image: new Blob([new Uint8Array(bytes)], { type: mime }),
        }

      let text: string
      try {
        text = new TextDecoder("utf-8", {
          fatal: true,
          ignoreBOM: true,
        }).decode(bytes)
      } catch {
        return { contentType }
      }

      return {
        contentType,
        text,
        saveText: head.ETag
          ? (value) =>
              client.send(
                new PutObjectCommand({
                  Bucket,
                  Key,
                  Body: value,
                  IfMatch: head.ETag,
                  ContentType: contentType,
                  CacheControl: head.CacheControl,
                  ContentDisposition: head.ContentDisposition,
                  ContentLanguage: head.ContentLanguage,
                  Expires: head.Expires,
                  Metadata: head.Metadata,
                  StorageClass: head.StorageClass,
                  ServerSideEncryption: head.ServerSideEncryption,
                  SSEKMSKeyId: head.SSEKMSKeyId,
                  BucketKeyEnabled: head.BucketKeyEnabled,
                })
              )
          : undefined,
      }
    },
  }
}

export type ObjectStorage = ReturnType<typeof createStorage>
