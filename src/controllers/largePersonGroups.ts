import { Request, Response, NextFunction } from 'express';
import axiosForFace from '../helpers/axiosForFace';
import triggerTraining from '../helpers/triggerTraining';

export default {
    get: async (req: Request, res: Response, next: NextFunction): Promise<Response> => {
        try {
            const resp = await axiosForFace.get(
                `/largePersonGroups/${req.params.largePersonGroupId}?returnRecognitionModel=true`,
            );
            console.log(resp.data);
            return res.send(resp.data);
        } catch (err) {
            next(err);
        }
    },
    create: async (req: Request, res: Response, next: NextFunction): Promise<Response> => {
        try {
            const { largePersonGroupId, name, userData, recognitionModel } = req.body;

            //temporarily preventing initialization of any largepersongroup with id other
            //than the one in env variables to save resources
            if (largePersonGroupId === process.env.LARGE_PERSON_GROUP_ID) {
                const resp = await axiosForFace.put(`/largepersongroups/${largePersonGroupId}`, {
                    name,
                    userData,
                    recognitionModel,
                });
                console.log(resp.data);
                return res.send(resp.data);
            } else {
                throw new Error(`large group IDs other than ${process.env.LARGE_PERSON_GROUP_ID} are not allowed`);
            }
        } catch (err) {
            next(err);
        }
    },
    delete: async (req: Request, res: Response, next: NextFunction): Promise<Response> => {
        try {
            const resp = await axiosForFace.delete(`/largePersonGroups/${req.params.largePersonGroupId}`);
            return res.send(resp.data);
        } catch (err) {
            next(err);
        }
    },
    train: async (req: Request, res: Response, next: NextFunction): Promise<Response> => {
        try {
            const resp = await triggerTraining(req.params.largePersonGroupId);
            return res.send(resp.data);
        } catch (err) {
            next(err);
        }
    },
};
