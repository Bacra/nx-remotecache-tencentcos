import COS, { type COSOptions } from 'cos-nodejs-sdk-v5';
import {
  createCustomRunner,
  type RemoteCacheImplementation,
} from 'nx-remotecache-custom';


type TencentRemoteCacheOptions = COSOptions & { Bucket: string, Region: string };

const remoteCacheHandler = async ({ tencentRemoteCache }: { tencentRemoteCache: TencentRemoteCacheOptions }): Promise<RemoteCacheImplementation> => {
  // initEnv(options);

  const cos = new COS(tencentRemoteCache);
  const { Bucket, Region } = tencentRemoteCache;

  return {
    name: 'Tencent COS',

    fileExists: async (filename) => {
      try {
        await cos.headObject({
          Bucket,
          Region,
          Key: filename,
        });

        return true;
      } catch (err) {
        return false;
      }
    },

    // @ts-ignore
    retrieveFile: async filename => cos.getObjectStream({
      Bucket,
      Region,
      Key: filename,
    }),

    storeFile: async (filename, buffer) => {
      await cos.putObject({
        Bucket,
        Region,
        Key: filename,
        Body: buffer,
      });
    },
  };
};

export default createCustomRunner(remoteCacheHandler) as any;
