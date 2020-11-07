import { Request, Response, NextFunction } from 'express';
import axiosForFace from '../helpers/axiosForFace';
import { AxiosError } from 'axios';
import getFaceImage from '../helpers/getFaceImage';
import triggerTraining from '../helpers/triggerTraining';

//need special error handler for routes that involved uploading and detecting
//faces since the error payload given by axios for response is sometimes too huge
const handleErrorForImageSendingRoutes = (err: AxiosError, next: NextFunction) => {
    // console.log(err.response);
    //? err.response.data : err
    next(new Error('some problem occured in the face recognition process'));
};

export default {
    add: async (req: Request, res: Response, next: NextFunction): Promise<Response> => {
        try {
            // we expect name : String and userData : String in request body
            const resp = await axiosForFace.post(
                `/largePersonGroups/${process.env['LARGE_PERSON_GROUP_ID']}/persons`,
                req.body,
            );
            return res.send(resp.data);
        } catch (err) {
            next(err);
        }
    },
    listPeople: async (req: Request, res: Response, next: NextFunction): Promise<Response> => {
        try {
            console.log('sending get request bro');
            const resp = await axiosForFace.get(`/largePersonGroups/${process.env['LARGE_PERSON_GROUP_ID']}/persons`);
            return res.send(resp.data);
            // https://{endpoint}/face/v1.0/largepersongroups/{largePersonGroupId}/persons
        } catch (err) {
            next(err);
        }
    },
    addFace: async (req: Request, res: Response, next: NextFunction): Promise<Response> => {
        try {
            let face;
            if (!req.query.useUrl) {
                face = await getFaceImage();
            }
            const resp = await axiosForFace.post(
                `/largepersongroups/${process.env['LARGE_PERSON_GROUP_ID']}/persons/${req.params.personId}/persistedfaces?detectionModel=detection_02`,
                req.query.useUrl === 'true' ? { url: req.body.url } : face,
                {
                    headers: {
                        'Content-Type': req.query.useUrl === 'true' ? 'application/json' : 'application/octet-stream',
                    },
                },
            );

            //now let's trigger training for that particular large person group
            await triggerTraining(process.env['LARGE_PERSON_GROUP_ID']);

            return res.send(resp.data);
        } catch (err) {
            handleErrorForImageSendingRoutes(err, next);
        }
    },
    identify: async (req: Request, res: Response, next: NextFunction): Promise<Response> => {
        try {
            //first we will generate a temporarily available face on azure servers
            const file = await getFaceImage();

            //     : {
            //     data: Array<{
            //         faceId: string;
            //     }>;
            // }
            let resp = await axiosForFace.post(
                //only recognition model 3 can be used here since our large person group
                //is trained to only work with that
                `/detect?returnFaceId=true&recognitionModel=recognition_03&returnRecognitionModel=true`,
                req.query.useUrl === 'true' ? { url: req.body.url } : file,
                {
                    headers: {
                        'Content-Type': req.query.useUrl === 'true' ? 'application/json' : 'application/octet-stream',
                    },
                },
            );

            //we will retrieve this generated face id
            let tempFaceId = resp.data[0]!.faceId;
            console.log('reached here');
            //now we request to identify this newly generated face
            const identifyResp = await axiosForFace.post('/identify', {
                largePersonGroupId: process.env['LARGE_PERSON_GROUP_ID'],
                faceIds: [tempFaceId],
                maxNumOfCandidatesReturned: 1,
            });

            //logging found candidate info
            console.log(identifyResp.data);
            if (identifyResp.data[0].candidates.length === 0) {
                return res.send({
                    message: 'No faces found',
                });
            } else {
                // const primeCandidateId = identifyResp.data[0].candidates[0].personId;
                //now we will retrieve who this person is
                // const candidate = await axiosForFace.get(
                //     `/largepersongroups/${process.env['LARGE_PERSON_GROUP_ID']}/persons/${primeCandidateId}`,
                // );

                return res.send({
                    ...identifyResp.data[0].candidates[0],
                    // , primeCandidate: candidate.data
                });
            }
        } catch (err) {
            handleErrorForImageSendingRoutes(err, next);
        }
    },
    delete: async (req: Request, res: Response, next: NextFunction): Promise<Response> => {
        try {
            // we expect name : String and userData : String in request body
            const resp = await axiosForFace.delete(
                `/largePersonGroups/${process.env['LARGE_PERSON_GROUP_ID']}/persons/${req.params.personId}`,
            );
            return res.send(resp.data);
        } catch (err) {
            next(err);
        }
    },
};
