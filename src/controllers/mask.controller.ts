import tf from '@tensorflow/tfjs-node-gpu';
import * as bodyPix from '@tensorflow-models/body-pix';
import { NextFunction, Request, Response } from 'express';

class MaskController {

    public getMask = async (req: Request, res: Response, next: NextFunction) => {
        console.log("[getMask]");
        
        try {
            const net = await bodyPix.load({
                architecture: 'MobileNetV1',
                outputStride: 16,
                multiplier: 0.75,
                quantBytes: 2,
            });
            let chunks: any[] = [];

            req.on('data', (chunk) => {
                chunks.push(chunk);
            });
    
            req.on('end', async () => {
                const image: any = tf.node.decodeImage(Buffer.concat(chunks));
                let segmentation = await net.segmentPerson(image, {
                    flipHorizontal: false,
                    internalResolution: 'medium',
                    segmentationThreshold: 0.7,
                });
    
                res.writeHead(200, { 'Content-Type': 'application/octet-stream' });
                res.write(Buffer.from(segmentation.data));
                res.end();
                tf.dispose(image);
    
            });
            res.sendStatus(200);
        } catch (error) {
            next(error);
        }
    }
}

export default MaskController;