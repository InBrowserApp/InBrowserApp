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
import { beforeEach, describe, expect, it, vi } from "vitest"

import { createStorage } from "./s3"

import type { Connection } from "./model"

const { send } = vi.hoisted(() => ({ send: vi.fn() }))

vi.mock("@aws-sdk/client-s3", async (importOriginal) => ({
  ...(await importOriginal<typeof import("@aws-sdk/client-s3")>()),
  S3Client: vi.fn(
    class {
      send = send
    }
  ),
}))

vi.mock("@aws-sdk/s3-request-presigner", () => ({
  getSignedUrl: vi.fn(),
}))

const connection: Connection = {
  id: "storage",
  name: "Storage",
  endpoint: "https://s3.example.test",
  region: "auto",
  pathStyle: true,
  buckets: ["archive"],
  remember: false,
  credentials: {
    accessKeyId: "EXAMPLE",
    secretAccessKey: "example-secret",
    sessionToken: "example-token",
  },
}

function expectRequest(index: number, command: unknown, input: object) {
  const request = send.mock.calls[index]?.[0]
  expect(request).toBeInstanceOf(command)
  expect(request?.input).toEqual(input)
}

beforeEach(() => {
  vi.clearAllMocks()
  send.mockReset()
})

it("discovers buckets across pages using the profile's endpoint and settings", async () => {
  send
    .mockResolvedValueOnce({
      Buckets: [{ Name: "archive" }, {}],
      ContinuationToken: "token",
    })
    .mockResolvedValueOnce({ Buckets: [{ Name: "photos" }] })
  const storage = createStorage(connection)
  expect(S3Client).toHaveBeenCalledWith(
    expect.objectContaining({
      endpoint: connection.endpoint,
      credentials: connection.credentials,
      region: "auto",
      forcePathStyle: true,
      requestChecksumCalculation: "WHEN_REQUIRED",
    })
  )
  await expect(storage.buckets()).resolves.toEqual(["archive", "photos"])
  expectRequest(0, ListBucketsCommand, {
    MaxBuckets: 1000,
    ContinuationToken: undefined,
  })
  expectRequest(1, ListBucketsCommand, {
    MaxBuckets: 1000,
    ContinuationToken: "token",
  })
})

it("handles an empty bucket discovery response", async () => {
  send.mockResolvedValueOnce({})
  await expect(createStorage(connection).buckets()).resolves.toEqual([])
  expect(send).toHaveBeenCalledOnce()
})

it("decodes encoded folder and object names while retaining the current folder marker", async () => {
  const modified = new Date("2026-06-15T01:30:00Z")
  const signal = new AbortController().signal
  send.mockResolvedValueOnce({
    CommonPrefixes: [{ Prefix: "folder%2Fnest%20%25%2F" }, {}],
    Contents: [
      { Key: "folder%2F", Size: 0 },
      {
        Key: "folder%2F%23caf%C3%A9%252F.txt",
        Size: 20,
        LastModified: modified,
      },
      { Key: "folder%2Fzero", Size: 0 },
      {},
    ],
    NextContinuationToken: "next-token",
  })
  await expect(
    createStorage(connection).list("archive", "folder/", "token", signal)
  ).resolves.toEqual({
    folders: ["folder/nest %/"],
    objects: [
      { key: "folder/", size: 0 },
      { key: "folder/#café%2F.txt", size: 20, modified },
      { key: "folder/zero", size: 0 },
    ],
    next: "next-token",
  })
  expectRequest(0, ListObjectsV2Command, {
    Bucket: "archive",
    Prefix: "folder/",
    Delimiter: "/",
    MaxKeys: 200,
    ContinuationToken: "token",
    EncodingType: "url",
  })
  expect(send.mock.calls[0]?.[1]).toEqual({ abortSignal: signal })
})

it("handles an empty prefix listing", async () => {
  send.mockResolvedValueOnce({})
  await expect(createStorage(connection).list("archive", "")).resolves.toEqual({
    folders: [],
    objects: [],
    next: undefined,
  })
})

it("uploads, copies, and deletes exact object keys, encoding the copy source", async () => {
  const storage = createStorage(connection)
  const file = new Blob(["abc"], { type: "text/plain" })
  await storage.put("archive", "folder/α.txt", file, "text/plain")
  expectRequest(0, PutObjectCommand, {
    Bucket: "archive",
    Key: "folder/α.txt",
    Body: file,
    ContentType: "text/plain",
  })

  const key = "/folder names/café+%?#&!*'().txt"
  await storage.copy("archive", key, "backup", "destination/café.txt")
  expectRequest(1, CopyObjectCommand, {
    Bucket: "backup",
    Key: "destination/café.txt",
    CopySource:
      "archive//folder%20names/caf%C3%A9%2B%25%3F%23%26%21%2A%27%28%29.txt",
    CopySourceIfMatch: undefined,
  })
  await storage.remove("archive", key)
  expectRequest(2, DeleteObjectCommand, {
    Bucket: "archive",
    Key: key,
    IfMatch: undefined,
  })
})

it("creates folders without overwriting and supports version-aware copy and delete", async () => {
  const storage = createStorage(connection)
  const tag = '"same-version"'
  await storage.makeFolder("archive", "folder/")
  expectRequest(0, PutObjectCommand, {
    Bucket: "archive",
    Key: "folder/",
    Body: "",
    IfNoneMatch: "*",
  })
  send.mockResolvedValueOnce({ ETag: tag })
  await expect(storage.etag("archive", "folder/file")).resolves.toBe(tag)
  expectRequest(1, HeadObjectCommand, { Bucket: "archive", Key: "folder/file" })
  await storage.copy("archive", "folder/file", "backup", "file", tag)
  expectRequest(2, CopyObjectCommand, {
    Bucket: "backup",
    Key: "file",
    CopySource: "archive/folder/file",
    CopySourceIfMatch: tag,
  })
  await storage.remove("archive", "folder/file", tag)
  expectRequest(3, DeleteObjectCommand, {
    Bucket: "archive",
    Key: "folder/file",
    IfMatch: tag,
  })
})

it("rejects keys that the browser would normalize before sending a request", async () => {
  const storage = createStorage(connection)
  expect(() => storage.put("archive", "folder/../file", "")).toThrow(
    "folder/../file"
  )
  expect(() => storage.makeFolder("archive", "folder/./")).toThrow("folder/./")
  expect(() => storage.copy("archive", "file", "backup", "./file")).toThrow(
    "./file"
  )
  expect(() => storage.remove("archive", "../file")).toThrow("../file")
  expect(() => storage.download("archive", "../file")).toThrow("../file")
  await expect(storage.etag("archive", "./file")).rejects.toMatchObject({
    cause: "unsupported-key",
  })
  await expect(
    storage.details("archive", "../file", new AbortController().signal)
  ).rejects.toMatchObject({ cause: "unsupported-key" })
  expect(send).not.toHaveBeenCalled()
  expect(getSignedUrl).not.toHaveBeenCalled()
})

it.each([
  ["folder/résumé ('*).txt", "r%C3%A9sum%C3%A9%20%28%27%2A%29.txt"],
  ["folder/", "folder"],
  ["/", "download"],
])("signs a short-lived attachment download for %s", async (key, filename) => {
  vi.mocked(getSignedUrl).mockResolvedValueOnce(
    "https://s3.example.test/download?signed"
  )
  await expect(
    createStorage(connection).download("archive", key)
  ).resolves.toBe("https://s3.example.test/download?signed")
  const [client, command, options] = vi.mocked(getSignedUrl).mock.calls[0] ?? []
  expect(client).toBeInstanceOf(S3Client)
  expect(command).toBeInstanceOf(GetObjectCommand)
  expect(command?.input).toEqual({
    Bucket: "archive",
    Key: key,
    ResponseContentDisposition: "attachment; filename*=UTF-8''" + filename,
  })
  expect(options).toEqual({ expiresIn: 60 })
})

describe("object preview", () => {
  const signal = new AbortController().signal

  function readable(bytes: Uint8Array) {
    return { Body: { transformToByteArray: vi.fn().mockResolvedValue(bytes) } }
  }

  it("reads UTF-8 text using a bounded conditional GET and preserves metadata when editing", async () => {
    const bytes = new TextEncoder().encode("\uFEFFOlá")
    const headers = {
      ContentType: "Text/Plain; charset=utf-8",
      ContentLength: bytes.byteLength,
      ETag: '"etag"',
      CacheControl: "max-age=60",
      ContentDisposition: "inline",
      ContentLanguage: "pt",
      Expires: new Date("2026-10-20T01:00:00Z"),
      Metadata: { owner: "test" },
      StorageClass: "STANDARD_IA",
      ServerSideEncryption: "aws:kms",
      SSEKMSKeyId: "test-kms-key",
      BucketKeyEnabled: true,
    }
    send.mockResolvedValueOnce(headers).mockResolvedValueOnce(readable(bytes))
    const detail = await createStorage(connection).details(
      "archive",
      "text.txt",
      signal
    )

    expect(detail).toMatchObject({
      contentType: headers.ContentType,
      text: "\uFEFFOlá",
    })
    expectRequest(0, HeadObjectCommand, { Bucket: "archive", Key: "text.txt" })
    expectRequest(1, GetObjectCommand, {
      Bucket: "archive",
      Key: "text.txt",
      IfMatch: '"etag"',
      Range: "bytes=0-262143",
    })
    expect(send.mock.calls[0]?.[1]).toEqual({ abortSignal: signal })
    expect(send.mock.calls[1]?.[1]).toEqual({ abortSignal: signal })

    expect(detail.saveText).toBeTypeOf("function")
    await detail.saveText?.("new text")
    expectRequest(2, PutObjectCommand, {
      Bucket: "archive",
      Key: "text.txt",
      Body: "new text",
      IfMatch: '"etag"',
      ContentType: headers.ContentType,
      CacheControl: headers.CacheControl,
      ContentDisposition: headers.ContentDisposition,
      ContentLanguage: headers.ContentLanguage,
      Expires: headers.Expires,
      Metadata: headers.Metadata,
      StorageClass: headers.StorageClass,
      ServerSideEncryption: headers.ServerSideEncryption,
      SSEKMSKeyId: headers.SSEKMSKeyId,
      BucketKeyEnabled: headers.BucketKeyEnabled,
    })
  })

  it("allows empty text previews without a range but offers no edit when the ETag is missing", async () => {
    send
      .mockResolvedValueOnce({ ContentLength: 0 })
      .mockResolvedValueOnce(readable(new Uint8Array()))
    await expect(
      createStorage(connection).details("archive", "config.JSON", signal)
    ).resolves.toEqual({
      contentType: "application/octet-stream",
      text: "",
      saveText: undefined,
    })
    expectRequest(1, GetObjectCommand, {
      Bucket: "archive",
      Key: "config.JSON",
      IfMatch: undefined,
      Range: undefined,
    })
  })

  it("returns an inert image blob for supported raster formats", async () => {
    const bytes = new Uint8Array([137, 80, 78, 71])
    send
      .mockResolvedValueOnce({
        ContentType: "image/png",
        ContentLength: bytes.length,
      })
      .mockResolvedValueOnce(readable(bytes))
    const detail = await createStorage(connection).details(
      "archive",
      "image",
      signal
    )
    expect(detail.image).toBeInstanceOf(Blob)
    expect(detail.image?.type).toBe("image/png")
    expect(detail.image?.size).toBe(bytes.length)
    expect(detail.text).toBeUndefined()
  })

  it.each([
    { ContentType: "image/svg+xml", ContentLength: 30 },
    { ContentType: "application/pdf", ContentLength: 50 },
    { ContentType: "text/plain", ContentLength: 10, ContentEncoding: "gzip" },
    { ContentType: "text/plain" },
    { ContentType: "application/json", ContentLength: 262144 + 1 },
    { ContentType: "image/jpeg", ContentLength: 8388608 + 1 },
  ])(
    "does not fetch an unsupported, unbounded, or oversized preview (%j)",
    async (headers) => {
      send.mockResolvedValueOnce(headers)
      await expect(
        createStorage(connection).details("archive", "key", signal)
      ).resolves.toEqual({
        contentType: headers.ContentType,
      })
      expect(send).toHaveBeenCalledOnce()
    }
  )

  it.each([
    {},
    readable(new Uint8Array([65])),
    readable(new Uint8Array([255, 254])),
  ])(
    "offers no preview when the body is missing, truncated, or invalid UTF-8 (%j)",
    async (body) => {
      send
        .mockResolvedValueOnce({
          ContentType: "application/xml",
          ContentLength: 2,
        })
        .mockResolvedValueOnce(body)
      await expect(
        createStorage(connection).details("archive", "object", signal)
      ).resolves.toEqual({
        contentType: "application/xml",
      })
    }
  )
})
