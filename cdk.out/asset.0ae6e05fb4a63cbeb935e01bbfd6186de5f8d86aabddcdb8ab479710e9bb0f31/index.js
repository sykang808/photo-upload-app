"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// lambdas/coffee-listing-api-public.ts
var coffee_listing_api_public_exports = {};
__export(coffee_listing_api_public_exports, {
  handler: () => handler
});
module.exports = __toCommonJS(coffee_listing_api_public_exports);
var AWS = __toESM(require("aws-sdk"));
var crypto = __toESM(require("crypto"));
var response = {
  headers: {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Credentials": true
  }
};
async function handler(event) {
  if (event.resource === "/images") {
    if (event.httpMethod === "GET") {
      return getAllS3Items();
    }
    if (event.httpMethod === "POST") {
      return postCreateS3PresignedPostUrl(event);
    }
  }
  console.log(JSON.stringify(event, null, 2));
  response.statusCode = 404;
  response.body = JSON.stringify({ ok: false, payload: "Route not found" });
  return response;
}
var { BUCKET_NAME = "", BUCKER_UPLOAD_FOLDER_NAME = "" } = process.env;
var s3 = new AWS.S3();
var bucketParams = {
  Bucket: BUCKET_NAME,
  Prefix: BUCKER_UPLOAD_FOLDER_NAME
};
async function getAllS3Items() {
  let s3List = await s3.listObjects(bucketParams).promise();
  let s3Contents = s3List.Contents || [];
  let images = s3Contents.sort((a, b) => {
    let dateA = a.LastModified;
    let dateB = b.LastModified;
    return new Date(dateB).getTime() - new Date(dateA).getTime();
  }).map((item) => {
    let { Key = "" } = item;
    return { id: Key.split(".")[0], url: Key };
  });
  response.statusCode = 200;
  response.body = JSON.stringify(images);
  return response;
}
async function postCreateS3PresignedPostUrl(event) {
  let body = JSON.parse(event.body);
  let id = crypto.randomBytes(16).toString("hex");
  let presignedPostUrl = s3.createPresignedPost({
    Bucket: BUCKET_NAME,
    Fields: {
      key: `${BUCKER_UPLOAD_FOLDER_NAME}/${id}.${body.fileName.split(".").pop()}`
    }
  });
  response.statusCode = 200;
  response.body = JSON.stringify(presignedPostUrl);
  return response;
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  handler
});
