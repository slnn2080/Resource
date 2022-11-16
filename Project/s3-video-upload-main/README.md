# s3-video-upload

```ts
// env.ts
const Bucket = "YOUR_BUCKET_NAME";
const region = "YOUR_BUCKET_REGION";
const IdentityPoolId = `${region}:YOUR_IdentityPoolId`;
const folderName = "YOUR_FOLDER_NAME";

// for ./examples/*
const albumBucketName = Bucket;
const bucketRegion = region;

export { Bucket, region, IdentityPoolId, folderName };
```

```bash
npm i
npm run dev
```
