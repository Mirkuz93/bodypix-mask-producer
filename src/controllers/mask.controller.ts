// import tf from '@tensorflow/tfjs-node-gpu';
import * as tf from '@tensorflow/tfjs-node'
import * as bodyPix from '@tensorflow-models/body-pix';
import { createCanvas, loadImage, createImageData, Image, Canvas } from 'canvas'
import fs from "fs"
import { NextFunction, Request, Response } from 'express';

class MaskController {

    public getMask = async (req: Request, res: Response, next: NextFunction) => {
        console.log("[getMask]");
        
        try {
            const net = await bodyPix.load();
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

    // public getMask = async (req: Request, res: Response, next: NextFunction) => {

    //     // const net = await bodyPix.load({
    //     //     architecture: 'ResNet50',
    //     //     outputStride: 32,
    //     //     quantBytes: 2
    //     // });
    //     const net = await bodyPix.load();
    //     console.log("[Net Loaded]");
        
    //     const img: any = fs.createWriteStream(__dirname + "/test.jpg")
    //     let chunks: any[] = [];

    //     req.on('data', (chunk) => {
    //         chunks.push(chunk);
    //     });


      
    //     req.pipe(img).on("finish", async () => {
    //         console.log("[FINISH]");

    //         const i = await loadImage(__dirname + "/test.jpg")
    //         const canvas = new Canvas(i.width, i.height);
    //         var ctx = canvas.getContext('2d');
    //         ctx.drawImage( i, 0, 0);
    //         const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)

    //         const image = tf.node.decodeImage()            
    //         let segmentation = await net.segmentPerson( input, {
    //             flipHorizontal: false,
    //             internalResolution: 'medium',
    //             segmentationThreshold: 0.7,
    //         });
    //         res.writeHead(200, { 'Content-Type': 'application/octet-stream' });
    //         res.write(Buffer.from("ciao"))
    //         res.end();
    //     });
    // }
}


export default MaskController;