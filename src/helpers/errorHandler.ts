import { NextFunction, Response, Request } from 'express';
export default (err: any, req: Request, res: Response, next: NextFunction): Response => {
    // console.log('error caught', err);
    console.log(err.data);
    console.log(err.message);
    console.error(err.response ? err.response.data : '');
    return res.status(400).send({ message: err.message, error: err });
};
