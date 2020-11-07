import { StillCamera } from 'pi-camera-connect';
export default async () => {
    try {
        const stillCamera = new StillCamera();
        const image = await stillCamera.takeImage();
        return image;
    } catch (err) {
        console.log(err);
    }
};
